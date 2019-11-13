'use strict';

module.exports = {
 
  async getService(name) {
    const checks = await this.consul.agent.check.list();
    const services = await this.consul.agent.service.list();
    if (Object.keys(checks).length <= 0) {
      throw new Error('list of services is empty');
    }
    const checkId = 'service:' + name;
    let check = checks[0][checkId];
    if (!check) {
      check = checks[0][name]
    }
    if (!check) {
      throw new Error(`service not found: ${name}`);
    }
    if (check.Status !== 'passing') {
      throw new Error(`service status abnormal: ${name}`);
    }
    const service = services[0][name];
    const { Address, Port } = service;
    return 'http://' + Address + ':' + Port;
  },
};
