const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const app = require('./server');
const prisma = new PrismaClient();


let testData = {};


beforeAll(async () => {
  // Create test user
  const user = await prisma.user.create({
    data: {
      username: 'testuser',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'USER'
    }
  });

 
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN'
    }
  });

  
  const destination = await prisma.destination.create({
    data: {
      name: 'Test Destination',
      description: 'Test description',
      city: 'Test City',
      country: 'Test Country'
    }
  });

  
  testData = {
    userId: user.id,
    adminId: admin.id,
    destinationId: destination.id,
    userToken: (await request(app).post('/api/auth/login').send({
      identifier: 'testuser',
      password: 'password123'
    })).body.token,
    adminToken: (await request(app).post('/api/auth/login').send({
      identifier: 'admin',
      password: 'admin123'
    })).body.token
  };
});

afterAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "User", "Destination", "Review", "Report" RESTART IDENTITY CASCADE`;
  await prisma.$disconnect();
});


test('Register user', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123'
    });
  expect(res.status).toBe(201);
});

test('Login user', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      identifier: 'testuser',
      password: 'password123'
    });
  expect(res.status).toBe(200);
});


test('Get destinations', async () => {
  const res = await request(app).get('/api/destinations');
  expect(res.status).toBe(200);
});

test('Create destination', async () => {
  const res = await request(app)
    .post('/api/destinations')
    .set('Authorization', `Bearer ${testData.adminToken}`)
    .send({
      name: 'New Destination',
      description: 'New description'
    });
  expect(res.status).toBe(201);
});


test('Create review', async () => {
  const res = await request(app)
    .post(`/api/destinations/${testData.destinationId}/reviews`)
    .set('Authorization', `Bearer ${testData.userToken}`)
    .send({
      rating: 5,
      content: 'Great place!'
    });
  expect(res.status).toBe(201);
});

test('Create report', async () => {
  const res = await request(app)
    .post('/api/reports')
    .set('Authorization', `Bearer ${testData.userToken}`)
    .send({
      targetId: testData.destinationId,
      reportType: 'destination',
      reason: 'Test reason'
    });
  expect(res.status).toBe(201);
});