"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const env_1 = require("./config/env");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const app = (0, express_1.default)();
const corsOptions = env_1.env.CORS_ORIGIN === '*'
    ? {
        origin: true,
        credentials: true
    }
    : {
        origin: env_1.env.CORS_ORIGIN,
        credentials: true
    };
app.disable('x-powered-by');
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)(env_1.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime()
    });
});
app.use('/auth', authRoutes_1.default);
app.use(errorMiddleware_1.notFoundHandler);
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map