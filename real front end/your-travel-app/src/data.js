// Centralized mock data handling
let dummyDestinations = JSON.parse(localStorage.getItem('dummyDestinations')) || [];
let dummyUsers = JSON.parse(localStorage.getItem('dummyUsers')) || [];

export const seedDatabase = () => {
    if (dummyDestinations.length === 0) {
        dummyDestinations = [
            { id: 'paris', name: 'Paris, France', category: 'European City, Romantic', picture: 'https://via.placeholder.com/300/007bff/FFFFFF?Text=Paris', averageRating: 4.5, info: 'The capital and most populous city of France, known for its iconic landmarks, romantic atmosphere, and rich culture.' },
            { id: 'tokyo', name: 'Tokyo, Japan', category: 'Asian City, Modern', picture: 'https://via.placeholder.com/300/28a745/FFFFFF?Text=Tokyo', averageRating: 4.2, info: 'A bustling metropolis known for its futuristic technology, vibrant pop culture, and ancient traditions.' },
            { id: 'machu-picchu', name: 'Machu Picchu, Peru', category: 'Historical Site, South America', picture: 'https://via.placeholder.com/300/dc3545/FFFFFF?Text=Machu+Picchu', averageRating: 4.8, info: 'An ancient Inca citadel set high in the Andes Mountains, above the Urubamba River valley.' },
            { id: 'bali', name: 'Bali, Indonesia', category: 'Island, Tropical, Relaxing', picture: 'https://via.placeholder.com/300/ffc107/FFFFFF?Text=Bali', averageRating: 4.9, info: 'A popular Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.' },
            { id: 'rome', name: 'Rome, Italy', category: 'European City, Historical', picture: 'https://via.placeholder.com/300/17a2b8/FFFFFF?Text=Rome', averageRating: 4.6, info: 'The capital city of Italy, a vast, complex display of historical and artistic splendor.' },
            { id: 'new-york-city', name: 'New York City, USA', category: 'North American City, Urban', picture: 'https://via.placeholder.com/300/6f42c1/FFFFFF?Text=New+York+City', averageRating: 4.3, info: 'A global hub of finance, fashion, art, and culture, famous for its skyscrapers like the Empire State Building.' },
            { id: 'sydney', name: 'Sydney, Australia', category: 'Oceanic City, Coastal', picture: 'https://via.placeholder.com/300/fd7e14/FFFFFF?Text=Sydney', averageRating: 4.4, info: 'Australia\'s largest city, known for its harbourfront Opera House, Bridge, and beautiful beaches.' },
            { id: 'cairo', name: 'Cairo, Egypt', category: 'African City, Historical', picture: 'https://via.placeholder.com/300/6610f2/FFFFFF?Text=Cairo', averageRating: 3.9, info: 'The capital of Egypt and the largest city in the Arab world, home to the Pyramids of Giza.' },
            { id: 'rio-de-janeiro', name: 'Rio de Janeiro, Brazil', category: 'South American City, Coastal', picture: 'https://via.placeholder.com/300/e83e8c/FFFFFF?Text=Rio', averageRating: 4.7, info: 'A sprawling Brazilian city known for its breathtaking landscapes, vibrant culture, and famous Carnival festival.' },
            { id: 'cape-town', name: 'Cape Town, South Africa', category: 'African City, Coastal', picture: 'https://via.placeholder.com/300/20c997/FFFFFF?Text=Cape+Town', averageRating: 4.6, info: 'A port city on South Africa’s southwest coast, known for its Table Mountain backdrop and stunning natural beauty.' },
            { id: 'london', name: 'London, UK', category: 'European City, Historical', picture: 'https://via.placeholder.com/300/a32a2a/FFFFFF?Text=London', averageRating: 4.5, info: 'Capital of England and the United Kingdom, a 21st-century city with history stretching back to Roman times.' },
            { id: 'berlin', name: 'Berlin, Germany', category: 'European City, Historical', picture: 'https://via.placeholder.com/300/6a0dad/FFFFFF?Text=Berlin', averageRating: 4.3, info: 'Germany\'s capital, famous for its significant history, vibrant arts scene, and modern landmarks.' },
            { id: 'dubai', name: 'Dubai, UAE', category: 'Middle Eastern City, Modern', picture: 'https://via.placeholder.com/300/ff69b4/FFFFFF?Text=Dubai', averageRating: 4.1, info: 'A city and emirate in the United Arab Emirates known for luxury shopping, ultramodern architecture and a lively nightlife scene.' },
            { id: 'barcelona', name: 'Barcelona, Spain', category: 'European City, Coastal', picture: 'https://via.placeholder.com/300/00bcd4/FFFFFF?Text=Barcelona', averageRating: 4.4, info: 'The cosmopolitan capital of Spain’s Catalonia region, known for its art and architecture.' },
            { id: 'amsterdam', name: 'Amsterdam, Netherlands', category: 'European City, Canal', picture: 'https://via.placeholder.com/300/ff5722/FFFFFF?Text=Amsterdam', averageRating: 4.3, info: 'Capital of the Netherlands, known for its artistic heritage, elaborate canal system and narrow houses.' },
            { id: 'prague', name: 'Prague, Czech Republic', category: 'European City, Historical', picture: 'https://via.placeholder.com/300/9e9e9e/FFFFFF?Text=Prague', averageRating: 4.7, info: 'Capital of the Czech Republic, nicknamed “the City of a Hundred Spires,” known for its Old Town Square.' },
            { id: 'vancouver', name: 'Vancouver, Canada', category: 'North American City, Coastal', picture: 'https://via.placeholder.com/300/4caf50/FFFFFF?Text=Vancouver', averageRating: 4.2, info: 'A bustling west coast seaport in British Columbia, known for its natural beauty and diverse cultural scene.' },
            { id: 'bangkok', name: 'Bangkok, Thailand', category: 'Asian City, Cultural', picture: 'https://via.placeholder.com/300/795548/FFFFFF?Text=Bangkok', averageRating: 4.0, info: 'Thailand\'s capital, a large city known for its ornate shrines and vibrant street life.' },
            { id: 'kyoto', name: 'Kyoto, Japan', category: 'Asian City, Historical', picture: 'https://via.placeholder.com/300/9c27b0/FFFFFF?Text=Kyoto', averageRating: 4.8, info: 'Former capital of Japan, famous for its numerous classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.' },
            { id: 'hanoi', name: 'Hanoi, Vietnam', category: 'Asian City, Cultural', picture: 'https://via.placeholder.com/300/ff9800/FFFFFF?Text=Hanoi', averageRating: 4.1, info: 'The capital of Vietnam, known for its centuries-old architecture and a rich culture with Southeast Asian, Chinese and French influences.' },
            { id: 'dublin', name: 'Dublin, Ireland', category: 'European City, Cultural', picture: 'https://via.placeholder.com/300/607d8b/FFFFFF?Text=Dublin', averageRating: 4.2, info: 'Capital of the Republic of Ireland, a vibrant city known for its rich history and literary heritage.' },
            { id: 'mexico-city', name: 'Mexico City, Mexico', category: 'North American City, Cultural', picture: 'https://via.placeholder.com/300/7cb342/FFFFFF?Text=Mexico+City', averageRating: 4.0, info: 'The high-altitude capital of Mexico, known for its Templo Mayor, majestic Palacio Nacional, and Metropolitan Cathedral.' },
            { id: 'buenos-aires', name: 'Buenos Aires, Argentina', category: 'South American City, Cultural', picture: 'https://via.placeholder.com/300/d81b60/FFFFFF?Text=Buenos+Aires', averageRating: 4.5, info: 'Argentina\'s sprawling capital, known for its European atmosphere, vibrant nightlife, and tango dancing.' },
            { id: 'reykjavik', name: 'Reykjavik, Iceland', category: 'European City, Nature', picture: 'https://via.placeholder.com/300/42a5f5/FFFFFF?Text=Reykjavik', averageRating: 4.7, info: 'Capital of Iceland, a coastal city known for its striking landscape, the Blue Lagoon geothermal spa, and the Northern Lights.' },
            { id: 'venice', name: 'Venice, Italy', category: 'European City, Romantic', picture: 'https://via.placeholder.com/300/ab47bc/FFFFFF?Text=Venice', averageRating: 4.6, info: 'A city in northeastern Italy sited on a group of 118 small islands separated by canals and linked by over 400 bridges.' },
            { id: 'seoul', name: 'Seoul, South Korea', category: 'Asian City, Modern', picture: 'https://via.placeholder.com/300/ef5350/FFFFFF?Text=Seoul', averageRating: 4.3, info: 'The capital of South Korea, a huge metropolis where modern skyscrapers, high-tech subways and pop culture meet Buddhist temples, palaces and street markets.' },
            { id: 'nairobi', name: 'Nairobi, Kenya', category: 'African City, Wildlife', picture: 'https://via.placeholder.com/300/004d40/FFFFFF?Text=Nairobi', averageRating: 3.8, info: 'The capital of Kenya, famous for the Nairobi National Park, a large game reserve known for breeding endangered black rhinos.' },
            { id: 'kuala-lumpur', name: 'Kuala Lumpur, Malaysia', category: 'Asian City, Modern', picture: 'https://via.placeholder.com/300/212121/FFFFFF?Text=KL', averageRating: 4.0, info: 'The capital of Malaysia, known for its Petronas Twin Towers, cultural diversity, and vibrant street food scene.' },
            { id: 'santorini', name: 'Santorini, Greece', category: 'European Island, Romantic', picture: 'https://via.placeholder.com/300/ffb74d/FFFFFF?Text=Santorini', averageRating: 4.9, info: 'A Cycladic island in the Aegean Sea, famous for its dramatic landscapes, whitewashed villages, and stunning sunsets.' },
            { id: 'quebec-city', name: 'Quebec City, Canada', category: 'North American City, Historical', picture: 'https://via.placeholder.com/300/5e35b1/FFFFFF?Text=Quebec', averageRating: 4.5, info: 'A predominantly French-speaking city in Canada’s Quebec province, known for its historic architecture and European feel.' }
        ];
        localStorage.setItem('dummyDestinations', JSON.stringify(dummyDestinations));
    }

    if (dummyUsers.length === 0) {
        dummyUsers = [
            { id: 'kuma', email: 'cajukiku@gmail.com', role: 'user', reviewCount: 5, name: 'Regular User' },
            { id: 'admin1', email: 'admin@yourtravel.com', role: 'admin', reviewCount: 10, name: 'Admin User' },
            { id: 'engineer1', email: 'engineer@yourtravel.com', role: 'engineer', reviewCount: 2, name: 'Engineer User' },
            { id: 'user2', email: 'jane.doe@example.com', role: 'user', reviewCount: 3, name: 'Jane Doe' },
            { id: 'user3', email: 'john.smith@example.com', role: 'user', reviewCount: 8, name: 'John Smith' },
            { id: 'user4', email: 'alice.w@example.com', role: 'user', reviewCount: 1, name: 'Alice Williams' },
        ];
        localStorage.setItem('dummyUsers', JSON.stringify(dummyUsers));
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

export const generateUniqueId = () => {
    return 'item-' + Math.random().toString(36).substr(2, 9);
};