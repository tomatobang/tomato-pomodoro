'use strict';
import { Controller } from 'egg';

export default class HomeController extends Controller {
  async index() {
    this.ctx.status = 200;
    this.ctx.body = 'ok'
    // this.ctx.body = 'hi, ' + this.app.plugins.consul.name;
  }

  /** TEST: unregister consul */
  // unregister() {
  //   const { app, ctx } = this;
  //   ctx.status = 200;
  //   app.consul.agent.service.deregister('tomato-server');
  //   app.logger.info('服务关闭解除注册');
  // }
}
