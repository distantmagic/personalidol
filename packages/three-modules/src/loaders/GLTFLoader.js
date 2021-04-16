import { BufferAttribute } from "three/src/core/BufferAttribute";
import { BufferGeometry } from "three/src/core/BufferGeometry";
import { FileLoader } from "three/src/loaders/FileLoader";
import { Group } from "three/src/objects/Group";
import { InterleavedBuffer } from "three/src/core/InterleavedBuffer";
import { InterleavedBufferAttribute } from "three/src/core/InterleavedBufferAttribute";
import { Line } from "three/src/objects/Line";
import { LineLoop } from "three/src/objects/LineLoop";
import { LineSegments } from "three/src/objects/LineSegments";
import { Loader } from "three/src/loaders/Loader";
import { LoaderUtils } from "three/src/loaders/LoaderUtils";
import { Matrix4 } from "three/src/math/Matrix4";
import { Mesh } from "three/src/objects/Mesh";
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial";
import { Object3D } from "three/src/core/Object3D";
import { Points } from "three/src/objects/Points";
import { PropertyBinding } from "three/src/animation/PropertyBinding";

import {
  FrontSide,
  TriangleFanDrawMode,
  TriangleStripDrawMode,
} from "three/src/constants";

var GLTFLoader = ( function () {

  function GLTFLoader( manager ) {

    Loader.call( this, manager );

    this.dracoLoader = null;
    this.ddsLoader = null;
    this.ktx2Loader = null;
    this.meshoptDecoder = null;

    this.pluginCallbacks = [];

  }

  GLTFLoader.prototype = Object.assign( Object.create( Loader.prototype ), {

    constructor: GLTFLoader,

    load: function ( url, onLoad, onProgress, onError ) {

      var scope = this;

      var resourcePath;

      if ( this.resourcePath !== '' ) {

        resourcePath = this.resourcePath;

      } else if ( this.path !== '' ) {

        resourcePath = this.path;

      } else {

        resourcePath = LoaderUtils.extractUrlBase( url );

      }

      // Tells the LoadingManager to track an extra item, which resolves after
      // the model is fully loaded. This means the count of items loaded will
      // be incorrect, but ensures manager.onLoad() does not fire early.
      this.manager.itemStart( url );

      var _onError = function ( e ) {

        if ( onError ) {

          onError( e );

        } else {

          console.error( e );

        }

        scope.manager.itemError( url );
        scope.manager.itemEnd( url );

      };

      var loader = new FileLoader( this.manager );

      loader.setPath( this.path );
      loader.setResponseType( 'arraybuffer' );
      loader.setRequestHeader( this.requestHeader );
      loader.setWithCredentials( this.withCredentials );

      loader.load( url, function ( data ) {

        try {

          scope.parse( data, resourcePath, function ( gltf ) {

            onLoad( gltf );

            scope.manager.itemEnd( url );

          }, _onError );

        } catch ( e ) {

          _onError( e );

        }

      }, onProgress, _onError );

    },

    parse: function ( data, path, onLoad, onError ) {

      var content;
      var extensions = {};
      var plugins = {};

      if ( typeof data === 'string' ) {

        content = data;

      } else {

        var magic = LoaderUtils.decodeText( new Uint8Array( data, 0, 4 ) );

        if ( magic === BINARY_EXTENSION_HEADER_MAGIC ) {

          try {

            extensions[ EXTENSIONS.KHR_BINARY_GLTF ] = new GLTFBinaryExtension( data );

          } catch ( error ) {

            if ( onError ) onError( error );
            return;

          }

          content = extensions[ EXTENSIONS.KHR_BINARY_GLTF ].content;

        } else {

          content = LoaderUtils.decodeText( new Uint8Array( data ) );

        }

      }

      var json = JSON.parse( content );

      if ( json.asset === undefined || json.asset.version[ 0 ] < 2 ) {

        if ( onError ) onError( new Error( 'THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.' ) );
        return;

      }

      var parser = new GLTFParser( json, {

        path: path || this.resourcePath || '',
        crossOrigin: this.crossOrigin,
        manager: this.manager,
        ktx2Loader: this.ktx2Loader,
        meshoptDecoder: this.meshoptDecoder

      } );

      parser.fileLoader.setRequestHeader( this.requestHeader );

      for ( var i = 0; i < this.pluginCallbacks.length; i ++ ) {

        var plugin = this.pluginCallbacks[ i ]( parser );
        plugins[ plugin.name ] = plugin;

        // Workaround to avoid determining as unknown extension
        // in addUnknownExtensionsToUserData().
        // Remove this workaround if we move all the existing
        // extension handlers to plugin system
        extensions[ plugin.name ] = true;

      }

      parser.setExtensions( extensions );
      parser.setPlugins( plugins );
      parser.parse( onLoad, onError );

    }

  } );

  /* GLTFREGISTRY */

  function GLTFRegistry() {

    var objects = {};

    return  {

      get: function ( key ) {

        return objects[ key ];

      },

      add: function ( key, object ) {

        objects[ key ] = object;

      },

      remove: function ( key ) {

        delete objects[ key ];

      },

      removeAll: function () {

        objects = {};

      }

    };

  }

  /*********************************/
  /********** EXTENSIONS ***********/
  /*********************************/

  var EXTENSIONS = {
    KHR_BINARY_GLTF: 'KHR_binary_glTF',
    KHR_DRACO_MESH_COMPRESSION: 'KHR_draco_mesh_compression',
  };

  /* BINARY EXTENSION */
  var BINARY_EXTENSION_HEADER_MAGIC = 'glTF';
  var BINARY_EXTENSION_HEADER_LENGTH = 12;
  var BINARY_EXTENSION_CHUNK_TYPES = { JSON: 0x4E4F534A, BIN: 0x004E4942 };

  function GLTFBinaryExtension( data ) {

    this.name = EXTENSIONS.KHR_BINARY_GLTF;
    this.content = null;
    this.body = null;

    var headerView = new DataView( data, 0, BINARY_EXTENSION_HEADER_LENGTH );

    this.header = {
      magic: LoaderUtils.decodeText( new Uint8Array( data.slice( 0, 4 ) ) ),
      version: headerView.getUint32( 4, true ),
      length: headerView.getUint32( 8, true )
    };

    if ( this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC ) {

      throw new Error( 'THREE.GLTFLoader: Unsupported glTF-Binary header.' );

    } else if ( this.header.version < 2.0 ) {

      throw new Error( 'THREE.GLTFLoader: Legacy binary file detected.' );

    }

    var chunkContentsLength = this.header.length - BINARY_EXTENSION_HEADER_LENGTH;
    var chunkView = new DataView( data, BINARY_EXTENSION_HEADER_LENGTH );
    var chunkIndex = 0;

    while ( chunkIndex < chunkContentsLength ) {

      var chunkLength = chunkView.getUint32( chunkIndex, true );
      chunkIndex += 4;

      var chunkType = chunkView.getUint32( chunkIndex, true );
      chunkIndex += 4;

      if ( chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON ) {

        var contentArray = new Uint8Array( data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength );
        this.content = LoaderUtils.decodeText( contentArray );

      } else if ( chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN ) {

        var byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
        this.body = data.slice( byteOffset, byteOffset + chunkLength );

      }

      // Clients must ignore chunks with unknown types.

      chunkIndex += chunkLength;

    }

    if ( this.content === null ) {

      throw new Error( 'THREE.GLTFLoader: JSON content not found.' );

    }

  }

  /*********************************/
  /********** INTERNALS ************/
  /*********************************/

  /* CONSTANTS */

  var WEBGL_CONSTANTS = {
    FLOAT: 5126,
    //FLOAT_MAT2: 35674,
    FLOAT_MAT3: 35675,
    FLOAT_MAT4: 35676,
    FLOAT_VEC2: 35664,
    FLOAT_VEC3: 35665,
    FLOAT_VEC4: 35666,
    LINEAR: 9729,
    REPEAT: 10497,
    SAMPLER_2D: 35678,
    POINTS: 0,
    LINES: 1,
    LINE_LOOP: 2,
    LINE_STRIP: 3,
    TRIANGLES: 4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN: 6,
    UNSIGNED_BYTE: 5121,
    UNSIGNED_SHORT: 5123
  };

  var WEBGL_COMPONENT_TYPES = {
    5120: Int8Array,
    5121: Uint8Array,
    5122: Int16Array,
    5123: Uint16Array,
    5125: Uint32Array,
    5126: Float32Array
  };

  var WEBGL_TYPE_SIZES = {
    'SCALAR': 1,
    'VEC2': 2,
    'VEC3': 3,
    'VEC4': 4,
    'MAT2': 4,
    'MAT3': 9,
    'MAT4': 16
  };

  var ATTRIBUTES = {
    POSITION: 'position',
    NORMAL: 'normal',
    TANGENT: 'tangent',
    TEXCOORD_0: 'uv',
    TEXCOORD_1: 'uv2',
    COLOR_0: 'color',
    WEIGHTS_0: 'skinWeight',
    JOINTS_0: 'skinIndex',
  };

  /* UTILITY FUNCTIONS */

  function resolveURL( url, path ) {

    // Invalid URL
    if ( typeof url !== 'string' || url === '' ) return '';

    // Host Relative URL
    if ( /^https?:\/\//i.test( path ) && /^\//.test( url ) ) {

      path = path.replace( /(^https?:\/\/[^\/]+).*/i, '$1' );

    }

    // Absolute URL http://,https://,//
    if ( /^(https?:)?\/\//i.test( url ) ) return url;

    // Data URI
    if ( /^data:.*,.*$/i.test( url ) ) return url;

    // Blob URL
    if ( /^blob:.*$/i.test( url ) ) return url;

    // Relative URL
    return path + url;

  }

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#default-material
   */
  function createDefaultMaterial( cache ) {

    if ( cache[ 'DefaultMaterial' ] === undefined ) {

      cache[ 'DefaultMaterial' ] = new MeshStandardMaterial( {
        color: 0xFFFFFF,
        emissive: 0x000000,
        metalness: 1,
        roughness: 1,
        transparent: false,
        depthTest: true,
        side: FrontSide
      } );

    }

    return cache[ 'DefaultMaterial' ];

  }

  function createPrimitiveKey( primitiveDef ) {

    var dracoExtension = primitiveDef.extensions && primitiveDef.extensions[ EXTENSIONS.KHR_DRACO_MESH_COMPRESSION ];
    var geometryKey;

    if ( dracoExtension ) {

      geometryKey = 'draco:' + dracoExtension.bufferView
        + ':' + dracoExtension.indices
        + ':' + createAttributesKey( dracoExtension.attributes );

    } else {

      geometryKey = primitiveDef.indices + ':' + createAttributesKey( primitiveDef.attributes ) + ':' + primitiveDef.mode;

    }

    return geometryKey;

  }

  function createAttributesKey( attributes ) {

    var attributesKey = '';

    var keys = Object.keys( attributes ).sort();

    for ( var i = 0, il = keys.length; i < il; i ++ ) {

      attributesKey += keys[ i ] + ':' + attributes[ keys[ i ] ] + ';';

    }

    return attributesKey;

  }

  /* GLTF PARSER */

  function GLTFParser( json, options ) {

    this.json = json || {};
    this.extensions = {};
    this.plugins = {};
    this.options = options || {};

    // loader object cache
    this.cache = new GLTFRegistry();

    // associations between Three.js objects and glTF elements
    this.associations = new Map();

    // BufferGeometry caching
    this.primitiveCache = {};

    // Object3D instance caches
    this.meshCache = { refs: {}, uses: {} };
    this.cameraCache = { refs: {}, uses: {} };
    this.lightCache = { refs: {}, uses: {} };

    // Track node names, to ensure no duplicates
    this.nodeNamesUsed = {};

    this.fileLoader = new FileLoader( this.options.manager );
    this.fileLoader.setResponseType( 'arraybuffer' );

    if ( this.options.crossOrigin === 'use-credentials' ) {

      this.fileLoader.setWithCredentials( true );

    }

  }

  GLTFParser.prototype.setExtensions = function ( extensions ) {

    this.extensions = extensions;

  };

  GLTFParser.prototype.setPlugins = function ( plugins ) {

    this.plugins = plugins;

  };

  GLTFParser.prototype.parse = function ( onLoad, onError ) {

    var parser = this;
    var json = this.json;

    // Clear the loader cache
    this.cache.removeAll();

    // Mark the special nodes/meshes in json for efficient parse
    this._invokeAll( function ( ext ) {

      return ext._markDefs && ext._markDefs();

    } );

    Promise.all( [

      this.getDependencies( 'scene' ),

    ] ).then( function ( dependencies ) {

      var result = {
        scene: dependencies[ 0 ][ json.scene || 0 ],
        scenes: dependencies[ 0 ],
        animations: dependencies[ 1 ],
        cameras: dependencies[ 2 ],
        asset: json.asset,
        parser: parser,
        userData: {}
      };

      onLoad( result );

    } ).catch( onError );

  };

  /**
   * Marks the special nodes/meshes in json for efficient parse.
   */
  GLTFParser.prototype._markDefs = function () {

    var nodeDefs = this.json.nodes || [];

    // Iterate over all nodes, marking references to shared resources,
    // as well as skeleton joints.
    for ( var nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex ++ ) {

      var nodeDef = nodeDefs[ nodeIndex ];

      if ( nodeDef.mesh !== undefined ) {

        this._addNodeRef( this.meshCache, nodeDef.mesh );

      }

    }

  };

  /**
   * Counts references to shared node / Object3D resources. These resources
   * can be reused, or "instantiated", at multiple nodes in the scene
   * hierarchy. Mesh, Camera, and Light instances are instantiated and must
   * be marked. Non-scenegraph resources (like Materials, Geometries, and
   * Textures) can be reused directly and are not marked here.
   *
   * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
   */
  GLTFParser.prototype._addNodeRef = function ( cache, index ) {

    if ( index === undefined ) return;

    if ( cache.refs[ index ] === undefined ) {

      cache.refs[ index ] = cache.uses[ index ] = 0;

    }

    cache.refs[ index ] ++;

  };

  /** Returns a reference to a shared resource, cloning it if necessary. */
  GLTFParser.prototype._getNodeRef = function ( cache, index, object ) {

    if ( cache.refs[ index ] <= 1 ) return object;

    var ref = object.clone();

    ref.name += '_instance_' + ( cache.uses[ index ] ++ );

    return ref;

  };

  GLTFParser.prototype._invokeOne = function ( func ) {

    var extensions = Object.values( this.plugins );
    extensions.push( this );

    for ( var i = 0; i < extensions.length; i ++ ) {

      var result = func( extensions[ i ] );

      if ( result ) return result;

    }

  };

  GLTFParser.prototype._invokeAll = function ( func ) {

    var extensions = Object.values( this.plugins );
    extensions.unshift( this );

    var pending = [];

    for ( var i = 0; i < extensions.length; i ++ ) {

      var result = func( extensions[ i ] );

      if ( result ) pending.push( result );

    }

    return pending;

  };

  /**
   * Requests the specified dependency asynchronously, with caching.
   * @param {string} type
   * @param {number} index
   * @return {Promise<Object3D|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
   */
  GLTFParser.prototype.getDependency = function ( type, index ) {

    var cacheKey = type + ':' + index;
    var dependency = this.cache.get( cacheKey );

    if ( ! dependency ) {

      switch ( type ) {

        case 'scene':
          dependency = this.loadScene( index );
          break;

        case 'node':
          dependency = this.loadNode( index );
          break;

        case 'mesh':
          dependency = this._invokeOne( function ( ext ) {

            return ext.loadMesh && ext.loadMesh( index );

          } );
          break;

        case 'accessor':
          dependency = this.loadAccessor( index );
          break;

        case 'bufferView':
          dependency = this._invokeOne( function ( ext ) {

            return ext.loadBufferView && ext.loadBufferView( index );

          } );
          break;

        case 'buffer':
          dependency = this.loadBuffer( index );
          break;

        default:
          throw new Error( 'Unknown type: ' + type );

      }

      this.cache.add( cacheKey, dependency );

    }

    return dependency;

  };

  /**
   * Requests all dependencies of the specified type asynchronously, with caching.
   * @param {string} type
   * @return {Promise<Array<Object>>}
   */
  GLTFParser.prototype.getDependencies = function ( type ) {

    var dependencies = this.cache.get( type );

    if ( ! dependencies ) {

      var parser = this;
      var defs = this.json[ type + ( type === 'mesh' ? 'es' : 's' ) ] || [];

      dependencies = Promise.all( defs.map( function ( def, index ) {

        return parser.getDependency( type, index );

      } ) );

      this.cache.add( type, dependencies );

    }

    return dependencies;

  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferIndex
   * @return {Promise<ArrayBuffer>}
   */
  GLTFParser.prototype.loadBuffer = function ( bufferIndex ) {

    var bufferDef = this.json.buffers[ bufferIndex ];
    var loader = this.fileLoader;

    if ( bufferDef.type && bufferDef.type !== 'arraybuffer' ) {

      throw new Error( 'THREE.GLTFLoader: ' + bufferDef.type + ' buffer type is not supported.' );

    }

    // If present, GLB container is required to be the first buffer.
    if ( bufferDef.uri === undefined && bufferIndex === 0 ) {

      return Promise.resolve( this.extensions[ EXTENSIONS.KHR_BINARY_GLTF ].body );

    }

    var options = this.options;

    return new Promise( function ( resolve, reject ) {

      loader.load( resolveURL( bufferDef.uri, options.path ), resolve, undefined, function () {

        reject( new Error( 'THREE.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".' ) );

      } );

    } );

  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferViewIndex
   * @return {Promise<ArrayBuffer>}
   */
  GLTFParser.prototype.loadBufferView = function ( bufferViewIndex ) {

    var bufferViewDef = this.json.bufferViews[ bufferViewIndex ];

    return this.getDependency( 'buffer', bufferViewDef.buffer ).then( function ( buffer ) {

      var byteLength = bufferViewDef.byteLength || 0;
      var byteOffset = bufferViewDef.byteOffset || 0;
      return buffer.slice( byteOffset, byteOffset + byteLength );

    } );

  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
   * @param {number} accessorIndex
   * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
   */
  GLTFParser.prototype.loadAccessor = function ( accessorIndex ) {

    var parser = this;
    var json = this.json;

    var accessorDef = this.json.accessors[ accessorIndex ];

    if ( accessorDef.bufferView === undefined && accessorDef.sparse === undefined ) {

      // Ignore empty accessors, which may be used to declare runtime
      // information about attributes coming from another source (e.g. Draco
      // compression extension).
      return Promise.resolve( null );

    }

    var pendingBufferViews = [];

    if ( accessorDef.bufferView !== undefined ) {

      pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.bufferView ) );

    } else {

      pendingBufferViews.push( null );

    }

    if ( accessorDef.sparse !== undefined ) {

      pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.sparse.indices.bufferView ) );
      pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.sparse.values.bufferView ) );

    }

    return Promise.all( pendingBufferViews ).then( function ( bufferViews ) {

      var bufferView = bufferViews[ 0 ];

      var itemSize = WEBGL_TYPE_SIZES[ accessorDef.type ];
      var TypedArray = WEBGL_COMPONENT_TYPES[ accessorDef.componentType ];

      // For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
      var elementBytes = TypedArray.BYTES_PER_ELEMENT;
      var itemBytes = elementBytes * itemSize;
      var byteOffset = accessorDef.byteOffset || 0;
      var byteStride = accessorDef.bufferView !== undefined ? json.bufferViews[ accessorDef.bufferView ].byteStride : undefined;
      var normalized = accessorDef.normalized === true;
      var array, bufferAttribute;

      // The buffer is not interleaved if the stride is the item size in bytes.
      if ( byteStride && byteStride !== itemBytes ) {

        // Each "slice" of the buffer, as defined by 'count' elements of 'byteStride' bytes, gets its own InterleavedBuffer
        // This makes sure that IBA.count reflects accessor.count properly
        var ibSlice = Math.floor( byteOffset / byteStride );
        var ibCacheKey = 'InterleavedBuffer:' + accessorDef.bufferView + ':' + accessorDef.componentType + ':' + ibSlice + ':' + accessorDef.count;
        var ib = parser.cache.get( ibCacheKey );

        if ( ! ib ) {

          array = new TypedArray( bufferView, ibSlice * byteStride, accessorDef.count * byteStride / elementBytes );

          // Integer parameters to IB/IBA are in array elements, not bytes.
          ib = new InterleavedBuffer( array, byteStride / elementBytes );

          parser.cache.add( ibCacheKey, ib );

        }

        bufferAttribute = new InterleavedBufferAttribute( ib, itemSize, ( byteOffset % byteStride ) / elementBytes, normalized );

      } else {

        if ( bufferView === null ) {

          array = new TypedArray( accessorDef.count * itemSize );

        } else {

          array = new TypedArray( bufferView, byteOffset, accessorDef.count * itemSize );

        }

        bufferAttribute = new BufferAttribute( array, itemSize, normalized );

      }

      // https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#sparse-accessors
      if ( accessorDef.sparse !== undefined ) {

        var itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
        var TypedArrayIndices = WEBGL_COMPONENT_TYPES[ accessorDef.sparse.indices.componentType ];

        var byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
        var byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;

        var sparseIndices = new TypedArrayIndices( bufferViews[ 1 ], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices );
        var sparseValues = new TypedArray( bufferViews[ 2 ], byteOffsetValues, accessorDef.sparse.count * itemSize );

        if ( bufferView !== null ) {

          // Avoid modifying the original ArrayBuffer, if the bufferView wasn't initialized with zeroes.
          bufferAttribute = new BufferAttribute( bufferAttribute.array.slice(), bufferAttribute.itemSize, bufferAttribute.normalized );

        }

        for ( var i = 0, il = sparseIndices.length; i < il; i ++ ) {

          var index = sparseIndices[ i ];

          bufferAttribute.setX( index, sparseValues[ i * itemSize ] );
          if ( itemSize >= 2 ) bufferAttribute.setY( index, sparseValues[ i * itemSize + 1 ] );
          if ( itemSize >= 3 ) bufferAttribute.setZ( index, sparseValues[ i * itemSize + 2 ] );
          if ( itemSize >= 4 ) bufferAttribute.setW( index, sparseValues[ i * itemSize + 3 ] );
          if ( itemSize >= 5 ) throw new Error( 'THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.' );

        }

      }

      return bufferAttribute;

    } );

  };

  GLTFParser.prototype.getMaterialType = function ( /* materialIndex */ ) {

    return MeshStandardMaterial;

  };

  /** When Object3D instances are targeted by animation, they need unique names. */
  GLTFParser.prototype.createUniqueName = function ( originalName ) {

    var sanitizedName = PropertyBinding.sanitizeNodeName( originalName || '' );

    var name = sanitizedName;

    for ( var i = 1; this.nodeNamesUsed[ name ]; ++ i ) {

      name = sanitizedName + '_' + i;

    }

    this.nodeNamesUsed[ name ] = true;

    return name;

  };

  /**
   * @param {BufferGeometry} geometry
   * @param {GLTF.Primitive} primitiveDef
   * @param {GLTFParser} parser
   * @return {Promise<BufferGeometry>}
   */
  function addPrimitiveAttributes( geometry, primitiveDef, parser ) {

    var attributes = primitiveDef.attributes;

    var pending = [];

    function assignAttributeAccessor( accessorIndex, attributeName ) {

      return parser.getDependency( 'accessor', accessorIndex )
        .then( function ( accessor ) {

          geometry.setAttribute( attributeName, accessor );

        } );

    }

    for ( var gltfAttributeName in attributes ) {

      var threeAttributeName = ATTRIBUTES[ gltfAttributeName ] || gltfAttributeName.toLowerCase();

      // Skip attributes already provided by e.g. Draco extension.
      if ( threeAttributeName in geometry.attributes ) continue;

      pending.push( assignAttributeAccessor( attributes[ gltfAttributeName ], threeAttributeName ) );

    }

    if ( primitiveDef.indices !== undefined && ! geometry.index ) {

      var accessor = parser.getDependency( 'accessor', primitiveDef.indices ).then( function ( accessor ) {

        geometry.setIndex( accessor );

      } );

      pending.push( accessor );

    }

    return Promise.all( pending ).then( function () {

      return geometry;

    } );

  }

  /**
   * @param {BufferGeometry} geometry
   * @param {Number} drawMode
   * @return {BufferGeometry}
   */
  function toTrianglesDrawMode( geometry, drawMode ) {

    var index = geometry.getIndex();

    // generate index if not present

    if ( index === null ) {

      var indices = [];

      var position = geometry.getAttribute( 'position' );

      if ( position !== undefined ) {

        for ( var i = 0; i < position.count; i ++ ) {

          indices.push( i );

        }

        geometry.setIndex( indices );
        index = geometry.getIndex();

      } else {

        console.error( 'THREE.GLTFLoader.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.' );
        return geometry;

      }

    }

    //

    var numberOfTriangles = index.count - 2;
    var newIndices = [];

    if ( drawMode === TriangleFanDrawMode ) {

      // gl.TRIANGLE_FAN

      for ( var i = 1; i <= numberOfTriangles; i ++ ) {

        newIndices.push( index.getX( 0 ) );
        newIndices.push( index.getX( i ) );
        newIndices.push( index.getX( i + 1 ) );

      }

    } else {

      // gl.TRIANGLE_STRIP

      for ( var i = 0; i < numberOfTriangles; i ++ ) {

        if ( i % 2 === 0 ) {

          newIndices.push( index.getX( i ) );
          newIndices.push( index.getX( i + 1 ) );
          newIndices.push( index.getX( i + 2 ) );


        } else {

          newIndices.push( index.getX( i + 2 ) );
          newIndices.push( index.getX( i + 1 ) );
          newIndices.push( index.getX( i ) );

        }

      }

    }

    if ( ( newIndices.length / 3 ) !== numberOfTriangles ) {

      console.error( 'THREE.GLTFLoader.toTrianglesDrawMode(): Unable to generate correct amount of triangles.' );

    }

    // build final geometry

    var newGeometry = geometry.clone();
    newGeometry.setIndex( newIndices );

    return newGeometry;

  }

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
   *
   * Creates BufferGeometries from primitives.
   *
   * @param {Array<GLTF.Primitive>} primitives
   * @return {Promise<Array<BufferGeometry>>}
   */
  GLTFParser.prototype.loadGeometries = function ( primitives ) {

    var parser = this;
    var extensions = this.extensions;
    var cache = this.primitiveCache;

    function createDracoPrimitive( primitive ) {

      return extensions[ EXTENSIONS.KHR_DRACO_MESH_COMPRESSION ]
        .decodePrimitive( primitive, parser )
        .then( function ( geometry ) {

          return addPrimitiveAttributes( geometry, primitive, parser );

        } );

    }

    var pending = [];

    for ( var i = 0, il = primitives.length; i < il; i ++ ) {

      var primitive = primitives[ i ];
      var cacheKey = createPrimitiveKey( primitive );

      // See if we've already created this geometry
      var cached = cache[ cacheKey ];

      if ( cached ) {

        // Use the cached geometry if it exists
        pending.push( cached.promise );

      } else {

        var geometryPromise;

        if ( primitive.extensions && primitive.extensions[ EXTENSIONS.KHR_DRACO_MESH_COMPRESSION ] ) {

          // Use DRACO geometry if available
          geometryPromise = createDracoPrimitive( primitive );

        } else {

          // Otherwise create a new geometry
          geometryPromise = addPrimitiveAttributes( new BufferGeometry(), primitive, parser );

        }

        // Cache this geometry
        cache[ cacheKey ] = { primitive: primitive, promise: geometryPromise };

        pending.push( geometryPromise );

      }

    }

    return Promise.all( pending );

  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
   * @param {number} meshIndex
   * @return {Promise<Group|Mesh>}
   */
  GLTFParser.prototype.loadMesh = function ( meshIndex ) {

    var parser = this;
    var json = this.json;
    var meshDef = json.meshes[ meshIndex ];
    var primitives = meshDef.primitives;

    var pending = [];

    for ( var i = 0, il = primitives.length; i < il; i ++ ) {

      var material = createDefaultMaterial( this.cache );

      pending.push( material );

    }

    pending.push( parser.loadGeometries( primitives ) );

    return Promise.all( pending ).then( function ( results ) {

      var materials = results.slice( 0, results.length - 1 );
      var geometries = results[ results.length - 1 ];

      var meshes = [];

      for ( var i = 0, il = geometries.length; i < il; i ++ ) {

        var geometry = geometries[ i ];
        var primitive = primitives[ i ];

        // 1. create Mesh

        var mesh;

        var material = materials[ i ];

        if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLES ||
          primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ||
          primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ||
          primitive.mode === undefined ) {

          mesh = new Mesh( geometry, material );

          if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ) {

            mesh.geometry = toTrianglesDrawMode( mesh.geometry, TriangleStripDrawMode );

          } else if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ) {

            mesh.geometry = toTrianglesDrawMode( mesh.geometry, TriangleFanDrawMode );

          }

        } else if ( primitive.mode === WEBGL_CONSTANTS.LINES ) {

          mesh = new LineSegments( geometry, material );

        } else if ( primitive.mode === WEBGL_CONSTANTS.LINE_STRIP ) {

          mesh = new Line( geometry, material );

        } else if ( primitive.mode === WEBGL_CONSTANTS.LINE_LOOP ) {

          mesh = new LineLoop( geometry, material );

        } else if ( primitive.mode === WEBGL_CONSTANTS.POINTS ) {

          mesh = new Points( geometry, material );

        } else {

          throw new Error( 'THREE.GLTFLoader: Primitive mode unsupported: ' + primitive.mode );

        }

        mesh.name = parser.createUniqueName( meshDef.name || ( 'mesh_' + meshIndex ) );

        meshes.push( mesh );

      }

      if ( meshes.length === 1 ) {

        return meshes[ 0 ];

      }

      var group = new Group();

      for ( var i = 0, il = meshes.length; i < il; i ++ ) {

        group.add( meshes[ i ] );

      }

      return group;

    } );

  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
   * @param {number} nodeIndex
   * @return {Promise<Object3D>}
   */
  GLTFParser.prototype.loadNode = function ( nodeIndex ) {

    var json = this.json;
    var parser = this;

    var nodeDef = json.nodes[ nodeIndex ];

    // reserve node's name before its dependencies, so the root has the intended name.
    var nodeName = nodeDef.name ? parser.createUniqueName( nodeDef.name ) : '';

    return ( function () {

      var pending = [];

      if ( nodeDef.mesh !== undefined ) {

        pending.push( parser.getDependency( 'mesh', nodeDef.mesh ).then( function ( mesh ) {

          var node = parser._getNodeRef( parser.meshCache, nodeDef.mesh, mesh );

          // if weights are provided on the node, override weights on the mesh.
          if ( nodeDef.weights !== undefined ) {

            node.traverse( function ( o ) {

              if ( ! o.isMesh ) return;

              for ( var i = 0, il = nodeDef.weights.length; i < il; i ++ ) {

                o.morphTargetInfluences[ i ] = nodeDef.weights[ i ];

              }

            } );

          }

          return node;

        } ) );

      }

      parser._invokeAll( function ( ext ) {

        return ext.createNodeAttachment && ext.createNodeAttachment( nodeIndex );

      } ).forEach( function ( promise ) {

        pending.push( promise );

      } );

      return Promise.all( pending );

    }() ).then( function ( objects ) {

      var node;

      if ( objects.length > 1 ) {

        node = new Group();

      } else if ( objects.length === 1 ) {

        node = objects[ 0 ];

      } else {

        node = new Object3D();

      }

      if ( node !== objects[ 0 ] ) {

        for ( var i = 0, il = objects.length; i < il; i ++ ) {

          node.add( objects[ i ] );

        }

      }

      if ( nodeDef.name ) {

        node.userData.name = nodeDef.name;
        node.name = nodeName;

      }

      if ( nodeDef.matrix !== undefined ) {

        var matrix = new Matrix4();
        matrix.fromArray( nodeDef.matrix );
        node.applyMatrix4( matrix );

      } else {

        if ( nodeDef.translation !== undefined ) {

          node.position.fromArray( nodeDef.translation );

        }

        if ( nodeDef.rotation !== undefined ) {

          node.quaternion.fromArray( nodeDef.rotation );

        }

        if ( nodeDef.scale !== undefined ) {

          node.scale.fromArray( nodeDef.scale );

        }

      }

      parser.associations.set( node, { type: 'nodes', index: nodeIndex } );

      return node;

    } );

  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
   * @param {number} sceneIndex
   * @return {Promise<Group>}
   */
  GLTFParser.prototype.loadScene = function () {

    // scene node hierachy builder

    function buildNodeHierachy( nodeId, parentObject, json, parser ) {

      var nodeDef = json.nodes[ nodeId ];

      return parser.getDependency( 'node', nodeId ).then( function ( node ) {

        // build node hierachy

        parentObject.add( node );

        var pending = [];

        if ( nodeDef.children ) {

          var children = nodeDef.children;

          for ( var i = 0, il = children.length; i < il; i ++ ) {

            var child = children[ i ];
            pending.push( buildNodeHierachy( child, node, json, parser ) );

          }

        }

        return Promise.all( pending );

      } );

    }

    return function loadScene( sceneIndex ) {

      var json = this.json;
      var sceneDef = this.json.scenes[ sceneIndex ];
      var parser = this;

      // Loader returns Group, not Scene.
      // See: https://github.com/mrdoob/three.js/issues/18342#issuecomment-578981172
      var scene = new Group();
      if ( sceneDef.name ) scene.name = parser.createUniqueName( sceneDef.name );

      var nodeIds = sceneDef.nodes || [];

      var pending = [];

      for ( var i = 0, il = nodeIds.length; i < il; i ++ ) {

        pending.push( buildNodeHierachy( nodeIds[ i ], scene, json, parser ) );

      }

      return Promise.all( pending ).then( function () {

        return scene;

      } );

    };

  }();

  return GLTFLoader;

} )();

export { GLTFLoader };
