import { Router, Request, Response, NextFunction } from "express";

export const catchRouteErrors = (router: Router) => {
  const wrap = (fn: Function) => 
    function(this: any, req: Request, res: Response, next: NextFunction) {
      Promise.resolve(fn.call(this, req, res, next)).catch(next);
    };

  router.stack.forEach((layer) => {
    if (layer.route) {
      layer.route.stack.forEach((route) => {
        if (route.handle) {
          route.handle = wrap(route.handle);
        }
      });
    }
  });
};
