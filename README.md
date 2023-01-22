# ChillinBnb:

ChillinBnb is a web application inspired by the original Airbnb website, allows users to view, create, edit and leave a review for different spots.

Live Site: [ChillinBnb](https://chillin-bnb.onrender.com)

## Wiki Link
- [API Routes](https://github.com/lamtran415/ChillinBnb/wiki/API-Routes)
- [Database Schema](https://github.com/lamtran415/ChillinBnb/wiki/ChillinBnb-Database-Schema)
- [Features list](https://github.com/lamtran415/ChillinBnb/wiki/Features-List)
- [Redux Store State Shape](https://github.com/lamtran415/ChillinBnb/wiki/ChillinBnb-Store-Shape)

### Project built with:
- JavaScript
- Sequelize
- Express
- React
- Redux
- HTML/CSS
- PostgresSQL

## How to set up repo to run project locally
1) Clone [Chillinbnb's repo](https://github.com/lamtran415/ChillinBnb)
2) At the root directory, run npm install
3) Go into the backend directory and create a .env file with these added values
- PORT=8000
- DB_FILE=db/dev.db
- JWT_SECRET=«generate_strong_secret_here»
- JWT_EXPIRES_IN=604800
- SCHEMA=«custom_schema_name_here»
4) In backend, run these two commands to get the database set up
- npx dotenv sequelize-cli db:migrate
- npx dotenv sequelize-cli db:seed:all
5) Run npm start in both the backend directory and the frontend directory
6) Now you are ready to run ChillinBnb locally

## Log In
- Log in or click on Demo User to roam around the website and test the different features

![image](https://user-images.githubusercontent.com/114116854/213940933-feefade4-1d21-4138-afe8-c775c6afb2ca.png)

## Create a Spot
- Once logged in, you are able to create a new spot that will redirect you to the spot's page and show up on the home page

![image](https://user-images.githubusercontent.com/114116854/213940958-07f746a7-fb32-403c-927a-4f4e8f02416e.png)

## Create a Review
- Users may also leave a review for other user's spot

![image](https://user-images.githubusercontent.com/114116854/213940973-60375f0b-eed9-4d34-a2cb-26dfeb3a7521.png)

## To Do List for Future Features
- Edit Review
- Bookings


