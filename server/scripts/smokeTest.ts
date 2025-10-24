process.env.PORT = process.env.PORT ?? '4000';
process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'test-access-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'test-refresh-secret';
process.env.JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';
process.env.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? '30d';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN ?? '*';

import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/prisma';

const log = (label: string, payload: unknown): void => {
  console.log(`\n== ${label} ==`);
  console.dir(payload, { depth: null, colors: true });
};

const run = async (): Promise<void> => {
  await prisma.$connect();

  const email = `smoke-${Date.now()}@example.com`;
  const password = 'SmokeTest1!';

  await prisma.refreshToken.deleteMany({ where: { user: { email } } });
  await prisma.authProvider.deleteMany({ where: { user: { email } } });
  await prisma.user.deleteMany({ where: { email } });

  const registerResponse = await request(app).post('/auth/register').send({
    email,
    password,
    displayName: 'Smoke Test User'
  });
  log('Register Response', registerResponse.body);

  const loginResponse = await request(app).post('/auth/login').send({
    email,
    password
  });
  log('Login Response', loginResponse.body);

  const accessToken = loginResponse.body.tokens?.accessToken;
  const refreshToken = loginResponse.body.tokens?.refreshToken;

  if (!accessToken || !refreshToken) {
    throw new Error('Login response did not include tokens');
  }

  const meResponse = await request(app)
    .get('/auth/me')
    .set('Authorization', `Bearer ${accessToken}`);
  log('Me Response', meResponse.body);

  const refreshResponse = await request(app).post('/auth/refresh').send({
    refreshToken
  });
  log('Refresh Response', refreshResponse.body);

  const rotatedRefreshToken = refreshResponse.body.tokens?.refreshToken ?? refreshToken;

  const logoutResponse = await request(app).post('/auth/logout').send({
    refreshToken: rotatedRefreshToken
  });
  log('Logout Response', { status: logoutResponse.status });
};

run()
  .then(() => {
    console.log('\nSmoke test completed successfully.');
    return prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('\nSmoke test failed:', error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
