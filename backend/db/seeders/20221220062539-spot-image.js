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
        url: "https://image.cnbcfm.com/api/v1/image/106806952-1607317368576-DJI_0206-HDR-Edit.jpeg?v=1607318553&w=1920&h=1080",
        preview: true
      },
      {
        spotId: 2,
        url: "https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2018/12/Airbnb-Goa-Homes-Feature.jpg",
        preview: true
      },
      {
        spotId: 3,
        url: "https://homes-and-villas.marriott.com/mybookingpal/pictures/hes/hes/2969239540/3562070101.jpg?src=0Vxhslotkh8Z9+Ec5OX9X2EhdKb6OTvAmPgjeesJOpxI=",
        preview: true
      },
      {
        spotId: 4,
        url: "https://townsquare.media/site/463/files/2022/06/attachment-missouri-aquarium-house-feature.jpg",
        preview: true
      },
      {
        spotId: 5,
        url: "https://wallpaperaccess.com/full/1218437.jpg",
        preview: true
      },
      {
        spotId: 6,
        url: "https://cdn.gobankingrates.com/wp-content/uploads/2022/09/Captivas-Luxury-Estate-2.png",
        preview: true
      },
      {
        spotId: 7,
        url: "https://wintergardennew.com/dsc00588/",
        preview: true
      },
      {
        spotId: 8,
        url: "https://3.bp.blogspot.com/-fM0CtiewQNE/XEV62TkF1zI/AAAAAAAAElU/octXjc8Apu0PV-a9Gh_drIClV7vg884EgCHMYCw/s1600/top-10-costliest-and-most-luxurious-houses-in-the-world-listontap.jpg",
        preview: true
      },
      {
        spotId: 9,
        url: "https://wallpaperaccess.com/full/4430964.jpg",
        preview: true
      },
      {
        spotId: 10,
        url: "https://www.utopian-villas.com/wp-content/uploads/2021/06/The-Zion-Main-Photo.jpg",
        preview: true
      },
      {
        spotId: 11,
        url: "https://media.architecturaldigest.com/photos/609d20294f083a6a3932fa06/master/w_1920,h_1080,c_limit/DJI_0051.jpeg",
        preview: true
      },
      {
        spotId: 12,
        url: "https://manorretreats.com/wp-content/uploads/2022/08/slider_camelback_manor.jpg",
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
