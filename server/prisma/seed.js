const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); 

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  
  const hashedPassword = await bcrypt.hash('password123', 10); 

  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {}, 
    create: {
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      username: 'adminuser',
      role: 'admin',
    },
  });
  console.log(`Created/updated user: ${adminUser.username} (ID: ${adminUser.id})`);

  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      passwordHash: hashedPassword,
      username: 'alice_travels',
      role: 'user',
    },
  });
  console.log(`Created/updated user: ${alice.username} (ID: ${alice.id})`);

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      passwordHash: hashedPassword,
      username: 'bob_explores',
      role: 'user',
    },
  });
  console.log(`Created/updated user: ${bob.username} (ID: ${bob.id})`);


  // --- 2. Create Destinations ---
  const kyoto = await prisma.destination.upsert({
    where: { name: 'Kyoto, Japan' }, // Unique field for upsert where clause
    update: {},
    create: {
      name: 'Kyoto, Japan',
      description: 'Ancient capital known for its temples, gardens, and traditional wooden houses. A blend of history and modernity, offering serene beauty and vibrant culture.',
      mainImageUrl: 'https://images.unsplash.com/photo-1545562083-a7201c10d32f?auto=format&fit=crop&w=800&q=80', // Example Unsplash image
      city: 'Kyoto',
      country: 'Japan',
    },
  });
  console.log(`Created/updated destination: ${kyoto.name} (ID: ${kyoto.id})`);


  const grandCanyon = await prisma.destination.upsert({
    where: { name: 'Grand Canyon National Park' },
    update: {},
    create: {
      name: 'Grand Canyon National Park',
      description: 'A majestic natural wonder carved by the Colorado River, offering breathtaking views, hiking trails, and unique geological formations.',
      mainImageUrl: 'https://images.unsplash.com/photo-1540866162383-a9d554a9d701?auto=format&fit=crop&w=800&q=80', // Example Unsplash image
      city: 'Grand Canyon',
      country: 'USA',
    },
  });
  console.log(`Created/updated destination: ${grandCanyon.name} (ID: ${grandCanyon.id})`);

  const boraBora = await prisma.destination.upsert({
    where: { name: 'Bora Bora, French Polynesia' },
    update: {},
    create: {
      name: 'Bora Bora, French Polynesia',
      description: 'A stunning island with luxurious overwater bungalows, crystal-clear turquoise waters, and vibrant marine life, perfect for relaxation and water sports.',
      mainImageUrl: 'https://images.unsplash.com/photo-1510414961555-c72782928579?auto=format&fit=crop&w=800&q=80', // Example Unsplash image
      city: 'Bora Bora',
      country: 'French Polynesia',
    },
  });
  console.log(`Created/updated destination: ${boraBora.name} (ID: ${boraBora.id})`);


  // --- 3. Create Reviews ---
  // Using the unique composite key for upserting reviews
  const review1 = await prisma.review.upsert({
    where: {
      userId_destinationId: { // This matches the @@unique([userId, destinationId]) in schema.prisma
        userId: alice.id,
        destinationId: kyoto.id
      }
    },
    update: {},
    create: {
      userId: alice.id,
      destinationId: kyoto.id,
      rating: 5,
      content: 'Kyoto was an unforgettable experience! The temples are breathtaking and the food is incredible. Highly recommend visiting in cherry blossom season.',
    },
  });
  console.log(`Created/updated review (ID: ${review1.id}) for ${kyoto.name}`);


  const review2 = await prisma.review.upsert({
    where: {
      userId_destinationId: {
        userId: bob.id,
        destinationId: kyoto.id
      }
    },
    update: {},
    create: {
      userId: bob.id,
      destinationId: kyoto.id,
      rating: 4,
      content: 'Beautiful city, but can get quite crowded, especially at popular spots. Still highly recommend for its cultural richness!',
    },
  });
  console.log(`Created/updated review (ID: ${review2.id}) for ${kyoto.name}`);


  const review3 = await prisma.review.upsert({
    where: {
      userId_destinationId: {
        userId: alice.id,
        destinationId: grandCanyon.id
      }
    },
    update: {},
    create: {
      userId: alice.id,
      destinationId: grandCanyon.id,
      rating: 5,
      content: 'The Grand Canyon is absolutely immense and awe-inspiring. A must-visit natural wonder, especially at sunrise or sunset.',
    },
  });
  console.log(`Created/updated review (ID: ${review3.id}) for ${grandCanyon.name}`);


  const review4 = await prisma.review.upsert({
    where: {
      userId_destinationId: {
        userId: bob.id,
        destinationId: boraBora.id
      }
    },
    update: {},
    create: {
      userId: bob.id,
      destinationId: boraBora.id,
      rating: 5,
      content: 'Bora Bora is paradise on Earth. Perfect for relaxation and stunning views. The overwater bungalows are a dream!',
    },
  });
  console.log(`Created/updated review (ID: ${review4.id}) for ${boraBora.name}`);



  
  await prisma.report.create({
    data: {
      reporterId: alice.id,
      targetId: grandCanyon.id, 
      reportType: 'destination',
      reason: 'The description for Grand Canyon seems outdated. They have new visitor centers and updated entrance procedures.',
      status: 'pending',
    },
  });
  console.log(`Created report for destination: ${grandCanyon.name}`);


  await prisma.report.create({
    data: {
      reporterId: bob.id,
      targetId: review1.id, 
      reportType: 'review',
      reason: 'This review for Kyoto sounds suspiciously generic and could be AI-generated. Please check.',
      status: 'pending',
    },
  });
  console.log(`Created report for review (ID: ${review1.id})`);


  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1); 
  })
  .finally(async () => {
    await prisma.$disconnect(); 
  });