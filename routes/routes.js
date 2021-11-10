const express = require('express');

const router  = express.Router(); 
const Controller = require('../controller/controller'); 
router.get('/team', Controller.checkAuth, Controller.getTeam); 
router.post('/team', Controller.checkAuth, Controller.updateTeam); 
router.get('/players', Controller.checkAuth, Controller.getPlayers); 
router.get('/healthcheck', Controller.checkAuth, Controller.homePage); 
router.post('/login', Controller.loginUser); 
router.get('/logout', Controller.logoutUser); 

module.exports = router; 
