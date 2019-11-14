'use strict';

import { EggAppConfig, PowerPartial } from 'egg';
const env = process.env;

// 提供给 config.{env}.ts 使用
export type DefaultConfig = PowerPartial<EggAppConfig & BizConfig>;

// 应用本身的配置 Scheme
export interface BizConfig {
  robot: {
    ua: any;
  };
}

// appInfo: EggAppInfo
export default () => {
  const config = {} as PowerPartial<EggAppConfig> & BizConfig;

  config.cluster = {
    listen: {
      port: 8005,
    },
  };

  config.keys = 'com.server.tomatopomodoro';
  config.middleware = ['errorhandler'];

  config.consul = {
    client: {
      host: {
         // register center ip , default 127.0.0.1
        ip: '127.0.0.1',
        // register center port, default 8500
        port: '8500', 
        // optional
        defaults: { 
          // token: 'acl token'
        }
      },
      server: {
        name: 'tomato-pomodoro', // project name, default project name
        // service ip, default extranet ip
        // address: '', 
        // service port, default service port
        // port: '', 
        check: {
          path: '/api/ping' // health check http path
        },
        tags: ['tomato'] // service tags
      }
    }
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.logger = {
    level: 'DEBUG',
    consoleLevel: 'INFO',
    dir: './logs',
    encoding: 'utf-8',
    // 应用启动后，也能看日志( 文档中没说明, 且不建议使用 )
    // disableConsoleAfterReady: false,
  };

  config.static = {
    dir: '../app/public',
    prefix: '',
    buffer: true,
    maxAge: 31536000,
    dynamic: false,
    preload: false,
    maxFiles: 20,
  };

  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/tomato-pomodoro',
    options: {},
  };

  config.token = {
    tokenSecret: env.tokenSecret || 'tomatobang',
    tokenExpiresIn: env.tokenExpiresIn || '3d',
  };

  return config;
};
