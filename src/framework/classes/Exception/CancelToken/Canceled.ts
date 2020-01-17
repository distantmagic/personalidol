import CancelToken from "src/framework/classes/Exception/CancelToken";

import { default as ICanceled } from "src/framework/interfaces/Exception/Canceled";

export default class Canceled extends CancelToken implements ICanceled {}
