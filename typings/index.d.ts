import { RedisChatService, RedisTomatoService } from '../app/util/redis';
import tokenService from '../app/util/jwt';

declare module 'egg' {
  interface Application {
    consul:any;
    redis: any;
    mongoose: any;
    validator: any;
    util: {
      jwt: {
        tokenService: {
          createToken(userinfo): any;
          verifyToken(token): any;
          expiresIn;
        };
      };
    };
  }
}
