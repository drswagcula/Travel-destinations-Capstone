const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const app = require('./server');

const prisma = new PrismaClient();


let testUserId;
let testDestinationId;
let testReviewId;
let testAuthToken; 

beforeAll(async () => {
 
  await prisma.report.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.destination.deleteMany({});
  await prisma.user.deleteMany({});

  
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: hashedPassword, 
     
    },
  });
  testUserId = user.id;


  const destination = await prisma.destination.create({
    data: {
      name: 'Test City',
      description: 'A beautiful city for testing.',
      main_image_url: 'https://example.com/placeholder-image.jpg',
      city: 'TestCityName',
      country: 'TestCountry',
    }
  });
  testDestinationId = destination.id;

  const review = await prisma.review.create({
    data: {
      rating: 5,
      content: 'This is a test review.',
      destinationId: testDestinationId,
      userId: testUserId,
    },
  });
  testReviewId = review.id;

 
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ identifier: 'testuser', password: 'password123' });
  testAuthToken = loginResponse.body.token;

  console.log('Database seeded for tests. Test User ID:', testUserId, 'Destination ID:', testDestinationId, 'Review ID:', testReviewId);
  console.log('Test Auth Token:', testAuthToken ? 'Generated' : 'Failed to generate');
});

afterAll(async () => {
 
  await prisma.report.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.destination.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.$disconnect(); 
});


