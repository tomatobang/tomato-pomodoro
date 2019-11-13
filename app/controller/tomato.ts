'use strict';

import BaseController from './base';
import { tomatoValidationRule } from '../validate/tomato';

export default class TomatoController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.tomato;
    this.validateRule = tomatoValidationRule;
    this.select_field =
      '_id title target description startTime endTime succeed breakReason userid ';
  }

  async statistics() {
    const { ctx } = this;
    const isSuccess = ctx.request.body.isSuccess;
    const date = ctx.request.body.date;
    let userid = ctx.request['currentUser'].username;
    const starDate = ctx.helper.dateHelper.getCurrentMonthFirst(date);
    const endDate = ctx.helper.dateHelper.getNextMonthFirst(date);
    const ret = await ctx.service.tomato.statistics(
      userid,
      starDate,
      endDate,
      isSuccess
    );
    if (ret.length) {
      ctx.status = 200;
      ctx.body = ret;
    } else {
      ctx.status = 200;
      ctx.body = [];
    }
  }

  /**
   * load today tomatoes
   */
  async tomatoToday() {
    const { ctx } = this;
    let datenow = new Date();
    const gteDate = new Date(datenow.setHours(0,0,0,0));
    let conditions: any;
    conditions = { startTime: { $gte: gteDate } };
    conditions.userid = ctx.request['currentUser'].username;
    const ret = await ctx.service.tomato.findAll({}, conditions);
    if (ret.length) {
      ctx.status = 200;
      ctx.body = ret;
    } else {
      ctx.status = 200;
      ctx.body = [];
    }
  }

  /**
   * search by keyword
   */
  async search() {
    const { ctx } = this;
    let keywords = ctx.request.body.keywords;
    keywords = ctx.helper.escape(keywords);
    const ret = await ctx.service.tomato.findAll(
      {},
      {
        title: { $regex: keywords, $options: 'i' },
      }
    );
    ctx.status = 200;
    ctx.body = ret;
  }
}
