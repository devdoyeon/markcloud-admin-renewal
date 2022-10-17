const { createProxyMiddleware } = require("http-proxy-middleware");
const t = "http://192.168.0.25:5555/";

module.exports = function (app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target: t,
            changeOrigin: true,
        })
    );
};
