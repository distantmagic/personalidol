import { DataTexture } from "three/src/textures/DataTexture";
import { DigitalGlitch } from "three/examples/jsm/shaders/DigitalGlitch";
import { FloatType, RGBFormat } from "three/src/constants";
import { MathUtils } from "three/src/math/MathUtils";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial";
import { UniformsUtils } from "three/src/renderers/shaders/UniformsUtils";

import { disposableGeneric } from "@personalidol/framework/src/disposableGeneric";
import { disposableMaterial } from "@personalidol/framework/src/disposableMaterial";
import { flush } from "@personalidol/framework/src/flush";

import { FullScreenQuad } from "./FullScreenQuad";
import { Pass } from "./Pass";

import type { Material } from "three/src/materials/Material";
import type { Uniform } from "three/src/core/Uniform";
import type { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import type { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";

import type { GenericCallback } from "@personalidol/framework/src/GenericCallback.type";

export class GlitchPass extends Pass {
  private curF: number = 0;
  private disposables: Set<GenericCallback> = new Set();
  private fsQuad: FullScreenQuad;
  private goWild: boolean = false;
  private material: Material;
  private randX: number = 0;
  private uniforms: { [key: string]: Uniform };

  constructor(dt_size: number = 64) {
    super();

    const shader = DigitalGlitch;

    this.uniforms = UniformsUtils.clone(shader.uniforms);

    this.uniforms["tDisp"].value = this.generateHeightmap(dt_size);

    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
    });
    this.disposables.add(disposableMaterial(this.material));

    this.fsQuad = new FullScreenQuad(this.material);
    this.disposables.add(disposableGeneric(this.fsQuad));

    this.generateTrigger();
  }

  dispose(): void {
    flush(this.disposables);
  }

  render(renderer: WebGLRenderer, renderToScreen: boolean, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget) {
    this.uniforms["tDiffuse"].value = readBuffer.texture;
    this.uniforms["seed"].value = Math.random(); //default seeding
    this.uniforms["byp"].value = 0;

    if (this.curF % this.randX == 0 || this.goWild == true) {
      this.uniforms["amount"].value = Math.random() / 30;
      this.uniforms["angle"].value = MathUtils.randFloat(-Math.PI, Math.PI);
      this.uniforms["seed_x"].value = MathUtils.randFloat(-1, 1);
      this.uniforms["seed_y"].value = MathUtils.randFloat(-1, 1);
      this.uniforms["distortion_x"].value = MathUtils.randFloat(0, 1);
      this.uniforms["distortion_y"].value = MathUtils.randFloat(0, 1);
      this.curF = 0;
      this.generateTrigger();
    } else if (this.curF % this.randX < this.randX / 5) {
      this.uniforms["amount"].value = Math.random() / 90;
      this.uniforms["angle"].value = MathUtils.randFloat(-Math.PI, Math.PI);
      this.uniforms["distortion_x"].value = MathUtils.randFloat(0, 1);
      this.uniforms["distortion_y"].value = MathUtils.randFloat(0, 1);
      this.uniforms["seed_x"].value = MathUtils.randFloat(-0.3, 0.3);
      this.uniforms["seed_y"].value = MathUtils.randFloat(-0.3, 0.3);
    } else if (this.goWild == false) {
      this.uniforms["byp"].value = 1;
    }

    this.curF++;

    if (renderToScreen) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
      this.fsQuad.render(renderer);
    }
  }

  generateTrigger() {
    this.randX = MathUtils.randInt(120, 240);
  }

  generateHeightmap(dt_size: number) {
    const data_arr = new Float32Array(dt_size * dt_size * 3);
    const length = dt_size * dt_size;

    for (let i = 0; i < length; i++) {
      const val = MathUtils.randFloat(0, 1);
      data_arr[i * 3 + 0] = val;
      data_arr[i * 3 + 1] = val;
      data_arr[i * 3 + 2] = val;
    }

    const dataTexture = new DataTexture(data_arr, dt_size, dt_size, RGBFormat, FloatType);

    this.disposables.add(disposableGeneric(dataTexture));

    return dataTexture;
  }
}
