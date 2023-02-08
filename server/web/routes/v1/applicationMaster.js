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

//application Upload : http://localhost:3050/v1/applicationMaster/applicationExcelUpload
router
  .route("/applicationExcelUpload")
  .post(ApplicationMasterCtrl.applicationExcelUpload);

//  save applicationMaster data : http://localhost:3050/v1/applicationMaster/applicationMasterCreate
router
  .route("/applicationMasterCreate")
  .post(
    CONFIG.JWTTOKENALLOWACCESS,
    ApplicationMasterCtrl.applicationMasterCreate
  );

//Update applicationMaster data  : http://localhost:3050/v1/applicationMaster/applicationMasterUpdate
router
  .route("/applicationMasterUpdate")
  .post(
    CONFIG.JWTTOKENALLOWACCESS,
    ApplicationMasterCtrl.applicationMasterUpdate
  );

// applicationMaster Details By Id data  : http://localhost:3050/v1/applicationMaster/applicationMasterDetailsById?_id=
router
  .route("/applicationMasterDetailsById")
  .get(
    CONFIG.JWTTOKENALLOWACCESS,
    ApplicationMasterCtrl.applicationMasterDetailsById
  );

// applicationMaster List data  : http://localhost:3050/v1/applicationMaster/applicationMasterList
router
  .route("/applicationMasterList")
  .get(CONFIG.JWTTOKENALLOWACCESS, ApplicationMasterCtrl.applicationMasterList);

// applicationMaster Active-Deactive data  : http://localhost:3050/v1/applicationMaster/applicationMasterActiveDeactive
router
  .route("/applicationMasterActiveDeactive")
  .post(
    CONFIG.JWTTOKENALLOWACCESS,
    ApplicationMasterCtrl.applicationMasterActiveDeactive
  );

//Get Active applicationMaster Data List API : http://localhost:3050/v1/applicationMaster/activeApplicationMasterList
router
  .route("/activeApplicationMasterList")
  .get(
    CONFIG.JWTTOKENALLOWACCESS,
    ApplicationMasterCtrl.activeApplicationMasterList
  );

// applicationMaster delete details: http://localhost:3050/v1/applicationMaster/deleteApplicationMaster
router
  .route("/deleteApplicationMaster")
  .post(
    CONFIG.JWTTOKENALLOWACCESS,
    ApplicationMasterCtrl.deleteApplicationMaster
  );

// applicationMaster delete details: http://localhost:3050/v1/applicationMaster/assignApplicationMaster
router
  .route("/assignApplicationMaster")
  .post(
    CONFIG.JWTTOKENALLOWACCESS,
    ApplicationMasterCtrl.assignApplicationMaster
  );

// applicationMaster delete details: http://localhost:3050/v1/applicationMaster/applicationMasterListforAssign
router
  .route("/applicationMasterListforAssign")
  .get(
    CONFIG.JWTTOKENALLOWACCESS,
    ApplicationMasterCtrl.applicationMasterListforAssign
  );

// applicationMaster delete details: http://localhost:3050/v1/applicationMaster/assignHistorybyApplicationId
router
  .route("/assignHistorybyApplicationId")
  .get(
    CONFIG.JWTTOKENALLOWACCESS,
    ApplicationMasterCtrl.assignHistorybyApplicationId
  );

  // applicationMaster delete details: http://localhost:3050/v1/applicationMaster/uniqueYearList
router
  .route("/uniqueYearList")
  .get(
    CONFIG.JWTTOKENALLOWACCESS,
    ApplicationMasterCtrl.uniqueYearList
  );

  // applicationMaster delete details: http://localhost:3050/v1/applicationMaster/applicationMasterCountforDashboard
router
  .route("/applicationMasterCountforDashboard")
  .get(
    CONFIG.JWTTOKENALLOWACCESS,
    ApplicationMasterCtrl.applicationMasterCountforDashboard
  );

module.exports = router;
