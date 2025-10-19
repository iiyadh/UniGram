const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config("./.env");
const app = express();
app.use(cors());


app.use((req, res, next) => {
  console.log(`
    -> ${req.method} ${req.originalUrl}
    headers: ${JSON.stringify(req.headers)}
    body: ${JSON.stringify(req.body)}
    from: ${req.ip}
  `);
  next();
});

app.use("/auth", createProxyMiddleware({
    target: "http://localhost:5000",
    changeOrigin: true,
    pathRewrite: { "^/auth": "/api/auth" }
}));


app.use("/ref", createProxyMiddleware({
    target: "http://localhost:6000",
    changeOrigin: true,
    pathRewrite: { "^/ref": "/api/ref" }
}));

app.listen(process.env.PORT || 4000, () => {
    console.log(`API Gateway running on port ${process.env.PORT || 4000}`);
});