const getUniqueString = () => `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

describe('API Endpoints', () => {
  describe('/api/auth/register', () => {
    it('should respond with 201 for successful user registration', async () => {
      const uniqueUsername = getUniqueString();
      const uniqueEmail = `${uniqueUsername}@example.com`;
      const newUser = {
        username: uniqueUsername,
        email: uniqueEmail,
        password: 'securepassword',
      };
      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(response.statusCode).toBe(201);
     
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.username).toBe(newUser.username);
      expect(response.body.user.email).toBe(newUser.email);
    });

    it('should respond with 400 for missing required fields', async () => {
      const incompleteUser = { username: 'missingfielduser' }; 
      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteUser);

      expect(response.statusCode).toBe(400);
      
      expect(response.body.error).toBe('Please provide username, email, and password.');
    });

    it('should respond with 400 for invalid email format', async () => {
      const uniqueUsername = getUniqueString();
      const invalidEmailUser = {
        username: uniqueUsername,
        email: 'invalid-email', 
        password: 'password123',
      };
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidEmailUser);

      expect(response.statusCode).toBe(400);
      
      expect(response.body.error).toBe('Invalid email format.');
    });

    it('should respond with 409 for existing username', async () => {
      
      const duplicateUser = {
        username: 'testuser',
        email: getUniqueString() + '@example.com', 
        password: 'somepassword',
      };
      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateUser);

      expect(response.statusCode).toBe(409);
      
      expect(response.body.error).toBe('Username or email already exists.');
    });

    it('should respond with 409 for existing email', async () => {
     
      const duplicateUser = {
        username: getUniqueString(), 
        email: 'test@example.com',
        password: 'somepassword',
      };
      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateUser);

      expect(response.statusCode).toBe(409);
      
      expect(response.body.error).toBe('Username or email already exists.');
    });
  });

  describe('/api/auth/login', () => {
    it('should respond with 200 and a token for successful login with username', async () => {
      const loginCredentials = {
        identifier: 'testuser',
        password: 'password123',
      };
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginCredentials);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.message).toBe('Login successful');
    });

    it('should respond with 200 and a token for successful login with email', async () => {
      const loginCredentials = {
        identifier: 'test@example.com',
        password: 'password123',
      };
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginCredentials);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.message).toBe('Login successful');
    });

    it('should respond with 400 for missing identifier or password', async () => {
      const incompleteLogin1 = { password: 'somepassword' }; // Missing identifier
      const response1 = await request(app)
        .post('/api/auth/login')
        .send(incompleteLogin1);
      expect(response1.statusCode).toBe(400);
      expect(response1.body.error).toBe('Please provide username/email and password.');

      const incompleteLogin2 = { identifier: 'testlogin' }; // Missing password
      const response2 = await request(app)
        .post('/api/auth/login')
        .send(incompleteLogin2);
      expect(response2.statusCode).toBe(400);
      expect(response2.body.error).toBe('Please provide username/email and password.');
    });

    it('should respond with 401 for invalid identifier', async () => {
      const loginCredentials = {
        identifier: 'nonexistentuser',
        password: 'password123',
      };
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginCredentials);

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('Invalid credentials.');
    });

    it('should respond with 401 for incorrect password', async () => {
      const loginCredentials = {
        identifier: 'testuser',
        password: 'wrongpassword',
      };
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginCredentials);

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('Invalid credentials.');
    });
  });

  describe('/api/destinations', () => {
    it('should respond with 200 for GET /api/destinations', async () => {
      const response = await request(app).get('/api/destinations');
      expect(response.statusCode).toBe(200);
      
      expect(Array.isArray(response.body.destinations) || Array.isArray(response.body)).toBe(true);
      expect(response.body.message).toBe('Get all destinations endpoint hit');
    });

    it('should respond with 200 for GET /api/destinations/:destinationId', async () => {
      if (!testDestinationId) fail('Test destination ID not available from setup');
      const response = await request(app).get(`/api/destinations/${testDestinationId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe(`Get destination with ID ${testDestinationId} endpoint hit`);
      expect(response.body.destination).toHaveProperty('id', testDestinationId);
    });

    it('should respond with 404 for GET /api/destinations/:destinationId with non-existent ID', async () => {
      const nonExistentId = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'; // Example non-existent UUID
      const response = await request(app).get(`/api/destinations/${nonExistentId}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe(`Destination with ID ${nonExistentId} not found`);
    });
  });

  describe('/api/reviews', () => {
    it('should respond with 201 for POST /api/destinations/:destinationId/reviews with authentication', async () => {
      if (!testDestinationId || !testAuthToken) fail('Setup failed: destination ID or auth token missing.');

      const reviewData = {
        rating: 4,
        content: `New test review for destination ${testDestinationId}`,
      };

      const response = await request(app)
        .post(`/api/destinations/${testDestinationId}/reviews`)
        .set('Authorization', `Bearer ${testAuthToken}`) 
        .send(reviewData);

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('Review created successfully');
      expect(response.body.review).toHaveProperty('id');
      expect(response.body.review.content).toBe(reviewData.content);
    });

    it('should respond with 401 for POST /api/destinations/:destinationId/reviews without authentication', async () => {
      if (!testDestinationId) fail('Test destination ID not available from setup');

      const response = await request(app)
        .post(`/api/destinations/${testDestinationId}/reviews`)
        .send({ rating: 5, content: 'This is a test review.' });

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('Authentication required');
    });

    it('should respond with 200 for GET /api/destinations/:destinationId/reviews', async () => {
      if (!testDestinationId) fail('Test destination ID not available from setup');
      const response = await request(app).get(`/api/destinations/${testDestinationId}/reviews`);
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body.reviews) || Array.isArray(response.body)).toBe(true);
      expect(response.body.message).toBe(`Get reviews for destination ID ${testDestinationId} endpoint hit`);
    });

    it('should respond with 200 for GET /api/destinations/:destinationId/reviews/:reviewId', async () => {
      if (!testDestinationId || !testReviewId) fail('Test destination or review ID not available from setup');
      const response = await request(app).get(`/api/destinations/${testDestinationId}/reviews/${testReviewId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe(`Get review ${testReviewId} for destination ${testDestinationId} endpoint hit`);
      expect(response.body.review).toHaveProperty('id', testReviewId);
    });

    it('should respond with 404 for GET /api/destinations/:destinationId/reviews/:reviewId with non-existent ID', async () => {
      if (!testDestinationId) fail('Test destination ID not available from setup');
      const nonExistentReviewId = 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb'; 
      const response = await request(app).get(`/api/destinations/${testDestinationId}/reviews/${nonExistentReviewId}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe(`Review with ID ${nonExistentReviewId} not found`);
    });

    it('should respond with 200 for GET /api/reviews/me with authentication', async () => {
      if (!testAuthToken) fail('Test authentication token not available.');
      const response = await request(app)
        .get('/api/reviews/me')
        .set('Authorization', `Bearer ${testAuthToken}`); 
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Get user\'s reviews endpoint hit');
      expect(Array.isArray(response.body.reviews)).toBe(true);
    });

    it('should respond with 401 for GET /api/reviews/me without authentication', async () => {
      const response = await request(app).get('/api/reviews/me');
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('Authentication required');
    });
  });

  describe('/api/reports', () => {
    it('should respond with 201 for POST /api/reports with authentication', async () => {
      if (!testReviewId || !testAuthToken) fail('Setup failed: review ID or auth token missing.');

      const reportData = {
        reason: 'Inappropriate content',
        reviewId: testReviewId,
      };

      const response = await request(app)
        .post('/api/reports')
        .set('Authorization', `Bearer ${testAuthToken}`) 
        .send(reportData);

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('Report submitted successfully');
      expect(response.body.report).toHaveProperty('id');
      expect(response.body.report.reason).toBe(reportData.reason);
    });

    it('should respond with 401 for POST /api/reports without authentication', async () => {
      const reportData = {
        reason: 'Inappropriate content',
        reviewId: testReviewId,
      };
      const response = await request(app)
        .post('/api/reports')
        .send(reportData);

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('Authentication required');
    });

    it('should respond with 200 for GET /api/reports/me with authentication', async () => {
      if (!testAuthToken) fail('Test authentication token not available.');
      const response = await request(app)
        .get('/api/reports/me')
        .set('Authorization', `Bearer ${testAuthToken}`); 
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Get user\'s reports endpoint hit');
      expect(Array.isArray(response.body.reports)).toBe(true);
    });

    it('should respond with 401 for GET /api/reports/me without authentication', async () => {
      const response = await request(app).get('/api/reports/me');
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('Authentication required');
    });
  });
});