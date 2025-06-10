// prisma/seed.js
const { PrismaClient, UserRole } = require('@prisma/client');
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

  // Generate a hashed password for '0000'
  const hashedPasswordForZero = await bcrypt.hash('0000', 10);
  // Generate a hashed password for 'password123' (for regular users)
  const hashedPasswordForRegularUser = await bcrypt.hash('password123', 10);


  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'adminuser',
      email: 'admin@example.com',
      password: hashedPasswordForZero, // Changed to 0000
      role: UserRole.ADMIN,
    },
  });
  console.log(`Created/updated user: ${adminUser.username}`);

  const engineerUser = await prisma.user.upsert({
    where: { email: 'engineer@example.com' },
    update: {},
    create: {
      username: 'engineer_dev',
      email: 'engineer@example.com',
      password: hashedPasswordForZero, // Changed to 0000
      role: UserRole.ENGINEER,
    },
  });
  console.log(`Created/updated user: ${engineerUser.username}`);


  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      username: 'alice_travels',
      email: 'alice@example.com',
      password: hashedPasswordForRegularUser, // Retains original password
      role: UserRole.USER,
    },
  });
  console.log(`Created/updated user: ${alice.username}`);

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      username: 'bob_explores',
      email: 'bob@example.com',
      password: hashedPasswordForRegularUser, // Retains original password
      role: UserRole.USER,
    },
  });
  console.log(`Created/updated user: ${bob.username}`);


  const destinationsToSeed = [
    // Asia
    { name: "Tokyo", description: "Vibrant capital of Japan.", main_image_url: "https://media.istockphoto.com/id/484915982/photo/akihabara-tokyo.jpg?s=612x612&w=0&k=20&c=kbCRYJS5vZuF4jLB3y4-apNebcCEkWnDbKPpxXdf9Cg=", city: "Tokyo", countryName: "Japan" },
    { name: "Beijing", description: "China's sprawling capital with ancient and modern architecture.", main_image_url: "https://personal.santaferelo.com/wp-content/uploads/2022/07/zhang-kaiyv-9v_Nork6P1w-unsplash.jpg", city: "Beijing", countryName: "China" },
    { name: "New Delhi", description: "India's capital, a mix of old and new.", main_image_url: "https://cdn.britannica.com/37/189837-050-F0AF383E/New-Delhi-India-War-Memorial-arch-Sir.jpg", city: "New Delhi", countryName: "India" },
    { name: "Seoul", description: "South Korea's modern capital, known for K-Pop and historical sites.", main_image_url: "https://www.onsemi.com/site/images/location-seoul-korea.png", city: "Seoul", countryName: "South Korea" },
    { name: "Bangkok", description: "Thailand's capital, known for ornate shrines and vibrant street life.", main_image_url: "https://lifestyleintransit.wordpress.com/wp-content/uploads/2021/08/63113-khao-san-road.jpg", city: "Bangkok", countryName: "Thailand" },

    // South America
    { name: "Rio de Janeiro", description: "Coastal city in Brazil, famous for Copacabana and Christ the Redeemer.", main_image_url: "https://destinationlesstravel.com/wp-content/uploads/2022/10/The-Christ-the-Redeemer-with-Rio-de-Janeiro-in-the-background-as-seen-from-a-scenic-flight.jpg.webp", city: "Rio de Janeiro", countryName: "Brazil" },
    { name: "Buenos Aires", description: "Argentina's capital, known for tango and European architecture.", main_image_url: "https://www.fodors.com/wp-content/uploads/2018/08/HERO-BA-Instagrammable-Neighborhood-La-Boca-18.jpg", city: "Buenos Aires", countryName: "Argentina" },
    { name: "Machu Picchu", description: "Ancient Inca city in Peru, high in the Andes Mountains.", main_image_url: "https://www.civitatis.com/f/pois/ChIJVVVViV-abZERJxqgpA43EDo.jpg", city: "Machu Picchu", countryName: "Peru" },
    { name: "Santiago", description: "Chile's capital, nestled below the Andes.", main_image_url: "https://img.klm.com.cn/images/media/B9D57625-293F-441D-817B53BBE527C8F7", city: "Santiago", countryName: "Chile" },
    { name: "Cartagena", description: "Colombia's walled city, a UNESCO World Heritage site.", main_image_url: "https://www.metropolitan-touring.com/wp-content/uploads/2024/03/cartagena-vacation-hotels.webp", city: "Cartagena", countryName: "Colombia" },

    // Europe
    { name: "Paris", description: "The capital of France, known for art, fashion, and culture.", main_image_url: "https://www.chooseparisregion.org/sites/default/files/news/6---Tour-Eiffel_AdobeStock_644956457_1920_72dpi.jpg", city: "Paris", countryName: "France" },
    { name: "Rome", description: "Italy's capital, a city of ancient ruins and iconic landmarks.", main_image_url: "https://i.natgeofe.com/n/3012ffcc-7361-45f6-98b3-a36d4153f660/colosseum-daylight-rome-italy.jpg", city: "Rome", countryName: "Italy" },
    { name: "Berlin", description: "Germany's capital, known for its history and art scene.", main_image_url: "https://digital.ihg.com/is/image/ihg/holiday-inn-express-berlin-6603765708-4x3", city: "Berlin", countryName: "Germany" },
    { name: "Barcelona", description: "Spain's vibrant city, known for Gaudí's architecture.", main_image_url: "https://media.cnn.com/api/v1/images/stellar/prod/180528121352-07-barcelona-beach-guide.jpg?q=w_1110,c_fill", city: "Barcelona", countryName: "Spain" },
    { name: "London", description: "England's capital, a global center of finance and culture.", main_image_url: "https://i.natgeofe.com/n/fb2875fc-bad9-44f8-8c45-fab6184719b7/20240629-0302-Jonathan%20Irish-NGCW-CITI-AA-London-_7R57614-Enhanced-NR.jpg", city: "London", countryName: "United Kingdom" },

    // Middle East
    { name: "Dubai", description: "A city in the UAE, known for luxury shopping, modern architecture.", main_image_url: "https://cdn.britannica.com/15/189715-050-4310222B/Dubai-United-Arab-Emirates-Burj-Khalifa-top.jpg", city: "Dubai", countryName: "United Arab Emirates" },
    { name: "Istanbul", description: "Turkey's major city, bridging Europe and Asia.", main_image_url: "https://cdn.jacadatravel.com/wp-content/uploads/bis-images/311027/birds-eye-view-of-istanbul-2400x1400-f50_50.jpg", city: "Istanbul", countryName: "Turkey" },
    { name: "Jerusalem", description: "A holy city for Christians, Jews, and Muslims.", main_image_url: "https://www.aljazeera.com/wp-content/uploads/2025/04/2025-04-19T194548Z_1561789024_RC2Z0EAO3LGA_RTRMADP_3_RELIGION-EASTER-ORTHODOX-HOLY-FIRE-1745134291.jpg?resize=1170%2C780&quality=80", city: "Jerusalem", countryName: "Israel" },
    { name: "Petra", description: "Ancient city in Jordan, carved into rock.", main_image_url: "https://thenextcrossing.com/wp-content/uploads/2014/04/jordan_petra_the_monastery_1210-HDR-Pano-compressed.jpg", city: "Petra", countryName: "Jordan" },
    { name: "Giza", description: "Home to the Great Pyramids of Egypt.", main_image_url: "https://cdn-imgix.headout.com/media/images/e3e4b92772a00bf08922a79dd5a874d7-Giza.jpg", city: "Giza", countryName: "Egypt" },

    // Africa
    { name: "Cape Town", description: "Coastal city in South Africa, dominated by Table Mountain.", main_image_url: "https://www.go2africa.com/wp-content/uploads/2024/11/Banner-.jpg", city: "Cape Town", countryName: "South Africa" },
    { name: "Maasai Mara", description: "Large game reserve in Kenya, famous for wildlife.", main_image_url: "https://d2g6byanrj0o4m.cloudfront.net/images/61548/dreamstimesmall_52321164__schema.jpg", city: "Maasai Mara", countryName: "Kenya" },
    { name: "Marrakech", description: "Imperial city in Morocco, known for its souks and palaces.", main_image_url: "https://www.gokitetours.com/wp-content/uploads/2024/09/Best-Things-to-do-in-Marrakech-Morocco-1200x675.webp", city: "Marrakech", countryName: "Morocco" },
    { name: "Serengeti National Park", description: "Vast ecosystem in Tanzania, home to the Great Migration.", main_image_url: "https://www.mgahinganationalpark.org/wp-content/uploads/2024/09/Serengeti-National-Park-1-1.jpg", city: "Serengeti National Park", countryName: "Tanzania" },
    { name: "Lagos", description: "Nigeria's largest city, a major financial hub.", main_image_url: "https://justinpluslauren.com/wp-content/uploads/2024/12/2023-Lagos124.jpg.webp", city: "Lagos", countryName: "Nigeria" },

    // North America
    { name: "New York City", description: "Iconic global city, known for its skyscrapers and culture.", main_image_url: "https://www.offsoho.com/images/NYC_000021208828-2100-980.jpg", city: "New York City", countryName: "United States" },
    { name: "Vancouver", description: "Coastal city in Canada, known for its mountains and arts scene.", main_image_url: "https://t4.ftcdn.net/jpg/01/74/63/07/360_F_174630794_EH0hPCw8y8TPhZKXSJbP6V3FczhTNA0R.jpg", city: "Vancouver", countryName: "Canada" },
    { name: "Mexico City", description: "Mexico's bustling capital, rich in history and culture.", main_image_url: "https://cdn.britannica.com/08/95008-050-1BA29F61/Central-Mexico-City.jpg", city: "Mexico City", countryName: "Mexico" },
    { name: "Havana", description: "Cuba's capital, known for its vintage cars and colonial architecture.", main_image_url: "https://media.digitalnomads.world/wp-content/uploads/2021/01/20120641/havana-for-digital-nomads.jpg", city: "Havana", countryName: "Cuba" },
    { name: "San José", description: "Costa Rica's capital, surrounded by volcanoes and rainforests.", main_image_url: "https://images.goway.com/production/styles/wide/s3/hero/iStock-1489883845.jpg?VersionId=WapxuG1oyNGdJDzzqYQpQR9ef2IWJHCE&itok=5Vem6Lqv", city: "San José", countryName: "Costa Rica" },

    // Oceania
    { name: "Sydney", description: "Australia's largest city, famous for its Opera House and harbor.", main_image_url: "https://i.natgeofe.com/n/bd48279e-be5a-4f28-9551-5cb917c6766e/GettyImages-103455489cropped.jpg?w=2560&h=1706", city: "Sydney", countryName: "Australia" },
    { name: "Queenstown", description: "New Zealand's adventure capital, set against stunning mountains.", main_image_url: "https://www.datocms-assets.com/6737/1533735054-queenstown-viewtnz.jpg?auto=compress%2Cformat&crop=faces&fit=crop&fm=jpg", city: "Queenstown", countryName: "New Zealand" },
    { name: "Nadi", description: "Major hub in Fiji, gateway to the Mamanuca and Yasawa Islands.", main_image_url: "https://images.goway.com/production/styles/hero_s1_2xl/s3/hero/fiji_nadi_aerial_AdobeStock_206649549.jpeg?VersionId=lFDFl.c3nxe2RLQdF_FvNEckRLU0e_u6&h=bdf380e2&itok=hZJafzKY", city: "Nadi", countryName: "Fiji" },
    { name: "Bora Bora", description: "A luxurious island in French Polynesia, known for clear waters.", main_image_url: "https://cdn.britannica.com/16/60016-050-5D8447C8/peaks-Bora-Bora-Society-Islands-lagoon-French-Polynesia.jpg", city: "Bora Bora", countryName: "French Polynesia" },
    { name: "Port Moresby", description: "Capital of Papua New Guinea, with diverse tribal cultures.", main_image_url: "https://insidestory.org.au/wp-content/uploads/moresby.jpg", city: "Port Moresby", countryName: "Papua New Guinea" },
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