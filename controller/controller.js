const { response } = require("express");
const allPlayers = require("../db/players.json");
const crypto = require("crypto");

let selectedPlayersResult = [];
const adminUser = {
  name: "Admin",
  password: "admin1234",
  session_id: null,
};
String.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var time = hours + ":" + minutes + ":" + seconds;
  return time;
};

const generate_session_key = function () {
  return crypto.randomBytes(16).toString("base64");
};
const homePage = (req, res, next) => {
  let time = process.uptime();
  res
    .status(200)
    .send({ message: "App is running", uptime: (time + "").toHHMMSS() });
};

const getTeam = (req, res, next) => {
  res.status(200).send({ message: "Selected Team", data: selectedPlayersResult });
};

const getPlayers = (req, res, next) => {
  allPlayers.forEach((item) => {
    selectedPlayersResult.forEach((inneritem) => {
      if (inneritem.selected) {
        if (inneritem.name == item.name) {
          item.selected = inneritem.selected;
        }
      }
    });
  });

  res
    .status(200)
    .send({
      message: "All Available Players",
      data: allPlayers,
      selectedPlayers: selectedPlayersResult,
    });
};

// Update Team with available players
const updateTeam = (req, res, next) => {
  let players = req.body.players;
  let selectedPlayers = players.filter((each) => each.selected);
  selectedPlayersResult = selectedPlayers;
  res.status(200).send({ message: "Selected Players", data: selectedPlayers });
};

const loginUser = (req, res, next) => {
  let data = req.body;
  console.log(data);
  if (data.user === adminUser.name && data.password === adminUser.password) {
    adminUser.session_id = generate_session_key();
    res.status(200).send({
      message: "You have logged in successfully",
      status: true,
      session_id: adminUser.session_id,
    });
  } else {
    res
      .status(401)
      .send({ message: "Incorrect username or password", status: false });
  }
};

const logoutUser = (req, res, next) => {
  adminUser.session_id = null;
  res.status(200).send({ message: "Logged out successfully", status: true });
};

const checkAuth = (req, res, next) => {
  console.log(req.headers);
  if (
    adminUser.session_id !== req.headers.session_id ||
    adminUser.session_id == null
  ) {
    res
      .status(401)
      .send({ message: "You are not authorized to view this page" });
  } else {
    next();
  }
};

module.exports = {
  getTeam,
  getPlayers,
  updateTeam,
  homePage,
  checkAuth,
  loginUser,
  logoutUser,
};
