const express = require("express");
const router = express.Router();
const ApplicationMasterCtrl = require("../../../services/security/applicationMasterCtrl");
const uniqueCtrl = require("../../../services/security/uniqueCtrl");
const CONFIG = require("../../../config");
//const AuthCtrl = require("../../../services/security/authCtrl");

/**
 * @description Authentication routes
 * @example http://localhost:3000/v1/adminAuth/'Route name'
 */



//--------------------------------------------------Diyan Hr Updated Api----------------------------------------------------------------
//  save applicationMaster data : http://localhost:5001/v1/applicationMaster/applicationMasterCreate
router.route("/applicationMasterCreate").post(CONFIG.JWTTOKENALLOWACCESS, ApplicationMasterCtrl.applicationMasterCreate)

//Update applicationMaster data  : http://localhost:5001/v1/applicationMaster/applicationMasterUpdate
router.route("/applicationMasterUpdate").post(CONFIG.JWTTOKENALLOWACCESS, ApplicationMasterCtrl.applicationMasterUpdate);

// applicationMaster Details By Id data  : http://localhost:5001/v1/applicationMaster/applicationMasterDetailsById?_id=
router.route("/applicationMasterDetailsById").get(CONFIG.JWTTOKENALLOWACCESS, ApplicationMasterCtrl.applicationMasterDetailsById);

// applicationMaster List data  : http://localhost:5001/v1/applicationMaster/applicationMasterList
router.route("/applicationMasterList").get(CONFIG.JWTTOKENALLOWACCESS, ApplicationMasterCtrl.applicationMasterList);

// applicationMaster Active-Deactive data  : http://localhost:5001/v1/applicationMaster/applicationMasterActiveDeactive
router.route("/applicationMasterActiveDeactive").post(CONFIG.JWTTOKENALLOWACCESS, ApplicationMasterCtrl.applicationMasterActiveDeactive);



//-------------------------------------------------------------------------------------------------------------------------------------

// // Active applicationMaster List data  : http://localhost:5001/v1/applicationMaster/activeRoleList
// router.route("/activeRoleList").get(AdminAuthCtrl.activeRoleList);

//Get Active applicationMaster Data List API : http://localhost:5001/v1/applicationMaster/activeApplicationMasterList
router.route("/activeApplicationMasterList").get(CONFIG.JWTTOKENALLOWACCESS, ApplicationMasterCtrl.activeApplicationMasterList);



// applicationMaster delete details: http://localhost:5001/v1/applicationMaster/deleteApplicationMaster
router.route("/deleteApplicationMaster").post(CONFIG.JWTTOKENALLOWACCESS, ApplicationMasterCtrl.deleteApplicationMaster);


// Role API'S End



module.exports = router;
