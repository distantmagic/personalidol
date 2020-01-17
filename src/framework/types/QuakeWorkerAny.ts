import QuakeWorkerFuncGroup from "src/framework/types/QuakeWorkerFuncGroup";
import QuakeWorkerGLTFModel from "src/framework/types/QuakeWorkerGLTFModel";
import QuakeWorkerLightAmbient from "src/framework/types/QuakeWorkerLightAmbient";
import QuakeWorkerLightHemisphere from "src/framework/types/QuakeWorkerLightHemisphere";
import QuakeWorkerLightPoint from "src/framework/types/QuakeWorkerLightPoint";
import QuakeWorkerLightSpotlight from "src/framework/types/QuakeWorkerLightSpotlight";
import QuakeWorkerMD2Model from "src/framework/types/QuakeWorkerMD2Model";
import QuakeWorkerPlayer from "src/framework/types/QuakeWorkerPlayer";
import QuakeWorkerSounds from "src/framework/types/QuakeWorkerSounds";
import QuakeWorkerSparkParticles from "src/framework/types/QuakeWorkerSparkParticles";
import QuakeWorkerWorldspawn from "src/framework/types/QuakeWorkerWorldspawn";

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
  | QuakeWorkerWorldspawn;

export default QuakeWorkerAny;
