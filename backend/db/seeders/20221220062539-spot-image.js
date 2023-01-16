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
    options.tableName = "SpotImages";
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: "https://a0.muscache.com/im/pictures/c4c92198-fb3a-4c4b-bbb6-3aa8af8f7e73.jpg?im_w=720",
        preview: true
      },
      {
        spotId: 2,
        url: "https://a0.muscache.com/im/pictures/e52fcdad-aa5c-4ae6-b1fe-ba03bf0864d5.jpg?im_w=720",
        preview: true
      },
      {
        spotId: 3,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-44666241/original/0591ad1e-13fb-4a92-9cbc-142ef84da392.jpeg?im_w=720",
        preview: true
      },
      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/63a21006-5525-4932-88bf-5d5e51d6eb9b.jpg?im_w=720",
        preview: true
      },
      {
        spotId: 5,
        url: "https://a0.muscache.com/im/pictures/monet/Luxury-539689132812825418/original/bf858d88-c237-4901-8388-5b87859105ed?im_w=720",
        preview: true
      },
      {
        spotId: 6,
        url: "https://a0.muscache.com/im/pictures/443ca204-c46e-4a38-a7fa-60486a4c48a7.jpg?im_w=720",
        preview: true
      },
      {
        spotId: 7,
        url: "https://a0.muscache.com/im/pictures/15b61cc1-4d51-4e34-90f0-ffed225b9fd0.jpg?im_w=720",
        preview: true
      },
      {
        spotId: 8,
        url: "https://a0.muscache.com/im/pictures/941307ca-7cde-44ad-b643-05bfdea3977b.jpg?im_w=720",
        preview: true
      },
      {
        spotId: 9,
        url: "https://a0.muscache.com/im/pictures/e4774bc0-2ef1-4746-8c4d-30872fdb8c41.jpg?im_w=720",
        preview: true
      },
      {
        spotId: 10,
        url: "https://a0.muscache.com/im/pictures/80e91eef-3c7c-4ab4-b501-91c3450e52a1.jpg?im_w=720",
        preview: true
      },
      {
        spotId: 11,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-29671202/original/11bbd2ee-7cac-4218-878f-dc33ca33574c.jpeg?im_w=720",
        preview: true
      },
      {
        spotId: 12,
        url: "https://a0.muscache.com/im/pictures/3b8114cd-a1db-4122-bdb9-6fae6052b0c0.jpg?im_w=720",
        preview: true
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
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
