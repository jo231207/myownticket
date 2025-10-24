"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.PORT = process.env.PORT ?? '4000';
process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'test-access-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'test-refresh-secret';
process.env.JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';
process.env.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? '30d';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN ?? '*';
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const prisma_1 = require("../src/config/prisma");
const log = (label, payload) => {
    console.log(`\n== ${label} ==`);
    console.dir(payload, { depth: null, colors: true });
};
const run = async () => {
    await prisma_1.prisma.$connect();
    const email = `smoke-${Date.now()}@example.com`;
    const password = 'SmokeTest1!';
    await prisma_1.prisma.refreshToken.deleteMany({ where: { user: { email } } });
    await prisma_1.prisma.authProvider.deleteMany({ where: { user: { email } } });
    await prisma_1.prisma.user.deleteMany({ where: { email } });
    const registerResponse = await (0, supertest_1.default)(app_1.default).post('/auth/register').send({
        email,
        password,
        displayName: 'Smoke Test User'
    });
    log('Register Response', registerResponse.body);
    const loginResponse = await (0, supertest_1.default)(app_1.default).post('/auth/login').send({
        email,
        password
    });
    log('Login Response', loginResponse.body);
    const accessToken = loginResponse.body.tokens?.accessToken;
    const refreshToken = loginResponse.body.tokens?.refreshToken;
    if (!accessToken || !refreshToken) {
        throw new Error('Login response did not include tokens');
    }
    const meResponse = await (0, supertest_1.default)(app_1.default)
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);
    log('Me Response', meResponse.body);
    const refreshResponse = await (0, supertest_1.default)(app_1.default).post('/auth/refresh').send({
        refreshToken
    });
    log('Refresh Response', refreshResponse.body);
    const rotatedRefreshToken = refreshResponse.body.tokens?.refreshToken ?? refreshToken;
    const logoutResponse = await (0, supertest_1.default)(app_1.default).post('/auth/logout').send({
        refreshToken: rotatedRefreshToken
    });
    log('Logout Response', { status: logoutResponse.status });
};
run()
    .then(() => {
    console.log('\nSmoke test completed successfully.');
    return prisma_1.prisma.$disconnect();
})
    .catch(async (error) => {
    console.error('\nSmoke test failed:', error);
    await prisma_1.prisma.$disconnect();
    process.exitCode = 1;
});
//# sourceMappingURL=smokeTest.js.map