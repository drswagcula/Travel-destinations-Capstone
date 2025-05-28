// src/data.js
// Centralized mock data handling
let dummyDestinations = JSON.parse(localStorage.getItem('dummyDestinations')) || [];
let dummyUsers = JSON.parse(localStorage.getItem('dummyUsers')) || [];
// Initialize dummy reviews array
let dummyReviews = JSON.parse(localStorage.getItem('dummyReviews')) || [];

export const seedDatabase = () => {
    console.log("seedDatabase called.");

    // Seed Destinations
    if (dummyDestinations.length === 0) {
        dummyDestinations = [
            { id: 'paris', name: 'Paris, France', category: 'European City, Romantic', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/1024px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg', averageRating: 4.5, info: 'The capital and most populous city of France, known for its iconic landmarks, romantic atmosphere, and rich culture.' },
            { id: 'tokyo', name: 'Tokyo, Japan', category: 'Asian City, Modern', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku%2C_Tokyo%2C_Japan.jpg/1024px-Skyscrapers_of_Shinjuku%2C_Tokyo%2C_Japan.jpg', averageRating: 4.2, info: 'A bustling metropolis known for its futuristic technology, vibrant pop culture, and ancient traditions.' },
            { id: 'machu-picchu', name: 'Machu Picchu, Peru', category: 'Historical Site, South America', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/1024px-Machu_Picchu%2C_Peru.jpg', averageRating: 4.8, info: 'An ancient Inca citadel set high in the Andes Mountains, above the Urubamba River valley.' },
            { id: 'bali', name: 'Bali, Indonesia', category: 'Island, Tropical, Relaxing', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Pura_Ulun_Danu_Bratan_temple.jpg/1024px-Pura_Ulun_Danu_Bratan_temple.jpg', averageRating: 4.9, info: 'A popular Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.' },
            { id: 'rome', name: 'Rome, Italy', category: 'European City, Historical', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg/1024px-Colosseum_in_Rome%2C_Italy_-_April_2007.jpg', averageRating: 4.6, info: 'The capital city of Italy, a vast, complex display of historical and artistic splendor.' },
            { id: 'new-york-city', name: 'New York City, USA', category: 'North American City, Urban', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/The_Empire_State_Building_from_the_Rockefeller_Center.jpg/1024px-The_Empire_State_Building_from_the_Rockefeller_Center.jpg', averageRating: 4.3, info: 'A global hub of finance, fashion, art, and culture, famous for its skyscrapers like the Empire State Building.' },
            { id: 'sydney', name: 'Sydney, Australia', category: 'Oceanic City, Coastal', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Sydney_Opera_House_by_David_Iliff_--_3_retouched.jpg/1024px-Sydney_Opera_House_by_David_Iliff_--_3_retouched.jpg', averageRating: 4.4, info: 'Australia\'s largest city, known for its harbourfront Opera House, Bridge, and beautiful beaches.' },
            { id: 'cairo', name: 'Cairo, Egypt', category: 'African City, Historical', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Pyramids_of_Giza.jpg/1024px-Pyramids_of_Giza.jpg', averageRating: 3.9, info: 'The capital of Egypt and the largest city in the Arab world, home to the Pyramids of Giza.' },
            { id: 'rio-de-janeiro', name: 'Rio de Janeiro, Brazil', category: 'South American City, Coastal', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Christ_the_Redeemer_-_Rio_de_Janeiro%2C_Brazil.jpg/1024px-Christ_the_Redeemer_-_Rio_de_Janeiro%2C_Brazil.jpg', averageRating: 4.7, info: 'A sprawling Brazilian city known for its breathtaking landscapes, vibrant culture, and famous Carnival festival.' },
            { id: 'cape-town', name: 'Cape Town, South Africa', category: 'African City, Coastal', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Cape_Town_and_Table_Mountain_from_Bloubergstrand.jpg/1024px-Cape_Town_and_Table_Mountain_from_Bloubergstrand.jpg', averageRating: 4.6, info: 'A port city on South Africa’s southwest coast, known for its Table Mountain backdrop and stunning natural beauty.' },
            { id: 'london', name: 'London, UK', category: 'European City, Historical', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Big_Ben_and_Houses_of_Parliament_at_dusk.jpg/1024px-Big_Ben_and_Houses_of_Parliament_at_dusk.jpg', averageRating: 4.5, info: 'Capital of England and the United Kingdom, a 21st-century city with history stretching back to Roman times.' },
            { id: 'berlin', name: 'Berlin, Germany', category: 'European City, Historical', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Reichstag_building_Berlin_Germany.jpg/1024px-Reichstag_building_Berlin_Germany.jpg', averageRating: 4.3, info: 'Germany\'s capital, famous for its significant history, vibrant arts scene, and modern landmarks.' },
            { id: 'dubai', name: 'Dubai, UAE', category: 'Middle Eastern City, Modern', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Burj_Khalifa_night_view.jpg/1024px-Burj_Khalifa_night_view.jpg', averageRating: 4.1, info: 'A city and emirate in the United Arab Emirates known for luxury shopping, ultramodern architecture and a lively nightlife scene.' },
            { id: 'barcelona', name: 'Barcelona, Spain', category: 'European City, Coastal', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Barcelona_-_Parc_G%C3%BCell_-_01.jpg/1024px-Barcelona_-_Parc_G%C3%BCell_-_01.jpg', averageRating: 4.4, info: 'The cosmopolitan capital of Spain’s Catalonia region, known for its art and architecture.' },
            { id: 'amsterdam', name: 'Amsterdam, Netherlands', category: 'European City, Canal', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Amsterdam_canals_with_houseboats.jpg/1024px-Amsterdam_canals_with_houseboats.jpg', averageRating: 4.3, info: 'Capital of the Netherlands, known for its artistic heritage, elaborate canal system and narrow houses.' },
            { id: 'prague', name: 'Prague, Czech Republic', category: 'European City, Historical', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Prague_Old_Town_Square.jpg/1024px-Prague_Old_Town_Square.jpg', averageRating: 4.7, info: 'Capital of the Czech Republic, nicknamed “the City of a Hundred Spires,” known for its Old Town Square.' },
            { id: 'vancouver', name: 'Vancouver, Canada', category: 'North American City, Coastal', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Vancouver_skyline_at_night.jpg/1024px-Vancouver_skyline_at_night.jpg', averageRating: 4.2, info: 'A bustling west coast seaport in British Columbia, known for its natural beauty and diverse cultural scene.' },
            { id: 'bangkok', name: 'Bangkok, Thailand', category: 'Asian City, Cultural', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Wat_Arun_at_sunset%2C_Bangkok%2C_Thailand.jpg/1024px-Wat_Arun_at_sunset%2C_Bangkok%2C_Thailand.jpg', averageRating: 4.0, info: 'Thailand\'s capital, a large city known for its ornate shrines and vibrant street life.' },
            { id: 'kyoto', name: 'Kyoto, Japan', category: 'Asian City, Historical', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Kinkaku-ji%2C_Kyoto%2C_Japan.jpg/1024px-Kinkaku-ji%2C_Kyoto%2C_Japan.jpg', averageRating: 4.8, info: 'Former capital of Japan, famous for its numerous classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.' },
            { id: 'hanoi', name: 'Hanoi, Vietnam', category: 'Asian City, Cultural', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Hoan_Kiem_Lake%2C_Hanoi.jpg/1024px-Hoan_Kiem_Lake%2C_Hanoi.jpg', averageRating: 4.1, info: 'The capital of Vietnam, known for its centuries-old architecture and a rich culture with Southeast Asian, Chinese and French influences.' },
            { id: 'dublin', name: 'Dublin, Ireland', category: 'European City, Cultural', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Dublin_Castle_-_St_Patrick%27s_Park_-_IMG_4705.jpg/1024px-Dublin_Castle_-_St_Patrick%27s_Park_-_IMG_4705.jpg', averageRating: 4.2, info: 'Capital of the Republic of Ireland, a vibrant city known for its rich history and literary heritage.' },
            { id: 'mexico-city', name: 'Mexico City, Mexico', category: 'North American City, Cultural', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Palacio_de_Bellas_Artes%2C_Mexico_City.jpg/1024px-Palacio_de_Bellas_Artes%2C_Mexico_City.jpg', averageRating: 4.0, info: 'The high-altitude capital of Mexico, known for its Templo Mayor, majestic Palacio Nacional, and Metropolitan Cathedral.' },
            { id: 'buenos-aires', name: 'Buenos Aires, Argentina', category: 'South American City, Cultural', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Obelisco_de_Buenos_Aires%2C_Argentina.jpg/1024px-Obelisco_de_Buenos_Aires%2C_Argentina.jpg', averageRating: 4.5, info: 'Argentina\'s sprawling capital, known for its European atmosphere, vibrant nightlife, and tango dancing.' },
            { id: 'reykjavik', name: 'Reykjavik, Iceland', category: 'European City, Nature', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Hallgr%C3%ADmskirkja_church%2C_Reykjav%C3%ADk%2C_Iceland.jpg/1024px-Hallgr%C3%ADmskirkja_church%2C_Reykjav%C3%ADk%2C_Iceland.jpg', averageRating: 4.7, info: 'Capital of Iceland, a coastal city known for its striking landscape, the Blue Lagoon geothermal spa, and the Northern Lights.' },
            { id: 'venice', name: 'Venice, Italy', category: 'European City, Romantic', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Grand_Canal_at_Sunset%2C_Venice%2C_Italy.jpg/1024px-Grand_Canal_at_Sunset%2C_Venice%2C_Italy.jpg', averageRating: 4.6, info: 'A city in northeastern Italy sited on a group of 118 small islands separated by canals and linked by over 400 bridges.' },
            { id: 'seoul', name: 'Seoul, South Korea', category: 'Asian City, Modern', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Seoul_cityscape_at_night.jpg/1024px-Seoul_cityscape_at_night.jpg', averageRating: 4.3, info: 'The capital of South Korea, a huge metropolis where modern skyscrapers, high-tech subways and pop culture meet Buddhist temples, palaces and street markets.' },
            { id: 'nairobi', name: 'Nairobi, Kenya', category: 'African City, Wildlife', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Nairobi_National_Park.jpg/1024px-Nairobi_National_Park.jpg', averageRating: 3.8, info: 'The capital of Kenya, famous for the Nairobi National Park, a large game reserve known for breeding endangered black rhinos.' },
            { id: 'kuala-lumpur', name: 'Kuala Lumpur, Malaysia', category: 'Asian City, Modern', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Petronas_Twin_Towers%2C_Kuala_Lumpur%2C_Malaysia_02.jpg/1024px-Petronas_Twin_Towers%2C_Kuala_Lumpur%2C_Malaysia_02.jpg', averageRating: 4.0, info: 'The capital of Malaysia, known for its Petronas Twin Towers, cultural diversity, and vibrant street food scene.' },
            { id: 'santorini', name: 'Santorini, Greece', category: 'European Island, Romantic', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Oia_Santorini_Greece.jpg/1024px-Oia_Santorini_Greece.jpg', averageRating: 4.9, info: 'A Cycladic island in the Aegean Sea, famous for its dramatic landscapes, whitewashed villages, and stunning sunsets.' },
            { id: 'quebec-city', name: 'Quebec City, Canada', category: 'North American City, Historical', picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Chateau_Frontenac_Quebec_City.jpg/1024px-Chateau_Frontenac_Quebec_City.jpg', averageRating: 4.5, info: 'A predominantly French-speaking city in Canada’s Quebec province, known for its historic architecture and European feel.' }
        ];
        localStorage.setItem('dummyDestinations', JSON.stringify(dummyDestinations));
    } else {
        console.log('Dummy destinations already exist in localStorage, not re-seeding.');
    }

    // Seed Users
    if (dummyUsers.length === 0) {
        console.log("Seeding dummy users...");
        dummyUsers = [
            { id: 'kuma', email: 'cajukiku@gmail.com', role: 'user', reviewCount: 5, name: 'Regular User' },
            { id: 'admin1', email: 'admin@yourtravel.com', role: 'admin', reviewCount: 10, name: 'Admin User' },
            { id: 'engineer1', email: 'engineer@yourtravel.com', role: 'engineer', reviewCount: 2, name: 'Engineer User' },
            { id: 'user2', email: 'jane.doe@example.com', role: 'user', reviewCount: 3, name: 'Jane Doe' },
            { id: 'user3', email: 'john.smith@example.com', role: 'user', reviewCount: 8, name: 'John Smith' },
            { id: 'user4', email: 'alice.w@example.com', role: 'user', reviewCount: 1, name: 'Alice Williams' },
        ];
        localStorage.setItem('dummyUsers', JSON.stringify(dummyUsers));
        console.log("Dummy users seeded and saved to localStorage:", dummyUsers);
    } else {
        console.log("Dummy users already exist in localStorage, not re-seeding.");
    }

    // Seed Reviews (add some dummy reviews)
    if (dummyReviews.length === 0) {
        console.log("Seeding dummy reviews...");
        dummyReviews = [
            { id: 'rev1', destinationId: 'paris', userId: 'kuma', username: 'Regular User', rating: 5, comment: 'Absolutely magical! The Eiffel Tower at night is unforgettable.' },
            { id: 'rev2', destinationId: 'paris', userId: 'user2', username: 'Jane Doe', rating: 4, comment: 'Charming city, but a bit crowded. Loved the Louvre!' },
            { id: 'rev3', destinationId: 'tokyo', userId: 'user3', username: 'John Smith', rating: 5, comment: 'Incredible blend of tradition and futurism. The food was amazing!' },
            { id: 'rev4', destinationId: 'machu-picchu', userId: 'user4', username: 'Alice Williams', rating: 5, comment: 'A truly awe-inspiring historical site. Worth the hike!' },
            { id: 'rev5', destinationId: 'bali', userId: 'kuma', username: 'Regular User', rating: 5, comment: 'Perfect for relaxation and spiritual retreats. Beautiful beaches!' },
            { id: 'rev6', destinationId: 'rome', userId: 'admin1', username: 'Admin User', rating: 4, comment: 'So much history! Colosseum was breathtaking. Pasta was divine.' },
            { id: 'rev7', destinationId: 'new-york-city', userId: 'engineer1', username: 'Engineer User', rating: 3, comment: 'Energetic city, but a bit overwhelming. Times Square is a must-see once.' },
            { id: 'rev8', destinationId: 'sydney', userId: 'user2', username: 'Jane Doe', rating: 4, comment: 'Opera House is iconic. Enjoyed the ferry rides around the harbour.' },
            { id: 'rev9', destinationId: 'london', userId: 'user3', username: 'John Smith', rating: 4, comment: 'Classic European charm. Plenty of museums and history.' },
            { id: 'rev10', destinationId: 'santorini', userId: 'kuma', username: 'Regular User', rating: 5, comment: 'The sunsets are out of this world! Pure romance.' },
        ];
        localStorage.setItem('dummyReviews', JSON.stringify(dummyReviews));
        console.log("Dummy reviews seeded and saved to localStorage:", dummyReviews);
    } else {
        console.log("Dummy reviews already exist in localStorage, not re-seeding.");
    }
};

export const getDummyDestinations = () => {
    return JSON.parse(localStorage.getItem('dummyDestinations')) || [];
};

export const setDummyDestinations = (data) => {
    dummyDestinations = data;
    localStorage.setItem('dummyDestinations', JSON.stringify(dummyDestinations));
};

export const getDummyUsers = () => {
    return JSON.parse(localStorage.getItem('dummyUsers')) || [];
};

export const setDummyUsers = (data) => {
    dummyUsers = data;
    localStorage.setItem('dummyUsers', JSON.stringify(dummyUsers));
};

export const getDummyReviews = () => {
    return JSON.parse(localStorage.getItem('dummyReviews')) || [];
};

export const setDummyReviews = (data) => {
    dummyReviews = data;
    localStorage.setItem('dummyReviews', JSON.stringify(dummyReviews));
};

export const generateUniqueId = () => {
    return 'item-' + Math.random().toString(36).substr(2, 9);
};

// --- New functions for DestinationDetailPage ---

/**
 * Retrieves a single destination by its ID.
 * @param {string} id - The ID of the destination to retrieve.
 * @returns {object|undefined} The destination object if found, otherwise undefined.
 */
export const getDestinationById = (id) => {
    const destinations = getDummyDestinations(); // Get all destinations
    return destinations.find(dest => dest.id === id);
};

/**
 * Retrieves all reviews for a specific destination ID.
 * @param {string} destinationId - The ID of the destination.
 * @returns {Array<object>} An array of review objects for the given destination.
 */
export const getReviewsByDestinationId = (destinationId) => {
    const reviews = getDummyReviews(); // Get all reviews
    return reviews.filter(review => review.destinationId === destinationId);
};