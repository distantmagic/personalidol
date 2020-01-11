import { Canceled } from "../interfaces/Exception/Canceled";

export type CancelTokenCallback = (error: Canceled) => void;
