// @flow

/**
 * @author mrdoob / http://mrdoob.com/
 */

import * as THREE from "three";

import type {
  BufferGeometry,
  LoadingManagerOnErrorCallback,
  LoadingManagerOnLoadCallback,
  LoadingManagerOnProgressCallback,
} from "three";

// prettier-ignore
const normalData = [
  [ - 0.525731, 0.000000, 0.850651 ], [ - 0.442863, 0.238856, 0.864188 ],
  [ - 0.295242, 0.000000, 0.955423 ], [ - 0.309017, 0.500000, 0.809017 ],
  [ - 0.162460, 0.262866, 0.951056 ], [ 0.000000, 0.000000, 1.000000 ],
  [ 0.000000, 0.850651, 0.525731 ], [ - 0.147621, 0.716567, 0.681718 ],
  [ 0.147621, 0.716567, 0.681718 ], [ 0.000000, 0.525731, 0.850651 ],
  [ 0.309017, 0.500000, 0.809017 ], [ 0.525731, 0.000000, 0.850651 ],
  [ 0.295242, 0.000000, 0.955423 ], [ 0.442863, 0.238856, 0.864188 ],
  [ 0.162460, 0.262866, 0.951056 ], [ - 0.681718, 0.147621, 0.716567 ],
  [ - 0.809017, 0.309017, 0.500000 ], [ - 0.587785, 0.425325, 0.688191 ],
  [ - 0.850651, 0.525731, 0.000000 ], [ - 0.864188, 0.442863, 0.238856 ],
  [ - 0.716567, 0.681718, 0.147621 ], [ - 0.688191, 0.587785, 0.425325 ],
  [ - 0.500000, 0.809017, 0.309017 ], [ - 0.238856, 0.864188, 0.442863 ],
  [ - 0.425325, 0.688191, 0.587785 ], [ - 0.716567, 0.681718, - 0.147621 ],
  [ - 0.500000, 0.809017, - 0.309017 ], [ - 0.525731, 0.850651, 0.000000 ],
  [ 0.000000, 0.850651, - 0.525731 ], [ - 0.238856, 0.864188, - 0.442863 ],
  [ 0.000000, 0.955423, - 0.295242 ], [ - 0.262866, 0.951056, - 0.162460 ],
  [ 0.000000, 1.000000, 0.000000 ], [ 0.000000, 0.955423, 0.295242 ],
  [ - 0.262866, 0.951056, 0.162460 ], [ 0.238856, 0.864188, 0.442863 ],
  [ 0.262866, 0.951056, 0.162460 ], [ 0.500000, 0.809017, 0.309017 ],
  [ 0.238856, 0.864188, - 0.442863 ], [ 0.262866, 0.951056, - 0.162460 ],
  [ 0.500000, 0.809017, - 0.309017 ], [ 0.850651, 0.525731, 0.000000 ],
  [ 0.716567, 0.681718, 0.147621 ], [ 0.716567, 0.681718, - 0.147621 ],
  [ 0.525731, 0.850651, 0.000000 ], [ 0.425325, 0.688191, 0.587785 ],
  [ 0.864188, 0.442863, 0.238856 ], [ 0.688191, 0.587785, 0.425325 ],
  [ 0.809017, 0.309017, 0.500000 ], [ 0.681718, 0.147621, 0.716567 ],
  [ 0.587785, 0.425325, 0.688191 ], [ 0.955423, 0.295242, 0.000000 ],
  [ 1.000000, 0.000000, 0.000000 ], [ 0.951056, 0.162460, 0.262866 ],
  [ 0.850651, - 0.525731, 0.000000 ], [ 0.955423, - 0.295242, 0.000000 ],
  [ 0.864188, - 0.442863, 0.238856 ], [ 0.951056, - 0.162460, 0.262866 ],
  [ 0.809017, - 0.309017, 0.500000 ], [ 0.681718, - 0.147621, 0.716567 ],
  [ 0.850651, 0.000000, 0.525731 ], [ 0.864188, 0.442863, - 0.238856 ],
  [ 0.809017, 0.309017, - 0.500000 ], [ 0.951056, 0.162460, - 0.262866 ],
  [ 0.525731, 0.000000, - 0.850651 ], [ 0.681718, 0.147621, - 0.716567 ],
  [ 0.681718, - 0.147621, - 0.716567 ], [ 0.850651, 0.000000, - 0.525731 ],
  [ 0.809017, - 0.309017, - 0.500000 ], [ 0.864188, - 0.442863, - 0.238856 ],
  [ 0.951056, - 0.162460, - 0.262866 ], [ 0.147621, 0.716567, - 0.681718 ],
  [ 0.309017, 0.500000, - 0.809017 ], [ 0.425325, 0.688191, - 0.587785 ],
  [ 0.442863, 0.238856, - 0.864188 ], [ 0.587785, 0.425325, - 0.688191 ],
  [ 0.688191, 0.587785, - 0.425325 ], [ - 0.147621, 0.716567, - 0.681718 ],
  [ - 0.309017, 0.500000, - 0.809017 ], [ 0.000000, 0.525731, - 0.850651 ],
  [ - 0.525731, 0.000000, - 0.850651 ], [ - 0.442863, 0.238856, - 0.864188 ],
  [ - 0.295242, 0.000000, - 0.955423 ], [ - 0.162460, 0.262866, - 0.951056 ],
  [ 0.000000, 0.000000, - 1.000000 ], [ 0.295242, 0.000000, - 0.955423 ],
  [ 0.162460, 0.262866, - 0.951056 ], [ - 0.442863, - 0.238856, - 0.864188 ],
  [ - 0.309017, - 0.500000, - 0.809017 ], [ - 0.162460, - 0.262866, - 0.951056 ],
  [ 0.000000, - 0.850651, - 0.525731 ], [ - 0.147621, - 0.716567, - 0.681718 ],
  [ 0.147621, - 0.716567, - 0.681718 ], [ 0.000000, - 0.525731, - 0.850651 ],
  [ 0.309017, - 0.500000, - 0.809017 ], [ 0.442863, - 0.238856, - 0.864188 ],
  [ 0.162460, - 0.262866, - 0.951056 ], [ 0.238856, - 0.864188, - 0.442863 ],
  [ 0.500000, - 0.809017, - 0.309017 ], [ 0.425325, - 0.688191, - 0.587785 ],
  [ 0.716567, - 0.681718, - 0.147621 ], [ 0.688191, - 0.587785, - 0.425325 ],
  [ 0.587785, - 0.425325, - 0.688191 ], [ 0.000000, - 0.955423, - 0.295242 ],
  [ 0.000000, - 1.000000, 0.000000 ], [ 0.262866, - 0.951056, - 0.162460 ],
  [ 0.000000, - 0.850651, 0.525731 ], [ 0.000000, - 0.955423, 0.295242 ],
  [ 0.238856, - 0.864188, 0.442863 ], [ 0.262866, - 0.951056, 0.162460 ],
  [ 0.500000, - 0.809017, 0.309017 ], [ 0.716567, - 0.681718, 0.147621 ],
  [ 0.525731, - 0.850651, 0.000000 ], [ - 0.238856, - 0.864188, - 0.442863 ],
  [ - 0.500000, - 0.809017, - 0.309017 ], [ - 0.262866, - 0.951056, - 0.162460 ],
  [ - 0.850651, - 0.525731, 0.000000 ], [ - 0.716567, - 0.681718, - 0.147621 ],
  [ - 0.716567, - 0.681718, 0.147621 ], [ - 0.525731, - 0.850651, 0.000000 ],
  [ - 0.500000, - 0.809017, 0.309017 ], [ - 0.238856, - 0.864188, 0.442863 ],
  [ - 0.262866, - 0.951056, 0.162460 ], [ - 0.864188, - 0.442863, 0.238856 ],
  [ - 0.809017, - 0.309017, 0.500000 ], [ - 0.688191, - 0.587785, 0.425325 ],
  [ - 0.681718, - 0.147621, 0.716567 ], [ - 0.442863, - 0.238856, 0.864188 ],
  [ - 0.587785, - 0.425325, 0.688191 ], [ - 0.309017, - 0.500000, 0.809017 ],
  [ - 0.147621, - 0.716567, 0.681718 ], [ - 0.425325, - 0.688191, 0.587785 ],
  [ - 0.162460, - 0.262866, 0.951056 ], [ 0.442863, - 0.238856, 0.864188 ],
  [ 0.162460, - 0.262866, 0.951056 ], [ 0.309017, - 0.500000, 0.809017 ],
  [ 0.147621, - 0.716567, 0.681718 ], [ 0.000000, - 0.525731, 0.850651 ],
  [ 0.425325, - 0.688191, 0.587785 ], [ 0.587785, - 0.425325, 0.688191 ],
  [ 0.688191, - 0.587785, 0.425325 ], [ - 0.955423, 0.295242, 0.000000 ],
  [ - 0.951056, 0.162460, 0.262866 ], [ - 1.000000, 0.000000, 0.000000 ],
  [ - 0.850651, 0.000000, 0.525731 ], [ - 0.955423, - 0.295242, 0.000000 ],
  [ - 0.951056, - 0.162460, 0.262866 ], [ - 0.864188, 0.442863, - 0.238856 ],
  [ - 0.951056, 0.162460, - 0.262866 ], [ - 0.809017, 0.309017, - 0.500000 ],
  [ - 0.864188, - 0.442863, - 0.238856 ], [ - 0.951056, - 0.162460, - 0.262866 ],
  [ - 0.809017, - 0.309017, - 0.500000 ], [ - 0.681718, 0.147621, - 0.716567 ],
  [ - 0.681718, - 0.147621, - 0.716567 ], [ - 0.850651, 0.000000, - 0.525731 ],
  [ - 0.688191, 0.587785, - 0.425325 ], [ - 0.587785, 0.425325, - 0.688191 ],
  [ - 0.425325, 0.688191, - 0.587785 ], [ - 0.425325, - 0.688191, - 0.587785 ],
  [ - 0.587785, - 0.425325, - 0.688191 ], [ - 0.688191, - 0.587785, - 0.425325 ]
];

