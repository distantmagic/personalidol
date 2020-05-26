import type QuakeWorkerFuncGroup from "src/framework/types/QuakeWorkerFuncGroup";
import type QuakeWorkerGLTFModel from "src/framework/types/QuakeWorkerGLTFModel";
import type QuakeWorkerLightAmbient from "src/framework/types/QuakeWorkerLightAmbient";
import type QuakeWorkerLightHemisphere from "src/framework/types/QuakeWorkerLightHemisphere";
import type QuakeWorkerLightPoint from "src/framework/types/QuakeWorkerLightPoint";
import type QuakeWorkerLightSpotlight from "src/framework/types/QuakeWorkerLightSpotlight";
import type QuakeWorkerMD2Model from "src/framework/types/QuakeWorkerMD2Model";
import type QuakeWorkerPlayer from "src/framework/types/QuakeWorkerPlayer";
import type QuakeWorkerSounds from "src/framework/types/QuakeWorkerSounds";
import type QuakeWorkerSparkParticles from "src/framework/types/QuakeWorkerSparkParticles";
import type QuakeWorkerWorldspawn from "src/framework/types/QuakeWorkerWorldspawn";

// prettier-ignore
type QuakeWorkerAny =
  | QuakeWorkerFuncGroup
  | QuakeWorkerGLTFModel
  | QuakeWorkerLightAmbient
  | QuakeWorkerLightHemisphere
  | QuakeWorkerLightPoint
  | QuakeWorkerLightSpotlight
  | QuakeWorkerMD2Model
  | QuakeWorkerPlayer
  | QuakeWorkerSounds
  | QuakeWorkerSparkParticles
  | QuakeWorkerWorldspawn
;

export default QuakeWorkerAny;
