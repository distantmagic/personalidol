import type Canceled from "src/framework/interfaces/Exception/Canceled";

type CancelTokenCallback = (error: Canceled) => void;

export default CancelTokenCallback;
