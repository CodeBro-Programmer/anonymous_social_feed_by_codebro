let express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const app = express();

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

const cookieParser = require("cookie-parser");
const {ensureAnonymousId} = require("./middlewares/auth_middleware");
let errorMiddleware = require("./middlewares/error_middleware");

// Ratelimiters
const { postLimiter,
    actionLimiter} = require("./middlewares/rateLimiter_middleware");

const postRouters = require("./routes/post_routes");
const actionRoutes = require("./routes/actions_routes");

app.use(express.json());
app.use(errorMiddleware);
app.use(cookieParser());
app.use("/api",ensureAnonymousId);

app.use("/api/post",postLimiter,postRouters);
app.use("/api/actions",actionLimiter,actionRoutes);

module.exports = app