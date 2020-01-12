import CancelToken from "src/framework/classes/Exception/CancelToken";

import { Canceled as CanceledInterface } from "src/framework/interfaces/Exception/Canceled";

export default class Canceled extends CancelToken implements CanceledInterface {}
