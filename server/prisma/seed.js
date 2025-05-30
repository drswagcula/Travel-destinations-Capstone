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
      password: hashedPassword, 
      username: 'adminuser',
      role: 'ADMIN',
    },
  });
  console.log(`Created/updated user: ${adminUser.username} (ID: ${adminUser.id})`);

  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      password: hashedPassword, 
      username: 'alice_travels',
      role: 'USER',
    },
  });
  console.log(`Created/updated user: ${alice.username} (ID: ${alice.id})`);

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      password: hashedPassword, 
      username: 'bob_explores',
      role: 'USER',
    },
  });
  console.log(`Created/updated user: ${bob.username} (ID: ${bob.id})`);

 
  const kyoto = await prisma.destination.upsert({
    where: { name: 'Kyoto' },
    update: {},
    create: {
      name: 'Kyoto',
      description: 'Ancient capital of Japan, known for its temples, gardens, geishas, and traditional wooden houses.',
      main_image_url: 'https://example.com/kyoto.jpg',
      city: 'Kyoto',
      country: 'Japan',
    },
  });
  console.log(`Created/updated destination: ${kyoto.name}`);

  const grandCanyon = await prisma.destination.upsert({
    where: { name: 'Grand Canyon' },
    update: {},
    create: {
      name: 'Grand Canyon',
      description: 'Steep-sided canyon carved by the Colorado River in Arizona, USA. Known for its immense size and intricate, colorful landscape.',
      main_image_url: 'https://example.com/grand-canyon.jpg',
      city: 'Grand Canyon Village',
      country: 'USA',
    },
  });
  console.log(`Created/updated destination: ${grandCanyon.name}`);

  const boraBora = await prisma.destination.upsert({
    where: { name: 'Bora Bora' },
    update: {},
    create: {
      name: 'Bora Bora',
      description: 'A small South Pacific island northwest of Tahiti in French Polynesia, surrounded by sand-fringed motus and a turquoise lagoon.',
      main_image_url: 'https://example.com/bora-bora.jpg',
      city: 'Bora Bora',
      country: 'French Polynesia',
    },
  });
  console.log(`Created/updated destination: ${boraBora.name}`);


  const review1 = await prisma.review.upsert({
    where: { userId_destinationId: { userId: alice.id, destinationId: kyoto.id } },
    update: {},
    create: {
      userId: alice.id,
      destinationId: kyoto.id,
      rating: 5,
      content: 'Kyoto was absolutely magical! Every temple, every garden, a true masterpiece.',
    },
  });
  console.log(`Created/updated review (ID: ${review1.id})`);

  const review2 = await prisma.review.upsert({
    where: { userId_destinationId: { userId: bob.id, destinationId: grandCanyon.id } },
    update: {},
    create: {
      userId: bob.id,
      destinationId: grandCanyon.id,
      rating: 4,
      content: 'The Grand Canyon is breathtaking, but it gets very crowded. Go early!',
    },
  });
  console.log(`Created/updated review (ID: ${review2.id})`);

  const review3 = await prisma.review.upsert({
    where: { userId_destinationId: { userId: adminUser.id, destinationId: boraBora.id } },
    update: {},
    create: {
      userId: adminUser.id,
      destinationId: boraBora.id,
      rating: 5,
      content: 'Bora Bora is paradise on Earth. The overwater bungalows are a must-try.',
    },
  });
  console.log(`Created/updated review (ID: ${review3.id})`);

  const review4 = await prisma.review.upsert({
    where: { userId_destinationId: { userId: alice.id, destinationId: grandCanyon.id } },
    update: {},
    create: {
      userId: alice.id,
      destinationId: grandCanyon.id,
      rating: 3,
      content: 'Views were spectacular, but the heat was intense. Prepare well.',
    },
  });
  console.log(`Created/updated review (ID: ${review4.id})`);

  
  await prisma.report.create({
    data: {
      reporterId: alice.id,
      targetDestinationId: grandCanyon.id, 
      reportType: 'destination',
      reason: 'The description for Grand Canyon seems outdated. They have new visitor centers and updated entrance procedures.',
      status: 'pending',
    },
  });
  console.log(`Created report for destination: ${grandCanyon.name}`);

  await prisma.report.create({
    data: {
      reporterId: bob.id,
      targetReviewId: review1.id,
      reportType: 'review' ,
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