'use strict';

const Subscription = require('egg').Subscription;
const ip = require('../utils/ip');
const project = require('../utils/project');

class RegisterSubscription extends Subscription {
  static get schedule() {
    return {
      type: 'worker',
      immediate: true,
    };
  }

  async subscribe() {
    const { app } = this;
    this.registerServer(app);
  }

  async registerServer(app) {
    const { config } = app.consul;
    const realPort = app.server.address().port;
    try {
      const realIp = await ip.getRealIp(app);
      const projectName = project.getProjectName();
      const { name = projectName, address = realIp, port = realPort, check = {}, tags = [projectName] } = config;

      const { path, interval = '5s', notes = 'http service check', status = 'passing' } = check;
      if (path) {
        check.http = `http://${address}:${port}${path}`;
      } else {
        check.http = `http://${address}:${port}`;
      }
      const checkConfig = Object.assign({}, { interval, notes, status }, check);

      await app.consul.agent.service.register({
        name,
        tags,
        check: checkConfig,
        address,
        port,
      });
      app.logger.info('server register succeed');
    } catch (err) {
      app.logger.error('register failed', err);
      process.kill(process.ppid, 'SIGKILL');
    }
  }
}

module.exports = RegisterSubscription;
