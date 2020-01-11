import { QuakeWorkerFuncGroup } from "./QuakeWorkerFuncGroup";
import { QuakeWorkerGLTFModel } from "./QuakeWorkerGLTFModel";
import { QuakeWorkerLightAmbient } from "./QuakeWorkerLightAmbient";
import { QuakeWorkerLightHemisphere } from "./QuakeWorkerLightHemisphere";
import { QuakeWorkerLightPoint } from "./QuakeWorkerLightPoint";
import { QuakeWorkerLightSpotlight } from "./QuakeWorkerLightSpotlight";
import { QuakeWorkerMD2Model } from "./QuakeWorkerMD2Model";
import { QuakeWorkerPlayer } from "./QuakeWorkerPlayer";
import { QuakeWorkerSounds } from "./QuakeWorkerSounds";
import { QuakeWorkerSparkParticles } from "./QuakeWorkerSparkParticles";
import { QuakeWorkerWorldspawn } from "./QuakeWorkerWorldspawn";

export type QuakeWorkerAny =
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
