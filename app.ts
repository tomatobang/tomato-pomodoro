'use strict';

import * as path from 'path';
import { Application } from 'egg';
export default (app: Application) => {
  /**
   * 应用启动前初始化工作
   */
  app.beforeStart(async () => {
    app['tips'] = 'tomato-pomodoro start...';
    console.log(app['tips']);

    // 删除 socket 所有连接;处理未完成的番茄钟( TODO )
  });
  const directory = path.join(app.config.baseDir, 'app/util');
  app.loader.loadToApp(directory, 'util');
};
