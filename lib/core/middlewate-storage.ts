import { Middleware } from "koa";
import Router from "koa-router";
import { Context } from "vm";
import { HttpException } from "../constant/Exception";

class ChyanInterceptor implements Interceptor {
  apply(body: any, c: Context) {
    c.body = { code: 0, body, msg: "success" };
  }
}
export interface ExceptionFilter {
  catch(e: Error, c: Context): void;
}

class ChyanExceptionFilter implements ExceptionFilter {
  catch(e: Error, c: Context) {
    if (e instanceof HttpException) {
      c.status = e.status;
      c.body = { msg: e };
    } else {
      c.status = 500;
      c.body = { msg: "internal server error" };
    }
  }
}

export class MiddlewaresStorage {
  static interceptor: Interceptor = new ChyanInterceptor();
  static exceptionFilter: ExceptionFilter = new ChyanExceptionFilter();

  static middlewares: MiddlewareDescriptor[] = [];
  static routers: Router[] = [];

  static addRouter(router: Router) {
    this.routers.push(router);
  }

  static addMiddleware(middleware: MiddlewareDescriptor) {
    this.middlewares.push(middleware);
  }
}

type MiddlewareDescriptor = {
  fn: Middleware;
  path?: string;
  afterRouter: boolean;
};

export interface Interceptor {
  apply(body: any, c: Context): void | Promise<void>;
}