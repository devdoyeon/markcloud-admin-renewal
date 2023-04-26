const { createProxyMiddleware } = require('http-proxy-middleware');
const t = 'http://192.168.0.44:5555/'; // 지은님
// const t = 'http://192.168.0.47:5555/';
const us = 'http://192.168.0.102:8980/'; // 해외 데이터 API

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: t,
      changeOrigin: true,
    })
  );
  app.use(
    '/us',
    createProxyMiddleware({
      target: us,
      changeOrigin: true,
    })
  );
};
