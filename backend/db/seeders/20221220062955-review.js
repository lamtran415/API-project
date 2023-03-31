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
    options.tableName = "Reviews";
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 3,
        review: "I had an amazing time at this AirBnb spot! The host was incredibly welcoming and the place was spotless.",
        stars: 5
      },
      {
        spotId: 2,
        userId: 1,
        review: "This AirBnb spot was simply incredible! The host was so friendly and accommodating, and the space itself was absolutely stunning.",
        stars: 4
      },
      {
        spotId: 3,
        userId: 2,
        review: "Unfortunately, my stay at this AirBnb spot wasn't the best.",
        stars: 2
      },
      {
        spotId: 1,
        userId: 2,
        review: "The host went above and beyond to make sure my stay was perfect, and the space itself was stunning. I loved the cozy feel and the beautiful decor.",
        stars: 4
      },
      {
        spotId: 3,
        userId: 4,
        review: "While the host of this AirBnb spot was friendly, I was disappointed with my stay overall. The room was smaller than I expected and the smell was quite unpleasant.",
        stars: 1
      },
      {
        spotId: 4,
        userId: 5,
        review: "Staying at this spot was an incredible experience! The views were stunning and the amenities were top-notch.",
        stars: 5
      },
      {
        spotId: 5,
        userId: 3,
        review: "The host was very welcoming and accommodating, making our stay even more enjoyable.",
        stars: 5
      },
      {
        spotId: 6,
        userId: 1,
        review: "This spot was awesome, we had a great time here! The host was very friendly and gave us some great local tips.",
        stars: 4
      },
      {
        spotId: 7,
        userId: 2,
        review: "This spot smelled terrible and made our stay very unpleasant. The host was apologetic but couldn't do much to resolve the issue.",
        stars: 2
      },
      {
        spotId: 8,
        userId: 3,
        review: "OMG! Cool spot indeed! We loved every bit of our stay here - from the stylish decor to the comfortable bed.",
        stars: 4
      },
      {
        spotId: 9,
        userId: 4,
        review: "We couldn't handle the smell at this spot, it was just too overwhelming. The location was convenient and the amenities were good, but the odor was definitely a major drawback.",
        stars: 1
      },
      {
        spotId: 10,
        userId: 5,
        review: "Staying at this place was a magical experience! The host was very welcoming and went above and beyond to make sure we had everything we needed.",
        stars: 5
      },
      {
        spotId: 11,
        userId: 3,
        review: "This spot was huge and exceeded our expectations. The host was also very accommodating and made sure our stay was comfortable.",
        stars: 4
      },
      {
        spotId: 12,
        userId: 4,
        review: "This spot had a terrible smell that made our stay very unpleasant. The host tried their best to fix the issue but unfortunately, it didn't work out.",
        stars: 1
      },
      {
        spotId: 12,
        userId: 5,
        review: "The location was convenient and the amenities were good. We would definitely recommend this place to anyone!",
        stars: 5
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
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
