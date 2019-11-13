'use strict';
import { Context, Application } from 'egg';

export default function errorhandlerMiddleware(option, app: Application) {
  return async function(ctx: Context, next) {
    try {
      await next();
    } catch (err) {
      app.emit('error', err, this);
      const status = err.status || 500;
      // error in production env should not show to users
      const error =
        status === 500 && app.env === 'prod'
          ? 'Internal Server Error'
          : err.message;
      ctx.body = { error };
      if (status === 422) {
        ctx.body.detail = err.errors;
      }
      ctx.status = status;
    }
  };
}
