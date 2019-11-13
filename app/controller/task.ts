'use strict';
import BaseController from './base';

import { taskValidationRule } from '../validate/task';

export default class TaskController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.task;
    this.validateRule = taskValidationRule;
  }
}
