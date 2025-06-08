// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createCountries(countryList) {
  for (const countryData of countryList) {
    await prisma.country.upsert({
      where: { name: countryData.name },
      update: {},
      create: {
        name: countryData.name,
        code: countryData.code,
      },
    });
  }
}

async function main() {
  console.log('Start seeding...');

  const countriesToSeed = [
    // Asia
    { name: 'Japan', code: 'JP' },
    { name: 'China', code: 'CN' },
    { name: 'India', code: 'IN' },
    { name: 'South Korea', code: 'KR' },
    { name: 'Thailand', code: 'TH' },

    // South America
    { name: 'Brazil', code: 'BR' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Peru', code: 'PE' },
    { name: 'Chile', code: 'CL' },
    { name: 'Colombia', code: 'CO' },

    // Europe
    { name: 'France', code: 'FR' },
    { name: 'Italy', code: 'IT' },
    { name: 'Germany', code: 'DE' },
    { name: 'Spain', code: 'ES' },
    { name: 'United Kingdom', code: 'GB' },

    // Middle East
    { name: 'United Arab Emirates', code: 'AE' },
    { name: 'Turkey', code: 'TR' },
    { name: 'Israel', code: 'IL' },
    { name: 'Jordan', code: 'JO' },
    { name: 'Egypt', code: 'EG' },

    // Africa
    { name: 'South Africa', code: 'ZA' },
    { name: 'Kenya', code: 'KE' },
    { name: 'Morocco', code: 'MA' },
    { name: 'Tanzania', code: 'TZ' },
    { name: 'Nigeria', code: 'NG' },

    // North America
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'Mexico', code: 'MX' },
    { name: 'Cuba', code: 'CU' },
    { name: 'Costa Rica', code: 'CR' },

    // Oceania
    { name: 'Australia', code: 'AU' },
    { name: 'New Zealand', code: 'NZ' },
    { name: 'Fiji', code: 'FJ' },
    { name: 'French Polynesia', code: 'PF' },
    { name: 'Papua New Guinea', code: 'PG' },
  ];
  await createCountries(countriesToSeed);
  console.log('Finished seeding countries.');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'adminuser',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log(`Created/updated user: ${adminUser.username}`);

  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      username: 'alice_travels',
      email: 'alice@example.com',
      password: hashedPassword,
      role: 'user',
    },
  });
  console.log(`Created/updated user: ${alice.username}`);

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      username: 'bob_explores',
      email: 'bob@example.com',
      password: hashedPassword,
      role: 'user',
    },
  });
  console.log(`Created/updated user: ${bob.username}`);


  const destinationsToSeed = [
    // Asia
    { name: "Tokyo", description: "Vibrant capital of Japan.", main_image_url: "https://example.com/tokyo.jpg", city: "Tokyo", countryName: "Japan" },
    { name: "Beijing", description: "China's sprawling capital with ancient and modern architecture.", main_image_url: "https://example.com/beijing.jpg", city: "Beijing", countryName: "China" },
    { name: "New Delhi", description: "India's capital, a mix of old and new.", main_image_url: "https://example.com/newdelhi.jpg", city: "New Delhi", countryName: "India" },
    { name: "Seoul", description: "South Korea's modern capital, known for K-Pop and historical sites.", main_image_url: "https://example.com/seoul.jpg", city: "Seoul", countryName: "South Korea" },
    { name: "Bangkok", description: "Thailand's capital, known for ornate shrines and vibrant street life.", main_image_url: "https://example.com/bangkok.jpg", city: "Bangkok", countryName: "Thailand" },

    // South America
    { name: "Rio de Janeiro", description: "Coastal city in Brazil, famous for Copacabana and Christ the Redeemer.", main_image_url: "https://example.com/rio.jpg", city: "Rio de Janeiro", countryName: "Brazil" },
    { name: "Buenos Aires", description: "Argentina's capital, known for tango and European architecture.", main_image_url: "https://example.com/buenosaires.jpg", city: "Buenos Aires", countryName: "Argentina" },
    { name: "Machu Picchu", description: "Ancient Inca city in Peru, high in the Andes Mountains.", main_image_url: "https://example.com/machupicchu.jpg", city: "Machu Picchu", countryName: "Peru" },
    { name: "Santiago", description: "Chile's capital, nestled below the Andes.", main_image_url: "https://example.com/santiago.jpg", city: "Santiago", countryName: "Chile" },
    { name: "Cartagena", description: "Colombia's walled city, a UNESCO World Heritage site.", main_image_url: "https://example.com/cartagena.jpg", city: "Cartagena", countryName: "Colombia" },

    // Europe
    { name: "Paris", description: "The capital of France, known for art, fashion, and culture.", main_image_url: "https://static.independent.co.uk/s3fs-public/thumbnails/image/2014/03/25/12/eiffel.jpg?width=1200", city: "Paris", countryName: "France" },
    { name: "Rome", description: "Italy's capital, a city of ancient ruins and iconic landmarks.", main_image_url: "https://example.com/rome.jpg", city: "Rome", countryName: "Italy" },
    { name: "Berlin", description: "Germany's capital, known for its history and art scene.", main_image_url: "https://example.com/berlin.jpg", city: "Berlin", countryName: "Germany" },
    { name: "Barcelona", description: "Spain's vibrant city, known for Gaudí's architecture.", main_image_url: "https://example.com/barcelona.jpg", city: "Barcelona", countryName: "Spain" },
    { name: "London", description: "England's capital, a global center of finance and culture.", main_image_url: "https://example.com/london.jpg", city: "London", countryName: "United Kingdom" },

    // Middle East
    { name: "Dubai", description: "A city in the UAE, known for luxury shopping, modern architecture.", main_image_url: "https://example.com/dubai.jpg", city: "Dubai", countryName: "United Arab Emirates" },
    { name: "Istanbul", description: "Turkey's major city, bridging Europe and Asia.", main_image_url: "https://example.com/istanbul.jpg", city: "Istanbul", countryName: "Turkey" },
    { name: "Jerusalem", description: "A holy city for Christians, Jews, and Muslims.", main_image_url: "https://example.com/jerusalem.jpg", city: "Jerusalem", countryName: "Israel" },
    { name: "Petra", description: "Ancient city in Jordan, carved into rock.", main_image_url: "https://example.com/petra.jpg", city: "Petra", countryName: "Jordan" },
    { name: "Giza", description: "Home to the Great Pyramids of Egypt.", main_image_url: "https://example.com/giza.jpg", city: "Giza", countryName: "Egypt" },

    // Africa
    { name: "Cape Town", description: "Coastal city in South Africa, dominated by Table Mountain.", main_image_url: "https://example.com/capetown.jpg", city: "Cape Town", countryName: "South Africa" },
    { name: "Maasai Mara", description: "Large game reserve in Kenya, famous for wildlife.", main_image_url: "https://example.com/maasaimara.jpg", city: "Maasai Mara", countryName: "Kenya" },
    { name: "Marrakech", description: "Imperial city in Morocco, known for its souks and palaces.", main_image_url: "https://example.com/marrakech.jpg", city: "Marrakech", countryName: "Morocco" },
    { name: "Serengeti National Park", description: "Vast ecosystem in Tanzania, home to the Great Migration.", main_image_url: "https://example.com/serengeti.jpg", city: "Serengeti National Park", countryName: "Tanzania" },
    { name: "Lagos", description: "Nigeria's largest city, a major financial hub.", main_image_url: "https://example.com/lagos.jpg", city: "Lagos", countryName: "Nigeria" },

    // North America
    { name: "New York City", description: "Iconic global city, known for its skyscrapers and culture.", main_image_url: "https://example.com/nyc.jpg", city: "New York City", countryName: "United States" },
    { name: "Vancouver", description: "Coastal city in Canada, known for its mountains and arts scene.", main_image_url: "https://example.com/vancouver.jpg", city: "Vancouver", countryName: "Canada" },
    { name: "Mexico City", description: "Mexico's bustling capital, rich in history and culture.", main_image_url: "https://example.com/mexicocity.jpg", city: "Mexico City", countryName: "Mexico" },
    { name: "Havana", description: "Cuba's capital, known for its vintage cars and colonial architecture.", main_image_url: "https://example.com/havana.jpg", city: "Havana", countryName: "Cuba" },
    { name: "San José", description: "Costa Rica's capital, surrounded by volcanoes and rainforests.", main_image_url: "https://example.com/sanjose.jpg", city: "San José", countryName: "Costa Rica" },

    // Oceania
    { name: "Sydney", description: "Australia's largest city, famous for its Opera House and harbor.", main_image_url: "https://example.com/sydney.jpg", city: "Sydney", countryName: "Australia" },
    { name: "Queenstown", description: "New Zealand's adventure capital, set against stunning mountains.", main_image_url: "https://example.com/queenstown.jpg", city: "Queenstown", countryName: "New Zealand" },
    { name: "Nadi", description: "Major hub in Fiji, gateway to the Mamanuca and Yasawa Islands.", main_image_url: "https://example.com/nadi.jpg", city: "Nadi", countryName: "Fiji" },
    { name: "Bora Bora", description: "A luxurious island in French Polynesia, known for clear waters.", main_image_url: "https://example.com/borabora.jpg", city: "Bora Bora", countryName: "French Polynesia" },
    { name: "Port Moresby", description: "Capital of Papua New Guinea, with diverse tribal cultures.", main_image_url: "https://example.com/portmoresby.jpg", city: "Port Moresby", countryName: "Papua New Guinea" },
  ];

  for (const destData of destinationsToSeed) {
    const destination = await prisma.destination.upsert({
      where: { name: destData.name },
      update: {},
      create: {
        name: destData.name,
        description: destData.description,
        main_image_url: destData.main_image_url,
        city: destData.city,
        country: {
          connect: { name: destData.countryName }
        }
      }
    });
    // Added console log to see the image URL saved
    console.log(`Created/updated destination: ${destination.name}, Image URL: ${destination.main_image_url}`);
  }


  const review1 = await prisma.review.upsert({
    where: {
      userId_destinationId: {
        userId: alice.id,
        destinationId: (await prisma.destination.findUnique({ where: { name: 'Bora Bora' } })).id
      }
    },
    update: {},
    create: {
      rating: 5,
      content: "Paradise on Earth! The overwater bungalows were amazing.",
      user: { connect: { id: alice.id } },
      destination: { connect: { name: 'Bora Bora' } }
    }
  });
  console.log(`Created/updated review for Bora Bora by ${alice.username}`);

  const review2 = await prisma.review.upsert({
    where: {
      userId_destinationId: {
        userId: bob.id,
        destinationId: (await prisma.destination.findUnique({ where: { name: 'Machu Picchu' } })).id
      }
    },
    update: {},
    create: {
      rating: 4,
      content: "Incredible historical site, truly a wonder!",
      user: { connect: { id: bob.id } },
      destination: { connect: { name: 'Machu Picchu' } }
    }
  });
  console.log(`Created/updated review for Machu Picchu by ${bob.username}`);

  console.log('Seeding finished.');
}

main()
  .catch(e => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });