'use strict';
import { Controller } from 'egg';

export default class BaseController extends Controller {
  select_field;
  validateRule;

  /**
   * search with conditions
   */
  async list() {
    const { ctx } = this;
    let conditions: any;
    conditions = {};
    const query = ctx.request.query;
    ctx.logger.info('ctx.request：', ctx.request['currentUser']);
    // filter with logged userinfo
    conditions.userid = ctx.request['currentUser'].username;
    if (query.conditions) {
      conditions = JSON.parse(query.conditions);
    }
    const result = await this.service.findAll(query, conditions);
    ctx.body = result;
    ctx.status = 200;
  }

  /**
   * search by id
   */
  async findById() {
    const { ctx } = this;
    const query = ctx.request.query;
    const id = ctx.params.id;
    const result = await this.service.findById(query, id);
    ctx.body = result;
  }

  /**
   * create record
   */
  async create() {
    const { ctx, app } = this;
    // filter with logged userinfo
    ctx.request.body.userid = ctx.request['currentUser'].username;
    if (this.validateRule) {
      const invalid = app['validator'].validate(
        this.validateRule,
        ctx.request.body
      );
      if (invalid) {
        ctx.throw(400);
      }
    }
    const result = await this.service.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = result;
  }

  /**
   * delete record by id
   */
  async deleteById() {
    const { ctx } = this;
    const id = ctx.params.id;
    const result = await this.service.delete(id);
    ctx.body = result;
  }

  /**
   * update record by id
   */
  async updateById() {
    const { ctx } = this;
    const id = ctx.params.id;
    const body = ctx.request.body;
    const result = await this.service.updateById(id, body);
    ctx.body = result;
  }

  /**
   * replace record by id
   */
  async replaceById() {
    const { ctx } = this;
    const newDocument = ctx.request.body;
    const id = ctx.params.id;
    newDocument._id = id;
    const result = await this.service.replaceById(id, newDocument);
    ctx.body = result;
  }

  /**
   * load record by pagination
   */
  async pagination() {
    const { ctx } = this;
    const current = ctx.request.body.current;
    let userid = '';
    userid = ctx.request['currentUser']._id;
    if (!this.select_field) {
      ctx.status = 403;
      ctx.body = {
        error_msg: '暂不支持分页!',
      };
      return;
    }
    if (!current || current < 1) {
      ctx.status = 403;
      ctx.body = {
        error_msg: 'current 参数格式不正确!',
      };
      return;
    }
    const ret = await this.service.loadByPagination(
      {
        current,
        userid,
        pageSize: 6,
        sorter: {
          startTime: -1,
        },
      },
      this.select_field
    );
    ctx.status = 200;
    ctx.body = ret;
  }

  /**
   * error util function
   * @param {*} type error type
   * @param {*} message error message
   */
  async throwBizError(type, message) {
    if (type === 'DB:ERR') {
      throw new Error('DB:ERR');
    }
    if (type === 'FILE:ERR') {
      throw new Error('FILE:ERR');
    } else {
      throw new Error(message);
    }
  }
}
