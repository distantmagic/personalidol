import { Canceled } from "src/framework/interfaces/Exception/Canceled";

export type CancelTokenCallback = (error: Canceled) => void;
