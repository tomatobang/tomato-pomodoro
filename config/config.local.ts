'use strict';
// EggAppInfo
import { EggAppConfig, PowerPartial } from 'egg';

// 提供给 config.{env}.ts 使用
export type DefaultConfig = PowerPartial<EggAppConfig & BizConfig>;

// 应用本身的配置 Scheme
export interface BizConfig {
  news: {
    pageSize: number;
    serverUrl: string;
  };
}

export default () => {
  const config = {} as PowerPartial<EggAppConfig> & BizConfig;

  config.logger = {
    coreLogger: {
      consoleLevel: 'WARN',
    },
  };
  return config;
};
