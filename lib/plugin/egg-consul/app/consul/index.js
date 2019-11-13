'use strict';

const Consul = require('consul');
const Bluebird = require('bluebird');

function fromCallback(fn) {
  return new Bluebird(function (resolve, reject) {
    try {
      return fn(function (err, data, res) {
        if (err) {
          err.res = res;
          return reject(err);
        }
        return resolve([data, res]);
      });
    } catch (err) {
      return reject(err);
    }
  });
}

async function createConsul(config) {
  const {
    host = {},
    server = {},
  } = config;

  const consul = consulFactory(host);
  consul.config = server;
  return consul;
}

function consulFactory(config) {
  const { ip = '127.0.0.1', port = '8500', secure = false, defaults = {} } = config;
  return Consul({
    host: ip,
    port,
    secure,
    defaults,
    promisify: fromCallback,
  });
}

module.exports = {
  createConsul,
};
