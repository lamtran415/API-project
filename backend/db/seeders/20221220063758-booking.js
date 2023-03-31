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
    options.tableName = "Bookings";
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        startDate: "2023-12-19",
        endDate: "2023-12-20"
      },
      {
        spotId: 2,
        userId: 3,
        startDate: "2023-12-25",
        endDate: "2023-12-26"
      },
      {
        spotId: 3,
        userId: 1,
        startDate: "2023-05-19",
        endDate: "2023-05-20"
      },
      {
        spotId: 12,
        userId: 2,
        startDate: "2022-12-19",
        endDate: "2022-12-20"
      },
      {
        spotId: 11,
        userId: 3,
        startDate: "2022-12-25",
        endDate: "2022-12-26"
      },
      {
        spotId: 9,
        userId: 1,
        startDate: "2022-05-19",
        endDate: "2022-05-20"
      },
      {
        spotId: 4,
        userId: 2,
        startDate: "2023-04-19",
        endDate: "2023-04-25"
      },
      {
        spotId: 5,
        userId: 3,
        startDate: "2023-05-25",
        endDate: "2023-05-29"
      },
      {
        spotId: 6,
        userId: 2,
        startDate: "2023-05-20",
        endDate: "2023-05-23"
      },
      {
        spotId: 7,
        userId: 3,
        startDate: "2023-06-26",
        endDate: "2023-06-29"
      },
      {
        spotId: 8,
        userId: 1,
        startDate: "2023-07-19",
        endDate: "2023-07-25"
      },
      {
        spotId: 9,
        userId: 2,
        startDate: "2023-10-19",
        endDate: "2023-10-25"
      },
      {
        spotId: 10,
        userId: 3,
        startDate: "2023-09-25",
        endDate: "2023-09-28"
      },
      {
        spotId: 11,
        userId: 5,
        startDate: "2023-06-19",
        endDate: "2023-06-20"
      },
      {
        spotId: 12,
        userId: 4,
        startDate: "2023-07-19",
        endDate: "2023-07-20"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 12, 11, 9] }
    }, {});
  }
};
