import CancelToken from "../CancelToken";

import { Canceled as CanceledInterface } from "../../../interfaces/Exception/Canceled";

export default class Canceled extends CancelToken implements CanceledInterface {}
