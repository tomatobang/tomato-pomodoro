'use strict';

const os = require('os');

// TODO: 判断是否存在 windows 兼容性
const networks = os.networkInterfaces();

function getRealIp() {
  const ips = [];
  for (const devName in networks) {
    const iface = networks[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        ips.push(alias.address);
      }
    }
  }
  if (ips.length === 0) {
    throw new Error('无外网ip');
  }
  if (ips.length === 1) {
    return ips[0];
  }
  const real = ips.filter(i => {
    return !i.startsWith('127.') || !i.startsWith('172.');
  });

  return real.length > 0 ? real[0] : ips[0];
}

module.exports = { getRealIp };
