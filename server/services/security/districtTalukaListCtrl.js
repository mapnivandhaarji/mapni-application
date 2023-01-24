let districtTalukaListCtrl = {};
const districtTalukaListModel =
  new (require("../../common/model/districtTalukaListModel"))();
const talukaVillageListModel =
  new (require("../../common/model/talukaVillageListModel"))();
const HttpRespose = require("../../common/httpResponse");
const AppCode = require("../../common/constant/appCods");
const Logger = require("../../common/logger");
const bcrypt = require("bcryptjs");
const ObjectID = require("mongodb").ObjectId;
const CONFIG = require("../../config");
const nodemailer = require("nodemailer");
const _ = require("lodash");
const readXlsxFile = require("read-excel-file/node");

/* taluka List excel upload */
districtTalukaListCtrl.talukaExcelUpload = (req, res) => {
  const response = new HttpRespose();

  try {
    if (!!req.files.talukaExcelDocument) {
      req.body.talukaExcelDocument = req.files.talukaExcelDocument[0].filename;
    }
    console.log(req.files);
    // readXlsxFile('D:/GIT/MyNucleusApp_API/uploads/s1.xlsx').then((rows) => {
    readXlsxFile(req.files.talukaExcelDocument[0].path).then((rows) => {
      if (rows.length > 0) {
        let excelList = [];
        var lengthArray = rows.length;
        var bar = new Promise((resolve) => {
          rows.forEach(function (xslxData, index) {
            if (index > 0) {
              let excelData = {};
              excelData.districtName = xslxData[0];
              excelData.districtId = xslxData[1];
              excelData.talukaId = xslxData[2];
              excelData.talukaName = xslxData[3];
              excelList.push(excelData);
            } else {
              if (lengthArray === index + 1) {
                resolve();
              }
            }
          });

          districtTalukaListModel.createMany(excelList, function (err) {
            if (err) {
              response.setError(AppCode.InternalServerError);
              response.send(res);
            } else {
              response.setData(AppCode.Success);
              response.send(res);
            }
          });
        });
        bar.then(() => {
          console.log(excelList);
        });
      }
      //   console.log(rows)
    });
  } catch (exception) {
    console.log(exception);
    response.setError(AppCode.InternalServerError);
    response.send(res);
  }
};

/* village List excel upload */
districtTalukaListCtrl.villageExcelUpload = (req, res) => {
  const response = new HttpRespose();

  try {
    if (!!req.files.talukaExcelDocument) {
      req.body.talukaExcelDocument = req.files.talukaExcelDocument[0].filename;
    }
    console.log(req.files);
    // readXlsxFile('D:/GIT/MyNucleusApp_API/uploads/s1.xlsx').then((rows) => {
    readXlsxFile(req.files.talukaExcelDocument[0].path).then((rows) => {
      if (rows.length > 0) {
        let excelList = [];
        var lengthArray = rows.length;
        var bar = new Promise((resolve) => {
          rows.forEach(function (xslxData, index) {
            if (index > 0) {
              let excelData = {};
              excelData.districtName = xslxData[0];
              excelData.districtId = xslxData[1];
              excelData.talukaId = xslxData[2];
              excelData.talukaName = xslxData[3];
              excelData.villageName = xslxData[4]
                .split("</")[0]
                .split(">")[1]
                .split(" - ")[0];
              excelData.villageId = parseInt(
                xslxData[4].split("</")[0].split(">")[1].split(" - ")[1]
              );
              excelList.push(excelData);
            } else {
              if (lengthArray === index + 1) {
                resolve();
              }
            }
          });

          talukaVillageListModel.createMany(excelList, function (err) {
            if (err) {
              response.setError(AppCode.InternalServerError);
              response.send(res);
            } else {
              response.setData(AppCode.Success);
              response.send(res);
            }
          });
        });
        bar.then(() => {
          console.log(excelList);
        });
      }
      //   console.log(rows)
    });
  } catch (exception) {
    console.log(exception);
    response.setError(AppCode.InternalServerError);
    response.send(res);
  }
};

/* Taluka List */
districtTalukaListCtrl.talukaList = (req, res) => {
  const response = new HttpRespose();
  try {
    let query = [
      {
        $match: {},
      },
    ];
    districtTalukaListModel.advancedAggregate(query, {}, (err, talukaList) => {
      if (err) {
        throw err;
      } else if (_.isEmpty(talukaList)) {
        response.setError(AppCode.NotFound);
        response.send(res);
      } else {
        response.setData(AppCode.Success, talukaList);
        response.send(res);
      }
    });
  } catch (exception) {
    response.setError(AppCode.InternalServerError);
    response.send(res);
  }
};

/* Village List */
districtTalukaListCtrl.talukaWiseVillageList = (req, res) => {
  const response = new HttpRespose();
  try {
    let query = [
      {
        $match: {
          talukaId: parseInt(req.query.talukaId),
        },
      },
    ];
    talukaVillageListModel.advancedAggregate(query, {}, (err, villageList) => {
      if (err) {
        throw err;
      } else if (_.isEmpty(villageList)) {
        response.setError(AppCode.NotFound);
        response.send(res);
      } else {
        response.setData(AppCode.Success, villageList);
        response.send(res);
      }
    });
  } catch (exception) {
    response.setError(AppCode.InternalServerError);
    response.send(res);
  }
};

module.exports = districtTalukaListCtrl;