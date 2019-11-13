'use strict';
import { Application } from 'egg';

export default (app: Application) => {
  const { router, controller } = app;

  router.get('/', controller.home.index);
  router.get('/api/ping', controller.home.index);
  /** TEST: unregister consul */
  // router.get('/api/unregister', controller.home.unregister);

  /**
   * 番茄钟类
   */
  router.get('/api/tomato', controller.tomato.list);
  router.get('/api/tomato/:id', controller.tomato.findById);
  router.get('/filter/tomatotoday', controller.tomato.tomatoToday);
  router.post('/api/tomato', controller.tomato.create);
  router.post('/api/search', controller.tomato.search);
  router.post('/api/tomato/statistics', controller.tomato.statistics);
  router.post('/api/tomato/pagination', controller.tomato.pagination);
  router.del('/api/tomato/:id', controller.tomato.deleteById);
  router.post('/api/tomato/:id', controller.tomato.updateById);

  /**
   * 任务类
   */
  router.get('/api/task', controller.task.list);
  router.get('/api/task/:id', controller.task.findById);
  router.post('/api/task', controller.task.create);
  router.del('/api/task/:id', controller.task.deleteById);
  router.post('/api/task/:id', controller.task.updateById);
};
