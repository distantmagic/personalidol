// @flow

import Exception from "../Exception";

import type { Canceled as CanceledInterface } from "../../interfaces/Exception/Canceled";

export default class Canceled extends Exception implements CanceledInterface {}
