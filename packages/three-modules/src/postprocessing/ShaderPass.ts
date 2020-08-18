import { ShaderMaterial } from "three/src/materials/ShaderMaterial";
import { UniformsUtils } from "three/src/renderers/shaders/UniformsUtils";

import { FullScreenQuad } from "./FullScreenQuad";
import { Pass } from "./Pass";

import type { IUniform } from "three/src/renderers/shaders/UniformsLib";
import type { Material } from "three/src/materials/Material";
import type { ShaderMaterial as IShaderMaterial } from "three/src/materials/ShaderMaterial";
import type { Uniform } from "three/src/core/Uniform";
import type { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import type { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";

type Shader = {
  defines?: { [key: string]: number };
  uniforms: { [key: string]: Uniform };
  vertexShader: string;
  fragmentShader: string;
};

export class ShaderPass extends Pass {
  fsQuad: FullScreenQuad;
  material: Material;
  textureID: string;
  uniforms: { [uniform: string]: IUniform } = {};

  constructor(shader: IShaderMaterial | Shader, textureID: null | string = null) {
    super();

    this.textureID = textureID !== null ? textureID : "tDiffuse";

    if (shader instanceof ShaderMaterial) {
      this.uniforms = shader.uniforms;

      this.material = shader;
    } else if (shader) {
      this.uniforms = UniformsUtils.clone(shader.uniforms);

      this.material = new ShaderMaterial({
        defines: Object.assign({}, shader.defines),
        uniforms: this.uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
      });
    } else {
      throw new Error("Could not get shader pass material.");
    }

    this.fsQuad = new FullScreenQuad(this.material);
  }

  render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget, deltaTime: number = 0 /*,  maskActive */) {
    if (this.uniforms[this.textureID]) {
      this.uniforms[this.textureID].value = readBuffer.texture;
    }

    this.fsQuad.material = this.material;

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      // TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
      if (this.clear) renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil);
      this.fsQuad.render(renderer);
    }
  }
}
