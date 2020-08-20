/// <reference types="koa-session" />
import { ArgumentsTypes } from "../constant/ArgumentsTypes";
import { Context } from "koa";
export interface IMiddleware {
    apply(): void;
}
export interface IPipe {
    validate(argTypes: ArgumentsMetadata[], c: Context): void;
}
export interface IFilter {
    catch(e: any, c: Context): void;
}
export interface IStatic {
    apply(c: Context): boolean | Promise<boolean>;
}
export interface IInterceptor {
    apply(c: Context): void;
}
export interface IGuard {
    can(c: Context): void;
}
export interface ILogger {
    log(c: Context): void;
}
export interface ArgumentsMetadata {
    value?: any;
    field: string;
    argType: any;
    metaType: ArgumentsTypes;
}
