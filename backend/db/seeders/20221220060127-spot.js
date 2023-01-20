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
        description: "This place is really cool",
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
        description: "This spot is really awesome",
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
        description: "This place has the vibes",
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
        name: "Sunset Spot",
        description: "This place is really cool",
        price: 123
      },
      {
        ownerId: 2,
        address: "149 Honey Creek Ave.",
        city: "Cleveland",
        state: "Ohio",
        country: "United States",
        lat: 34.7675358,
        lng: -110.4730327,
        name: "Austinville",
        description: "This spot is really awesome",
        price: 500
      },
      {
        ownerId: 3,
        address: "49 Garfield Ave",
        city: "Anchorage",
        state: "Alaska",
        country: "United States",
        lat: 67.1234358,
        lng: -105.1234327,
        name: "Philly Vibes",
        description: "This place has the vibes",
        price: 360
      },
      {
        ownerId: 1,
        address: "123 Hollywood Drive",
        city: "Saint Paul",
        state: "Minnesota",
        country: "United States",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Sunset Spot",
        description: "This place is really cool",
        price: 123
      },
      {
        ownerId: 2,
        address: "8441 Lafayette Court",
        city: "Anaheim",
        state: "Los Angeles",
        country: "United States",
        lat: 34.7675358,
        lng: -110.4730327,
        name: "Austinville",
        description: "This spot is really awesome",
        price: 500
      },
      {
        ownerId: 3,
        address: "317 Glen Eagles Drive",
        city: "Oklahoma City",
        state: "Oklahoma",
        country: "United States",
        lat: 67.1234358,
        lng: -105.1234327,
        name: "Philly Vibes",
        description: "This place has the vibes",
        price: 360
      },
      {
        ownerId: 1,
        address: "97 Rockaway St.",
        city: "Bridgeport",
        state: "Connecticut",
        country: "United States",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Sunset Spot",
        description: "This place is really cool",
        price: 123
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
        description: "This spot is really awesome",
        price: 500
      },
      {
        ownerId: 3,
        address: "91 St Paul Drive",
        city: "Vallejo",
        state: "California",
        country: "United States",
        lat: 67.1234358,
        lng: -105.1234327,
        name: "Philly Vibes",
        description: "This place has the vibes",
        price: 360
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
