const { createProxyMiddleware } = require('http-proxy-middleware');
const t = 'http://192.168.0.25:5555/';
const us = 'http://192.168.0.102:8980/';

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
