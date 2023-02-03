const express = require("express");
const router = express.Router();

const adminUserCtrl = require("../../../services/security/adminUserCtrl");

const CONFIG = require("../../../config");

/**
 * @description 
 * @example http://localhost:3001/v1/AdminMaster/'Route name'
 */ 

//User save Data : http://localhost:3050/v1/adminUser/usersaveData
router.route("/usersaveData").post(adminUserCtrl.usersaveData);

//AdminUser login : http://localhost:3050/v1/adminUser/login
router.route("/login").post(adminUserCtrl.login);




module.exports = router;