"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const prisma_1 = require("./config/prisma");
const signals = ['SIGINT', 'SIGTERM', 'SIGUSR2'];
const bootstrap = async () => {
    await (0, prisma_1.connectPrisma)();
    const server = http_1.default.createServer(app_1.default);
    server.listen(env_1.env.PORT, () => {
        console.log(`[server] listening on port ${env_1.env.PORT}`);
    });
    const shutdown = async (signal) => {
        console.log(`[server] received ${signal}, shutting down gracefully`);
        server.close(async (error) => {
            if (error) {
                console.error('[server] error while closing HTTP server', error);
                process.exit(1);
            }
            await (0, prisma_1.disconnectPrisma)();
            process.exit(0);
        });
    };
    signals.forEach((signal) => {
        process.on(signal, () => {
            void shutdown(signal);
        });
    });
};
bootstrap().catch(async (error) => {
    console.error('[server] failed to start', error);
    await (0, prisma_1.disconnectPrisma)();
    process.exit(1);
});
//# sourceMappingURL=index.js.map