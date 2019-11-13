'use strict';

import BaseService from './base';
export default class TaskService extends BaseService {
  constructor(ctx) {
    super(ctx);
    this.model = this.ctx.model.Task;
  }
}
