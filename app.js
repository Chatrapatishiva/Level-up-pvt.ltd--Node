const express = require("express");
const cors = require("cors");
const app = new express();
const routes = require("./routes/routes"); // import the routes
var path = require("path");
const avatar = require("random-avatar-generator");
let generator = new avatar.AvatarGenerator();
const allPlayers = require("./db/players.json");

require("dotenv").config(); //to access .env file
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes); //to use the routes

const boot = async () => {
  allPlayers.forEach((item) => {
    item.avtar = generator.generateRandomAvatar();
  });
  app.listen(PORT, () => {
    console.log(`App is running at port ${PORT}`);
  });
};

boot();
