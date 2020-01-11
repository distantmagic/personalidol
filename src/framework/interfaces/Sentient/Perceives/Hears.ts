// @flow strict

import type { Vocal } from "../../Perceivable/Message/Vocal";
import type { Perceives } from "../Perceives";

export interface Hears extends Perceives {
  hear(message: Vocal): Promise<void>;
}
