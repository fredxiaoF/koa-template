const Boot = require('./boot');

global.Koa = require('koa');
Koa.app = new Koa();
Koa.env = process.env['NODE_ENV'] || 'development';

// cookie salt
Koa.app.keys = require(`./secrets.js`)[Koa.env];

// 全局配置
Koa.app.config = {
  // 设置时区
  time_zone: 'Beijing',
  
  // 类的自动加载路径
  autoload_paths: ['app/controllers', 'app/jobs', 'app/models', 'lib'],
  
  // 设置本地化
  default_locale: "zh-CN"
}

// 加载不同环境(开发、测试、生产)个性化配置
require(`./environments/${Koa.env}`);

// 开始引导
Boot.start();


