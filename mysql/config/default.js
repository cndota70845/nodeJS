// default.js
// 设置配置文件
const config = {
    // 启动端口
    port: 3000,
  
    // 数据库配置
    database: {
        DATABASE: 'koa',
        USERNAME: 'root',
        PASSWORD: '',
        PORT: '3306',
        HOST: '127.0.0.1'
    }
  }
  
  module.exports = config