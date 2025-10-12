const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config("./.env");
const app = express();
app.use(cors());



app.use("/auth", createProxyMiddleware({
    target: "http://localhost:5000",
    changeOrigin: true,
    pathRewrite: { "^/auth": "/api/auth" }
}));

app.listen(process.env.PORT || 4000, () => {
    console.log(`API Gateway running on port ${process.env.PORT || 4000}`);
});
