let districtTalukaListCtrl = {};
const districtTalukaListModel =
  new (require("../../common/model/districtTalukaListModel"))();
const talukaVillageListModel =
  new (require("../../common/model/talukaVillageListModel"))();
  const ApplicationMasterModel =
  new (require("../../common/model/applicationMasterModel"))();
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
              excelData.villageIDS = parseInt(
                xslxData[4].split("</")[0].split(">")[1].split(" - ")[1]
              );
              excelData.villageId = index;
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

/*unique Taluka List */
districtTalukaListCtrl.uniqueTalukaList = (req, res) => {
  const response = new HttpRespose();
  try {
    let query = [
      {
        $match: {},
      },
      {
        $lookup: {
          from: "talukaList",
          as: "talukaListData",
          let: { taluka: "$taluka" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$talukaId", "$$taluka"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                districtName: 1,
                districtId: 1,
                talukaId: 1,
                talukaName: 1,
              },
            },
          ],
        }
      },
      {
        $unwind: {
          path: "$talukaListData",
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $group: {
          _id: {
            "taluka": "$talukaListData.talukaId"
          },
          districtName: {
            $first: "$talukaListData.districtName"
          },
          talukaName: {
            $first: "$talukaListData.talukaName"
          },
          districtId: {
            $first: "$talukaListData.districtId"
          },
          talukaId: {
            $first: "$talukaListData.talukaId"
          },
        }
      }
    ];
    ApplicationMasterModel.advancedAggregate(query, {}, (err, talukaList) => {
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

/*unique Village List */
districtTalukaListCtrl.uniqueVillageList = (req, res) => {
  const response = new HttpRespose();
  try {
    let query = [
      {
        $match: {
          taluka: parseInt(req.query.talukaId),
        },
      },
      {
        $lookup: {
          from: "villageList",
          as: "villageListData",
          let: {
            village: "$village",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$villageId", "$$village"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                villageName: 1,
                villageIDS: 1,
                villageId: 1,
                talukaName: 1,
                talukaId: 1,
                talukaName: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$villageListData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            village: "$villageListData.villageId",
          },
          villageName: {
            $first: "$villageListData.villageName",
          },
          villageId: {
            $first: "$villageListData.villageId",
          },
          villageIDS: {
            $first: "$villageListData.villageIDS",
          },
          talukaName: {
            $first: "$villageListData.talukaName",
          },
          talukaId: {
            $first: "$villageListData.talukaId",
          },
        },
      },
    ];
    ApplicationMasterModel.advancedAggregate(query, {}, (err, talukaList) => {
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
        let villageArrayList = [];
        villageList.filter((x) => {
          let Obj = {
            villageId: x.villageId,
            villageName: x.villageName,
            talukaName: x.talukaName,
            talukaId: x.talukaId,
            districtId: x.districtId,
            districtName: x.districtName,
            _id: x._id,
            villageShowName: x.villageName + "-" + x.villageIDS,
          };
          villageArrayList.push(Obj);
        });
        response.setData(AppCode.Success, villageArrayList);
        response.send(res);
      }
    });
  } catch (exception) {
    response.setError(AppCode.InternalServerError);
    response.send(res);
  }
};

module.exports = districtTalukaListCtrl;
