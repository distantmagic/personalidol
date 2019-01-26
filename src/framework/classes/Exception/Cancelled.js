// @flow

import Exception from "../Exception";

import type { Cancelled as CancelledInterface } from "../../interfaces/Exception/Cancelled";

export default class Cancelled extends Exception
  implements CancelledInterface {}