export default class MD2Loader extends THREE.Loader<BufferGeometry> {
  load(
    url: string,
    onLoad: LoadingManagerOnLoadCallback<BufferGeometry>,
    onProgress: ?LoadingManagerOnProgressCallback,
    onError: ?LoadingManagerOnErrorCallback
  ) {

    var loader = new THREE.FileLoader( this.manager );
    loader.setPath( this.path );
    loader.setResponseType( 'arraybuffer' );
    loader.load( url, buffer => {

      onLoad( this.parse( buffer ) );

    }, onProgress, onError );

  }

  parse( buffer: ArrayBuffer ) {
    console.time( 'MD2Loader' );

    const data = new DataView( buffer );

    // http://tfc.duke.free.fr/coding/md2-specs-en.html
    const header = {};
    // prettier-ignore
    const headerNames = [
      'ident', 'version',
      'skinwidth', 'skinheight',
      'framesize',
      'num_skins', 'num_vertices', 'num_st', 'num_tris', 'num_glcmds', 'num_frames',
      'offset_skins', 'offset_st', 'offset_tris', 'offset_frames', 'offset_glcmds', 'offset_end'
    ];

    for ( let i = 0; i < headerNames.length; i ++ ) {

      header[ headerNames[ i ] ] = data.getInt32( i * 4, true );

    }

    if ( header.ident !== 844121161 || header.version !== 8 ) {

      console.error( 'Not a valid MD2 file' );
      return;

    }

    if ( header.offset_end !== data.byteLength ) {

      console.error( 'Corrupted MD2 file' );
      return;

    }

    //

    const geometry = new THREE.BufferGeometry();

    // uvs

    const uvsTemp = [];
    let offset = header.offset_st;

    for ( let i = 0, l = header.num_st; i < l; i ++ ) {

      const u = data.getInt16( offset + 0, true );
      const v = data.getInt16( offset + 2, true );

      uvsTemp.push( u / header.skinwidth, 1 - ( v / header.skinheight ) );

      offset += 4;

    }

    // triangles

    offset = header.offset_tris;

    const vertexIndices = [];
    const uvIndices = [];

    for ( let i = 0, l = header.num_tris; i < l; i ++ ) {

      vertexIndices.push(
        data.getUint16( offset + 0, true ),
        data.getUint16( offset + 2, true ),
        data.getUint16( offset + 4, true )
      );

      uvIndices.push(
        data.getUint16( offset + 6, true ),
        data.getUint16( offset + 8, true ),
        data.getUint16( offset + 10, true )
      );

      offset += 12;

    }

    // frames

    var translation = new THREE.Vector3();
    var scale = new THREE.Vector3();
    var string = [];

    var frames = [];

    offset = header.offset_frames;

    for ( let i = 0, l = header.num_frames; i < l; i ++ ) {

      scale.set(
        data.getFloat32( offset + 0, true ),
        data.getFloat32( offset + 4, true ),
        data.getFloat32( offset + 8, true )
      );

      translation.set(
        data.getFloat32( offset + 12, true ),
        data.getFloat32( offset + 16, true ),
        data.getFloat32( offset + 20, true )
      );

      offset += 24;

      for ( let j = 0; j < 16; j ++ ) {

        const character = data.getUint8( offset + j );
        if ( character === 0 ) break;

        string[ j ] = character;

      }

      const frame = {
        name: String.fromCharCode.apply( null, string ),
        vertices: [],
        normals: []
      };

      offset += 16;

      for ( let j = 0; j < header.num_vertices; j ++ ) {

        const xData = data.getUint8( offset ++ );
        const x = xData * scale.x + translation.x;

        const yData = data.getUint8( offset ++ );
        const y = yData * scale.y + translation.y;

        const zData = data.getUint8( offset ++ );
        const z = zData * scale.z + translation.z;

        const n = normalData[ data.getUint8( offset ++ ) ];

        frame.vertices.push( x, z, y ); // convert to Y-up
        frame.normals.push( n[ 0 ], n[ 2 ], n[ 1 ] ); // convert to Y-up

      }

      frames.push( frame );

    }

    // static

    var positions = [];
    var normals = [];
    var uvs = [];

    var verticesTemp = frames[ 0 ].vertices;
    var normalsTemp = frames[ 0 ].normals;

    for ( let i = 0, l = vertexIndices.length; i < l; i ++ ) {

      const vertexIndex = vertexIndices[ i ];
      const vertexStride = vertexIndex * 3;

      //

      const x = verticesTemp[ vertexStride ];
      const y = verticesTemp[ vertexStride + 1 ];
      const z = verticesTemp[ vertexStride + 2 ];

      positions.push( x, y, z );

      //

      const nx = normalsTemp[ vertexStride ];
      const ny = normalsTemp[ vertexStride + 1 ];
      const nz = normalsTemp[ vertexStride + 2 ];

      normals.push( nx, ny, nz );

      //

      const uvIndex = uvIndices[ i ];
      const uvStride = uvIndex * 2;

      const u = uvsTemp[ uvStride ];
      const v = uvsTemp[ uvStride + 1 ];

      uvs.push( u, v );

    }

    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
    geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );

