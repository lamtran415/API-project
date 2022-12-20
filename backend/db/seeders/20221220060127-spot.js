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
        address: "123 Hollywood Drive",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
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
        country: "United States of America",
        lat: 34.7675358,
        lng: -110.4730327,
        name: "Austinville",
        description: "This spot is really awesome",
        price: 500
      },
      {
        ownerId: 3,
        address: "123 Judah St",
        city: "Philadelphia",
        state: "Pennsylvania",
        country: "United States of America",
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
