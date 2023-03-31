'use strict';

// /** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = "Spots";
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "545 Proctor Rd.",
        city: "San Francisco",
        state: "California",
        country: "United States",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Sunset Spot",
        description: "Located in San Francisco, this stunning property offers breathtaking views of the city skyline and the Pacific Ocean. Guests can enjoy the cool breeze while watching the sunset, creating an unforgettable experience. Its prime location offers convenient access to top-rated restaurants, shopping destinations, and popular tourist spots such as Golden Gate Park and Fisherman's Wharf. We provide modern furnishings, luxury amenities, and friendly staff ready to cater to every guest's needs.",
        price: 123
      },
      {
        ownerId: 2,
        address: "411 Edgewood Dr.",
        city: "Austin",
        state: "Texas",
        country: "United States",
        lat: 34.7675358,
        lng: -110.4730327,
        name: "Austinville",
        description: "This cozy house boasts an open floor plan, perfect for entertaining or relaxing with family and friends. Enjoy a fully equipped kitchen with stainless steel appliances and a cozy living room with a large flat-screen TV. The spacious bedrooms are furnished with comfortable beds and linens to ensure a good night's sleep. Take advantage of the outdoor patio and grill, perfect for enjoying a summer barbecue or a peaceful morning coffee.",
        price: 500
      },
      {
        ownerId: 3,
        address: "687 Manor Ave.",
        city: "Philadelphia",
        state: "Pennsylvania",
        country: "United States",
        lat: 67.1234358,
        lng: -105.1234327,
        name: "Philly Vibes",
        description: "This property offers a unique blend of urban and natural surroundings, providing guests with the best of both worlds. Located in Philadelphia, it's an excellent spot for those who love nature, as there are plenty of parks and green spaces nearby. The accommodations are stylish and comfortable, making it the perfect home away from home.The spacious bedrooms are furnished with comfortable beds and linens to ensure a good night's sleep.",
        price: 360
      },
      {
        ownerId: 1,
        address: "168 W. Galvin Street",
        city: "Knoxville",
        state: "Tennessee",
        country: "United States",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Knoxville Central",
        description: "This charming property in Knoxville boasts of modern decor and comfortable furnishings, making it the perfect home away from home for guests. The spacious living area offers plenty of room for relaxation and entertainment, while the fully equipped kitchen allows guests to prepare their own meals. The outdoor space is perfect for enjoying the weather, with a well-manicured lawn and a cozy patio area for outdoor dining. This spot is the perfect base for exploring all that Knoxville has to offer.",
        price: 110
      },
      {
        ownerId: 2,
        address: "149 Honey Creek Ave.",
        city: "Cleveland",
        state: "Ohio",
        country: "United States",
        lat: 34.7675358,
        lng: -110.4730327,
        name: "Cleveland Town",
        description: "This beautiful property in Cleveland boasts of modern and stylish interiors, providing a luxurious and relaxing stay for guests. With its spacious living areas and comfortable bedrooms, this spot can accommodate families or groups of friends. The property also features a fully-equipped kitchen, perfect for those who enjoy cooking and entertaining. Guests can enjoy the lovely backyard for some al fresco dining or just to soak in the beautiful surroundings.",
        price: 45
      },
      {
        ownerId: 3,
        address: "49 Garfield Ave",
        city: "Anchorage",
        state: "Alaska",
        country: "United States",
        lat: 67.1234358,
        lng: -105.1234327,
        name: "Anchorage Destination",
        description: "This charming property in Anchorage features a spacious living room with a cozy fireplace, perfect for snuggling up with a good book or enjoying a family movie night. The fully-equipped kitchen is perfect for preparing delicious meals, and the dining area provides a lovely space for enjoying them. The property also boasts a beautiful outdoor patio area, where guests can soak up the stunning natural surroundings while sipping their morning coffee or relaxing with a glass of wine in the evening.",
        price: 150
      },
      {
        ownerId: 1,
        address: "123 Hollywood Drive",
        city: "Saint Paul",
        state: "Minnesota",
        country: "United States",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Saint Paul Central",
        description: "This charming house in Saint Paul boasts of spacious and beautifully decorated interiors, making it the perfect accommodation for a relaxing and enjoyable stay. With its modern amenities and comfortable furnishings, guests can enjoy a comfortable stay in this lovely home. The property is stylishly furnished and well-maintained, providing guests with all the necessary amenities for a comfortable stay. Guests can explore the city's many attractions, including museums, art galleries, and theaters.",
        price: 55
      },
      {
        ownerId: 2,
        address: "8441 Lafayette Court",
        city: "Anaheim",
        state: "Los Angeles",
        country: "United States",
        lat: 34.7675358,
        lng: -110.4730327,
        name: "Anaheim Angels",
        description: "Located in Los Angeles, this property offers guests a luxurious and stylish stay in the heart of the city. The spacious and well-designed accommodations feature modern amenities and comfortable furnishings. Guests can enjoy the property's many amenities, including a pool, hot tub, and outdoor entertainment area. The property is also conveniently located near top attractions such as theme parks, museums, and galleries.",
        price: 200
      },
      {
        ownerId: 3,
        address: "317 Glen Eagles Drive",
        city: "Oklahoma City",
        state: "Oklahoma",
        country: "United States",
        lat: 67.1234358,
        lng: -105.1234327,
        name: "Oklahoma City Thunders",
        description: "This property in Oklahoma City boasts a spacious and modern design, offering guests a comfortable and stylish stay. The accommodations feature all the necessary amenities for a comfortable stay, including a fully-equipped kitchen and cozy living areas. Guests can also enjoy the property's outdoor space, including a patio and backyard. With its prime location in the heart of the city, guests can easily explore top attractions such as museums, theaters, and restaurants.",
        price: 85
      },
      {
        ownerId: 1,
        address: "97 Rockaway St.",
        city: "Bridgeport",
        state: "Connecticut",
        country: "United States",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Bridgerton",
        description: "Located in Bridgeport, this cozy and charming property offers guests a comfortable and peaceful retreat in the heart of the city. The accommodations feature all the necessary amenities for a comfortable stay, including a fully-equipped kitchen and cozy living areas. Guests can also enjoy the property's outdoor space, including a patio and backyard. With its prime location, guests can easily explore the city's many attractions, including museums, art galleries, and theaters.",
        price: 75
      },
      {
        ownerId: 2,
        address: "123 Vicente St",
        city: "Austin",
        state: "Texas",
        country: "United States",
        lat: 34.7675358,
        lng: -110.4730327,
        name: "Austinville",
        description: "Nestled in the heart of Austin, this house boasts a fully-equipped kitchen with state-of-the-art appliances, making it a great choice for those who enjoy cooking. The bedrooms are spacious and feature luxurious bedding, ensuring a good night's sleep. The living area is perfect for relaxation, with a comfortable couch and a large flat-screen TV. The property also offers a private patio where guests can enjoy their morning coffee or unwind in the evening.",
        price: 200
      },
      {
        ownerId: 3,
        address: "91 St Paul Drive",
        city: "Vallejo",
        state: "California",
        country: "United States",
        lat: 67.1234358,
        lng: -105.1234327,
        name: "Vallejo Valley",
        description: "This property in Vallejo boasts of stunning views and a peaceful ambiance, making it an ideal retreat for guests seeking a relaxing getaway. The house is well-furnished with modern amenities, including a fully-equipped kitchen, comfortable bedrooms, and a cozy living area with a fireplace. Guests can also enjoy the outdoor space, which includes a spacious deck and a lovely garden, perfect for al fresco dining and outdoor relaxation. The property offers easy access to local attractions.",
        price: 150
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
