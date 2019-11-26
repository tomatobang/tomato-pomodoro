'use strict';

import { EggPlugin } from 'egg';
import * as path from 'path';

const plugin: EggPlugin = {
  static: true,
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  consul: {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-consul'),
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  validate: {
    package: 'egg-validate',
  },
};

export default plugin;
