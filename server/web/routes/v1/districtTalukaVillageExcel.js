const express = require("express");
const router = express.Router();

const districtTalukaListCtrl = require("../../../services/security/districtTalukaListCtrl");

const CONFIG = require("../../../config");

/**
 * @description
 * @example http://localhost:3001/v1/AdminMaster/'Route name'
 */

//taluka upload : http://localhost:3050/v1/districtTalukaVillageExcel/talukaExcelUpload
router
  .route("/talukaExcelUpload")
  .post(districtTalukaListCtrl.talukaExcelUpload);

//village Upload : http://localhost:3050/v1/districtTalukaVillageExcel/villageExcelUpload
router
  .route("/villageExcelUpload")
  .post(districtTalukaListCtrl.villageExcelUpload);

//taluka List data  : http://localhost:3050/v1/districtTalukaVillageExcel/talukaList
router.route("/talukaList").get(districtTalukaListCtrl.talukaList);

//taluka List data  : http://localhost:3050/v1/districtTalukaVillageExcel/uniqueTalukaList
router.route("/uniqueTalukaList").get(districtTalukaListCtrl.uniqueTalukaList);

//taluka List for assign person data  : http://localhost:3050/v1/districtTalukaVillageExcel/uniqueAssignTalukaList
router.route("/uniqueAssignTalukaList").get(districtTalukaListCtrl.uniqueAssignTalukaList);

//village List for assign person data  : http://localhost:3050/v1/districtTalukaVillageExcel/uniqueAssignVillageList
router.route("/uniqueAssignVillageList").get(districtTalukaListCtrl.uniqueAssignVillageList);

//taluka List data  : http://localhost:3050/v1/districtTalukaVillageExcel/uniqueVillageList
router.route("/uniqueVillageList").get(districtTalukaListCtrl.uniqueVillageList);

//Village List data  : http://localhost:3050/v1/districtTalukaVillageExcel/talukaWiseVillageList?talukaId=2
router
  .route("/talukaWiseVillageList")
  .get(districtTalukaListCtrl.talukaWiseVillageList);

module.exports = router;
