import { ColorResolvable } from "discord.js";

export interface Config {
    developers?: (string)[] | null;
    prefix: string;
    colors: Colors;
}
export interface Colors {
    error: ColorResolvable;
    warning: ColorResolvable;
    success: ColorResolvable;
    main: ColorResolvable;
}