const express = require("express");
const router = express.Router();

const districtTalukaListCtrl = require("../../../services/security/districtTalukaListCtrl");

const CONFIG = require("../../../config");

/**
 * @description
 * @example http://localhost:3001/v1/AdminMaster/'Route name'
 */

//taluka upload : http://localhost:5001/v1/districtTalukaVillageExcel/talukaExcelUpload
router
  .route("/talukaExcelUpload")
  .post(districtTalukaListCtrl.talukaExcelUpload);

//village Upload : http://localhost:5001/v1/districtTalukaVillageExcel/villageExcelUpload
router
  .route("/villageExcelUpload")
  .post(districtTalukaListCtrl.villageExcelUpload);

//taluka List data  : http://localhost:5001/v1/applicationMaster/talukaList
router.route("/talukaList").get(districtTalukaListCtrl.talukaList);

//Village List data  : http://localhost:5001/v1/applicationMaster/talukaWiseVillageList?talukaId=2
router
  .route("/talukaWiseVillageList")
  .get(districtTalukaListCtrl.talukaWiseVillageList);

module.exports = router;