    // animation

    const morphPositions = [];
    const morphNormals = [];

    for ( let i = 0, l = frames.length; i < l; i ++ ) {

      const frame = frames[ i ];
      const attributeName = frame.name;

      if ( frame.vertices.length > 0 ) {

        const positions = [];

        for ( let j = 0, jl = vertexIndices.length; j < jl; j ++ ) {

          const vertexIndex = vertexIndices[ j ];
          const stride = vertexIndex * 3;

          const x = frame.vertices[ stride ];
          const y = frame.vertices[ stride + 1 ];
          const z = frame.vertices[ stride + 2 ];

          positions.push( x, y, z );

        }

        const positionAttribute = new THREE.Float32BufferAttribute( positions, 3 );
        positionAttribute.name = attributeName;

        morphPositions.push( positionAttribute );

      }

      if ( frame.normals.length > 0 ) {

        const normals = [];

        for ( let j = 0, jl = vertexIndices.length; j < jl; j ++ ) {

          const vertexIndex = vertexIndices[ j ];
          const stride = vertexIndex * 3;

          const nx = frame.normals[ stride ];
          const ny = frame.normals[ stride + 1 ];
          const nz = frame.normals[ stride + 2 ];

          normals.push( nx, ny, nz );

        }

        const normalAttribute = new THREE.Float32BufferAttribute( normals, 3 );
        normalAttribute.name = attributeName;

        morphNormals.push( normalAttribute );

      }

    }

    geometry.morphAttributes.position = morphPositions;
    geometry.morphAttributes.normal = morphNormals;
    geometry.morphTargetsRelative = false;

    geometry.animations = THREE.AnimationClip.CreateClipsFromMorphTargetSequences( frames, 10 );

    console.timeEnd( 'MD2Loader' );

    return geometry;

  }
}
