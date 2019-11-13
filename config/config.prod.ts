'use strict';
const env = process.env;

exports.keys = 'com.server.tomatobill';
exports.middleware = [ 'errorhandler', ];

exports.security = {
  csrf: {
    enable: false,
  },
};

exports.logger = {
  level: 'DEBUG',
  consoleLevel: 'INFO',
};

exports.static = {
  buffer: true,
  maxAge: 31536000,
};


exports.mongoose = {
  url: 'mongodb://' + env.DATABASE_MONGODB_USERNAME_PASSWORD + '@' + env.DATABASE_MONGODB_HOST_PORT + '/tomatobang',
  options: {},
};

exports.serverPort = {
  serverPort: env.serverPort || 3000,
};

