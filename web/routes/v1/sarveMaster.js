const express = require("express");
const router = express.Router();
const SarveMasterCtrl = require("../../../services/security/sarveMasterCtrl");
const uniqueCtrl = require("../../../services/security/uniqueCtrl");
const CONFIG = require("../../../config");
//const AuthCtrl = require("../../../services/security/authCtrl");

/**
 * @description Authentication routes
 * @example http://localhost:3000/v1/adminAuth/'Route name'
 */



//  save sarveMaster data : http://localhost:3050/v1/sarveMaster/sarveMasterCreate
router.route("/sarveMasterCreate").post(CONFIG.JWTTOKENALLOWACCESS, SarveMasterCtrl.sarveMasterCreate)

//Update sarveMaster data  : http://localhost:3050/v1/sarveMaster/sarveMasterUpdate
router.route("/sarveMasterUpdate").post(CONFIG.JWTTOKENALLOWACCESS, SarveMasterCtrl.sarveMasterUpdate);

// sarveMaster Details By Id data  : http://localhost:3050/v1/sarveMaster/sarveMasterDetailsById?_id=
router.route("/sarveMasterDetailsById").get(CONFIG.JWTTOKENALLOWACCESS, SarveMasterCtrl.sarveMasterDetailsById);

// sarveMaster List data  : http://localhost:3050/v1/sarveMaster/sarveMasterList
router.route("/sarveMasterList").get(CONFIG.JWTTOKENALLOWACCESS, SarveMasterCtrl.sarveMasterList);

// sarveMaster Active-Deactive data  : http://localhost:3050/v1/sarveMaster/sarveMasterActiveDeactive
router.route("/sarveMasterActiveDeactive").post(CONFIG.JWTTOKENALLOWACCESS, SarveMasterCtrl.sarveMasterActiveDeactive);



//-------------------------------------------------------------------------------------------------------------------------------------

// // Active sarveMaster List data  : http://localhost:3050/v1/sarveMaster/activeRoleList
// router.route("/activeRoleList").get(AdminAuthCtrl.activeRoleList);

//Get Active sarveMaster Data List API : http://localhost:3050/v1/sarveMaster/activeSarveMasterList
router.route("/activeSarveMasterList").get(CONFIG.JWTTOKENALLOWACCESS, SarveMasterCtrl.activeSarveMasterList);



// sarveMaster delete details: http://localhost:3050/v1/sarveMaster/deleteSarveMaster
router.route("/deleteSarveMaster").post(CONFIG.JWTTOKENALLOWACCESS, SarveMasterCtrl.deleteSarveMaster);


// Role API'S End



module.exports = router;
