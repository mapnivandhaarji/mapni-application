let applicationMasterCtrl = {};
const AdminUserModel = new (require("../../common/model/adminUserModel"))();
const ApplicationMasterModel =
  new (require("../../common/model/applicationMasterModel"))();
const districtTalukaListModel =
  new (require("../../common/model/districtTalukaListModel"))();
const talukaVillageListModel =
  new (require("../../common/model/talukaVillageListModel"))();
const AssignModel = new (require("../../common/model/assignModel"))();
const HttpRespose = require("../../common/httpResponse");
const AppCode = require("../../common/constant/appCods");
const Logger = require("../../common/logger");
const bcrypt = require("bcryptjs");
const blacklist = require("express-jwt-blacklist");
const ObjectID = require("mongodb").ObjectID;
const async = require("async");
const moment = require("moment");
const CONFIG = require("../../config");
const readXlsxFile = require("read-excel-file/node");

const _ = require("lodash");

applicationMasterCtrl.applicationExcelUpload = (req, res) => {
  const response = new HttpRespose();

  try {
    if (!!req.files.applicationExcelUpload) {
      req.body.applicationExcelUpload =
        req.files.applicationExcelUpload[0].filename;
    }
    // readXlsxFile('D:/GIT/MyNucleusApp_API/uploads/s1.xlsx').then((rows) => {
    readXlsxFile(req.files.applicationExcelUpload[0].path).then((rows) => {
      if (rows.length > 0) {
        let excelList = [];
        var lengthArray = rows.length;
        var bar = new Promise((resolve) => {
          rows.forEach(function (xslxData, index) {

            if (index > 0) {
              try {

                let query = [
                  {
                    $match: {
                      $and: [
                        {
                          talukaId: parseInt(req.body.taluka),
                        },
                        {
                          villageName: xslxData[7].toString().trim()
                        }
                      ]
                    },
                  },
                ]
                talukaVillageListModel.advancedAggregate(
                  query,
                  {},
                  (err, villageList) => {
                    if (err) {
                      throw err;
                    } else if (_.isEmpty(villageList)) {
                      response.setError(AppCode.NotFound);
                      response.send(res);
                    } else {
                      console.log(xslxData);
                      let excelData = {};
                      excelData.MTRno = xslxData[0].toString();
                      excelData.applicantName = xslxData[1];
                      excelData.applicantMobileNo =
                        xslxData[2] == null ? "" : xslxData[2].toString();
                      excelData.applicantAddress =
                        xslxData[3] == null ? "" : xslxData[3].toString();
                      excelData.district = 8;
                      excelData.taluka = parseInt(req.body.taluka);
                      excelData.village = villageList[0].villageId;
                      excelData.applicationFullDate =
                        moment(new Date(xslxData[4])).format("yyyy-MM-DDThh:mm:ss") +
                        "Z";
                      excelData.applicationYear = new Date(xslxData[4])
                        .getFullYear()
                        .toString();
                      excelData.applicationMonth = (
                        new Date(xslxData[4]).getMonth() + 1
                      ).toString();
                      excelData.applicationDate = new Date(xslxData[4])
                        .getDate()
                        .toString();
                      excelData.oldServeNo =
                        xslxData[5] == null ? "" : xslxData[5].toString();
                      excelData.newServeNo =
                        xslxData[6] == null ? "" : xslxData[6].toString();
                      excelData.isAssign = false;
                      excelData.isCompleted = 3;
                      excelData.createdAt = new Date();
                      excelData.status = 1;

                      excelList.push(excelData);
                    }

                    if (lengthArray === index + 1) {
                      async.waterfall(
                        [
                          function (callback) {
                            ApplicationMasterModel.createMany(excelList, function (err) {
                              if (err) {
                                response.setError(AppCode.InternalServerError);
                                response.send(res);
                                callback()
                              } else {
                                response.setData(AppCode.Success);
                                response.send(res);
                                callback()
                              }
                            });
                          }
                        ])

                      bar.then(() => {
                        console.log(excelList);
                      });
                    }
                  }
                );


              } catch (exception) {
                response.setError(AppCode.InternalServerError);
                response.send(res);
              }
            }
          });


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

// applicationMasterCtrl.applicationExcelUpload = (req, res) => {
//   const response = new HttpRespose();

//   try {
//     if (!!req.files.applicationExcelUpload) {
//       req.body.applicationExcelUpload =
//         req.files.applicationExcelUpload[0].filename;
//     }

//     readXlsxFile(req.files.applicationExcelUpload[0].path).then((rows) => {
//       if (rows.length > 0) {
//         let excelList = [];
//         var lengthArray = rows.length;
//         var bar = new Promise((resolve) => {
//           rows.forEach(function (xslxData, index) {
//             if (index > 0) {
//               console.log(xslxData);
//               let excelData = {};
//               excelData.MTRno = xslxData[0].toString();
//               excelData.applicantName = xslxData[1];
//               excelData.applicantMobileNo =
//                 xslxData[2] == null ? "" : xslxData[2].toString();
//               excelData.applicantAddress =
//                 xslxData[3] == null ? "" : xslxData[3].toString();
//               excelData.district = 8;
//               excelData.taluka = parseInt(req.body.taluka);
//               excelData.village = parseInt(req.body.village);
//               excelData.applicationFullDate =
//                 moment(new Date(xslxData[4])).format("yyyy-MM-DDThh:mm:ss") +
//                 "Z";
//               excelData.applicationYear = new Date(xslxData[4])
//                 .getFullYear()
//                 .toString();
//               excelData.applicationMonth = (
//                 new Date(xslxData[4]).getMonth() + 1
//               ).toString();
//               excelData.applicationDate = new Date(xslxData[4])
//                 .getDate()
//                 .toString();
//               excelData.oldServeNo =
//                 xslxData[5] == null ? "" : xslxData[5].toString();
//               excelData.newServeNo =
//                 xslxData[6] == null ? "" : xslxData[6].toString();
//               excelData.isAssign = false;
//               excelData.isCompleted = 3;
//               excelData.createdAt = new Date();
//               excelData.status = 1;
//               excelList.push(excelData);
//             } else {
//               if (lengthArray === index + 1) {
//                 resolve();
//               }
//             }
//           });

//           ApplicationMasterModel.createMany(excelList, function (err) {
//             if (err) {
//               response.setError(AppCode.InternalServerError);
//               response.send(res);
//             } else {
//               response.setData(AppCode.Success);
//               response.send(res);
//             }
//           });
//         });
//         bar.then(() => {
//           console.log(excelList);
//         });
//       }
//       //   console.log(rows)
//     });


//   } catch (exception) {
//     console.log(exception);
//     response.setError(AppCode.InternalServerError);
//     response.send(res);
//   }
// };

/* applicationMaster Create */
applicationMasterCtrl.applicationMasterCreate = (req, res) => {
  var response = new HttpRespose();
  var data = req.body;
  data.isAssign = false;
  data.isCompleted = 3;
  // let query = {
  //   applicantMobileNo: data.applicantMobileNo,
  // };

  ApplicationMasterModel.create(data, (err, applicationMaster) => {
    if (err) {
      console.log(err);
      response.setError(AppCode.Fail);
      response.send(res);
    } else {
      response.setData(AppCode.Success, applicationMaster);
      response.send(res);
    }
  });

  // ApplicationMasterModel.findOne(query, {}, (err, applicationMaster) => {
  //   if (err) {
  //     console.log(err);
  //     response.setError(AppCode.Fail);
  //     response.send(res);
  //   } else if (applicationMaster !== null) {
  //     response.setError(AppCode.AllreadyExist);
  //     response.send(res);
  //   } else {

  //   }
  // });
};

/* applicationMaster Active-Deactive */
applicationMasterCtrl.applicationMasterActiveDeactive = (req, res) => {
  const response = new HttpRespose();
  let query = { _id: ObjectID(req.body._id) };
  ApplicationMasterModel.updateOne(
    query,
    { $set: { status: req.body.status } },
    function (err, applicationMaster) {
      if (err) {
        AppCode.Fail.error = err.message;
        response.setError(AppCode.Fail);
        response.send(res);
      } else {
        response.setData(AppCode.Success);
        response.send(res);
      }
    }
  );
};

/* applicationMaster Details By Id*/
applicationMasterCtrl.applicationMasterDetailsById = (req, res) => {
  const response = new HttpRespose();
  try {
    let query = [
      {
        $match: {
          _id: ObjectID(req.query._id),
        },
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
                talukaName: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$talukaListData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "villageList",
          as: "villageListData",
          let: { village: "$village" },
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
        $project: {
          _id: 1,
          applicantName: 1,
          applicantMobileNo: 1,
          applicantAddress: 1,
          district: 1,
          taluka: 1,
          village: 1,
          applicationFullDate: 1,
          applicationYear: 1,
          applicationMonth: 1,
          applicationDate: 1,
          newServeNo: 1,
          oldServeNo: 1,
          MTRno: 1,
          talukaName: "$talukaListData.talukaName",
          villageName: "$villageListData.villageName",
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];
    ApplicationMasterModel.advancedAggregate(
      query,
      {},
      (err, applicationMaster) => {
        if (err) {
          throw err;
        } else if (_.isEmpty(applicationMaster)) {
          response.setError(AppCode.NotFound);
          response.send(res);
        } else {
          response.setData(AppCode.Success, applicationMaster[0]);
          response.send(res);
        }
      }
    );
  } catch (exception) {
    response.setError(AppCode.InternalServerError);
    response.send(res);
  }
};

/* ApplicationMaster List */
applicationMasterCtrl.applicationMasterList = (req, res) => {
  const response = new HttpRespose();
  try {
    let condition = {};
    condition["$and"] = [];

    condition["$and"].push({
      status: 1,
    });

    condition["$and"].push({
      isCompleted: 3,
    });

    if (req.query.isAssign) {
      condition["$and"].push({
        isAssign: false,
      });
    }

    if (!!req.query.taluka && req.query.taluka != "null") {
      condition["$and"].push({
        taluka: parseInt(req.query.taluka),
      });
    }
    if (!!req.query.applicationYear && req.query.applicationYear != "null") {
      condition["$and"].push({
        applicationYear: req.query.applicationYear,
      });
    }
    console.log("condition", condition);
    let query = [
      {
        $match: condition,
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
                talukaName: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$talukaListData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "villageList",
          as: "villageListData",
          let: { village: "$village" },
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
        $project: {
          _id: 1,
          applicantName: 1,
          applicantMobileNo: 1,
          applicantAddress: 1,
          district: 1,
          taluka: 1,
          village: 1,
          applicationFullDate: 1,
          applicationYear: 1,
          applicationMonth: 1,
          applicationDate: 1,
          newServeNo: 1,
          oldServeNo: 1,
          MTRno: 1,
          isAssign: 1,
          talukaName: "$talukaListData.talukaName",
          villageName: "$villageListData.villageName",
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];
    ApplicationMasterModel.advancedAggregate(
      query,
      {},
      (err, applicationMaster) => {
        if (err) {
          throw err;
        } else if (_.isEmpty(applicationMaster)) {
          response.setError(AppCode.NotFound);
          response.send(res);
        } else {
          response.setData(AppCode.Success, applicationMaster);
          response.send(res);
        }
      }
    );
  } catch (exception) {
    response.setError(AppCode.InternalServerError);
    response.send(res);
  }
};

/* Active applicationMaster List */
applicationMasterCtrl.activeApplicationMasterList = (req, res) => {
  const response = new HttpRespose();
  try {
    let query = [
      {
        $match: {
          status: 1,
        },
      },
      {
        $project: {
          _id: 1,
          applicantName: 1,
          applicantMobileNo: 1,
          applicantAddress: 1,
          district: 1,
          taluka: 1,
          village: 1,
          applicationFullDate: 1,
          applicationYear: 1,
          applicationMonth: 1,
          applicationDate: 1,
          newServeNo: 1,
          oldServeNo: 1,
          MTRno: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];
    ApplicationMasterModel.advancedAggregate(
      query,
      {},
      (err, applicationMaster) => {
        if (err) {
          throw err;
        } else if (_.isEmpty(applicationMaster)) {
          response.setError(AppCode.NotFound);
          response.send(res);
        } else {
          response.setData(AppCode.Success, applicationMaster);
          response.send(res);
        }
      }
    );
  } catch (exception) {
    response.setError(AppCode.InternalServerError);
    response.send(res);
  }
};

/* applicationMaster Update*/
applicationMasterCtrl.applicationMasterUpdate = (req, res) => {
  var response = new HttpRespose();
  var _id = ObjectID(req.body._id);
  let bodydata = req.body;
  if (!!req.body) {
    try {
      let query = { _id: _id };
      delete bodydata._id;
      ApplicationMasterModel.findOne(query, function (err, applicationMaster) {
        if (err) {
          console.log("err", err);
          response.setError(AppCode.Fail);
          response.send(res);
        } else {
          if (applicationMaster === null) {
            response.setError(AppCode.NotFound);
            response.send(res);
          } else {
            ApplicationMasterModel.update(
              query,
              bodydata,
              function (err, applicationMaster) {
                if (err) {
                  console.log(err);
                  response.setError(AppCode.Fail);
                  response.send(res);
                } else if (
                  applicationMaster == undefined ||
                  (applicationMaster.matchedCount === 0 &&
                    applicationMaster.modifiedCount === 0)
                ) {
                  response.setError(AppCode.NotFound);
                } else {
                  response.setData(AppCode.Success, req.body);
                  response.send(res);
                }
              }
            );
          }
        }
      });
    } catch (exception) {
      response.setError(AppCode.Fail);
      response.send(res);
    }
  } else {
    AppCode.Fail.error = "Oops! something went wrong, please try again later";
    response.setError(AppCode.Fail);
    response.send(res);
  }
};

/* applicationMaster Delete*/
applicationMasterCtrl.deleteApplicationMaster = (req, res) => {
  const response = new HttpRespose();
  const data = req.body;
  const query = {
    _id: ObjectID(data._id),
  };
  ApplicationMasterModel.findOne(query, function (err, applicationMaster) {
    if (err) {
      AppCode.Fail.error = err.message;
      response.setError(AppCode.Fail);
      response.send(res);
    } else {
      if (applicationMaster == null) {
        AppCode.Fail.error = "No record found";
        response.setError(AppCode.Fail);
        response.send(res);
      } else {
        ApplicationMasterModel.remove(query, function (err, applicationMaster) {
          if (err) {
            AppCode.Fail.error = err.message;
            response.setError(AppCode.Fail);
            response.send(res);
          } else if (
            applicationMaster == undefined ||
            applicationMaster.deletedCount === 0
          ) {
            AppCode.Fail.error = "No record found";
            response.setError(AppCode.Fail);
            response.send(res);
          } else {
            response.setData(AppCode.Success);
            response.send(res);
          }
        });
      }
    }
  });
};

/* applicationMaster Assign*/
applicationMasterCtrl.assignApplicationMaster = (req, res) => {
  const response = new HttpRespose();
  const data = req.body;
  if (!!data.sarveId) {
    data.sarveId = ObjectID(data.sarveId);
  }
  try {
    data.applicationId.forEach((applicationId, index) => {
      let obj = {
        sarveId: data.sarveId,
        applicationId: ObjectID(applicationId),
        assignDate: data.assignDate,
        isSubmitted: false,
        isCompleted: 3,
      };
      let query = { _id: ObjectID(applicationId) };
      console.log("id query application", query);
      ApplicationMasterModel.updateOne(
        query,
        { $set: { isAssign: data.isAssign } },
        function (err, applicationMaster) {
          if (err) {
            console.log(err);
            // response.setError(AppCode.Fail);
            // response.send(res);
          } else {
            let query1 = {
              applicationId: ObjectID(applicationId),
              isSubmitted: false,
            };
            AssignModel.findOne(query1, {}, (err, assign) => {
              if (err) {
                console.log(err);
              } else {
                if (assign !== null) {
                  console.log("submitted data");
                  let obj1 = {
                    submittedby: data.sarveId,
                    submittedDate: data.assignDate,
                    isSubmitted: true,
                  };
                  AssignModel.update(
                    { _id: ObjectID(assign._id) },
                    obj1,
                    function (err, applicationMaster) {
                      if (err) {
                        console.log(err);
                      }
                    }
                  );
                }
                AssignModel.create(obj, (err, assignApplication) => {
                  if (err) {
                    console.log(err);
                    response.setError(AppCode.Fail);
                    response.send(res);
                  } else {
                    if (data.applicationId.length - 1 == index) {
                      response.setData(AppCode.Success);
                      response.send(res);
                    }
                  }
                });
              }
            });
          }
        }
      );
    });
  } catch (exception) {
    response.setError(AppCode.InternalServerError);
    response.send(res);
  }
};

const getApplicationList = (taluka, applicationYear) => {
  const promise = new Promise((resolve, reject) => {
    let condition = {};
    if (taluka != "" || applicationYear != "") {
      condition["$and"] = [];
    }
    if (taluka != "") {
      condition["$and"].push({
        taluka: parseInt(taluka),
      });
    }
    if (applicationYear != "") {
      condition["$and"].push({
        applicationYear: applicationYear,
      });
    }
    let query = [
      {
        $match: condition,
      },
      {
        $project: {
          _id: 1,
        },
      },
    ];
    ApplicationMasterModel.advancedAggregate(
      query,
      {},
      (err, applicationData) => {
        if (err) {
          return reject(err);
        }
        return resolve(applicationData);
      }
    );
  });

  return promise;
};

/* ApplicationMaster List */
applicationMasterCtrl.applicationMasterListforAssign = (req, res) => {
  const response = new HttpRespose();
  try {
    let taluka = "";
    let applicationYear = "";
    if (!!req.query.taluka && req.query.taluka != "null") {
      taluka = req.query.taluka;
    }
    if (!!req.query.applicationYear && req.query.applicationYear != "null") {
      applicationYear = req.query.applicationYear;
    }
    let applicationList = [];
    getApplicationList(taluka, applicationYear).then((applicationData) => {
      if (applicationData.length > 0) {
        _.forEach(applicationData, (applicationId) => {
          applicationList.push(ObjectID(applicationId._id));
        });
      }

      let condition = {};
      condition["$and"] = [];
      condition["$and"].push({
        isSubmitted: false,
      });
      condition["$and"].push({
        isCompleted: 3,
      });
      condition["$and"].push({
        applicationId: { $in: applicationList },
      });

      if (!!req.query.sarveId && req.query.sarveId != "null") {
        condition["$and"].push({
          sarveId: ObjectID(req.query.sarveId),
        });
      }
      console.log("applicationData", applicationList);
      console.log("condition", condition);
      let query = [
        {
          $match: condition,
        },
        {
          $lookup: {
            from: "applicationMaster",
            as: "applicationMasterData",
            let: { applicationId: "$applicationId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$applicationId"],
                  },
                },
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
                        talukaName: 1,
                      },
                    },
                  ],
                },
              },
              {
                $unwind: {
                  path: "$talukaListData",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "villageList",
                  as: "villageListData",
                  let: { village: "$village" },
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
                $project: {
                  _id: 1,
                  applicantName: 1,
                  applicantMobileNo: 1,
                  applicantAddress: 1,
                  district: 1,
                  taluka: 1,
                  village: 1,
                  applicationFullDate: 1,
                  applicationYear: 1,
                  applicationMonth: 1,
                  applicationDate: 1,
                  newServeNo: 1,
                  oldServeNo: 1,
                  MTRno: 1,
                  talukaName: "$talukaListData.talukaName",
                  villageName: "$villageListData.villageName",
                  isAssign: 1,
                  sarveId: 1,
                  sarveName: "$sarveMasterData.name",
                  status: 1,
                  createdAt: 1,
                  updatedAt: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$applicationMasterData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "sarveMaster",
            as: "sarveMasterData",
            let: { sarveId: "$sarveId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$sarveId"],
                  },
                },
              },

              {
                $project: {
                  _id: 1,
                  name: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$sarveMasterData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            applicationId: "$applicationMasterData._id",
            applicantName: "$applicationMasterData.applicantName",
            applicantMobileNo: "$applicationMasterData.applicantMobileNo",
            applicantAddress: "$applicationMasterData.applicantAddress",
            district: "$applicationMasterData.district",
            taluka: "$applicationMasterData.taluka",
            village: "$applicationMasterData.village",
            applicationFullDate: "$applicationMasterData.applicationFullDate",
            applicationYear: "$applicationMasterData.applicationYear",
            applicationMonth: "$applicationMasterData.applicationMonth",
            applicationDate: "$applicationMasterData.applicationDate",
            newServeNo: "$applicationMasterData.newServeNo",
            oldServeNo: "$applicationMasterData.oldServeNo",
            MTRno: "$applicationMasterData.MTRno",
            talukaName: "$applicationMasterData.talukaName",
            villageName: "$applicationMasterData.villageName",
            isAssign: "$applicationMasterData.isAssign",
            sarveId: 1,
            sarveName: "$sarveMasterData.name",
            status: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ];
      AssignModel.advancedAggregate(query, {}, (err, applicationMaster) => {
        if (err) {
          throw err;
        } else if (_.isEmpty(applicationMaster)) {
          response.setError(AppCode.NotFound);
          response.send(res);
        } else {
          response.setData(AppCode.Success, applicationMaster);
          response.send(res);
        }
      });
    });
  } catch (exception) {
    response.setError(AppCode.InternalServerError);
    response.send(res);
  }
};

/* Application Assign History List */
applicationMasterCtrl.assignHistorybyApplicationId = (req, res) => {
  const response = new HttpRespose();
  try {
    let query = [
      {
        $match: {
          applicationId: ObjectID(req.query.applicationId),
        },
      },
      {
        $lookup: {
          from: "sarveMaster",
          as: "sarveMasterData",
          let: { sarveId: "$sarveId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$sarveId"],
                },
              },
            },

            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$sarveMasterData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "sarveMaster",
          as: "submittedbyData",
          let: { submittedby: "$submittedby" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$submittedby"],
                },
              },
            },

            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$submittedbyData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          sarveId: 1,
          sarveName: "$sarveMasterData.name",
          applicationId: 1,
          assignDate: 1,
          isSubmitted: 1,
          submittedDate: 1,
          submittedby: 1,
          submittedbyName: "$submittedbyData.name",
          isCompleted: 1,
        },
      },
    ];
    AssignModel.advancedAggregate(query, {}, (err, Assign) => {
      if (err) {
        throw err;
      } else if (_.isEmpty(Assign)) {
        response.setError(AppCode.NotFound);
        response.send(res);
      } else {
        response.setData(AppCode.Success, Assign);
        response.send(res);
      }
    });
  } catch (exception) {
    response.setError(AppCode.InternalServerError);
    response.send(res);
  }
};

/*unique Year List */
applicationMasterCtrl.uniqueYearList = (req, res) => {
  const response = new HttpRespose();
  try {
    let condition = {};
    condition["$and"] = [];

    condition["$and"].push({
      status: 1,
    });

    condition["$and"].push({
      isCompleted: 3,
    });

    if (req.query.isAssign) {
      condition["$and"].push({
        isAssign: false,
      });
    }

    let query = [
      {
        $match: condition,
      },
      {
        $group: {
          _id: {
            applicationYear: "$applicationYear",
          },
          applicationYear: {
            $first: "$applicationYear",
          },
        },
      },
      {
        $sort: {
          applicationYear: 1,
        },
      },
    ];
    ApplicationMasterModel.advancedAggregate(
      query,
      {},
      (err, uniqueYearList) => {
        if (err) {
          throw err;
        } else if (_.isEmpty(uniqueYearList)) {
          response.setError(AppCode.NotFound);
          response.send(res);
        } else {
          response.setData(AppCode.Success, uniqueYearList);
          response.send(res);
        }
      }
    );
  } catch (exception) {
    response.setError(AppCode.InternalServerError);
    response.send(res);
  }
};

/*unique Year List */
applicationMasterCtrl.uniqueYearListForAssignPerson = (req, res) => {
  const response = new HttpRespose();
  try {

    let query = [
      {
        $match: {
          $and: [
            {
              sarveId: ObjectID(
                req.query.sarveId
              ),
            },
            {
              isSubmitted: false,
            },
            {
              isCompleted: 3,
            },
          ],
        },
      },
      {
        $lookup: {
          from: "applicationMaster",
          as: "applicationData",
          let: {
            applicationId: "$applicationId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$applicationId"],
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$applicationData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$applicationData.applicationYear",
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
          },
          year: {
            $first: "$year",
          },
        },
      },
    ];
    AssignModel.advancedAggregate(
      query,
      {},
      (err, uniqueYearList) => {
        if (err) {
          throw err;
        } else if (_.isEmpty(uniqueYearList)) {
          response.setError(AppCode.NotFound);
          response.send(res);
        } else {
          response.setData(AppCode.Success, uniqueYearList);
          response.send(res);
        }
      }
    );
  } catch (exception) {
    response.setError(AppCode.InternalServerError);
    response.send(res);
  }
};

/* ApplicationMaster List */
applicationMasterCtrl.applicationMasterCountforDashboard = (req, res) => {
  const response = new HttpRespose();
  try {
    let query = [
      {
        $match: {
          isSubmitted: false,
          isCompleted: 3
        },
      },
      {
        $lookup: {
          from: "applicationMaster",
          as: "applicationMasterData",
          let: {
            applicationId: "$applicationId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$applicationId"],
                },
              },
            },
            {
              $lookup: {
                from: "talukaList",
                as: "talukaListData",
                let: {
                  taluka: "$taluka",
                },
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
                      talukaName: 1,
                      districtName: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$talukaListData",
                preserveNullAndEmptyArrays: true,
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
          ],
        },
      },
      {
        $unwind: {
          path: "$applicationMasterData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          sarveId: 1,
          applicationId: 1,
          assignDate: 1,
          isSubmitted: 1,
          submittedDate: 1,
          submittedby: 1,
          isCompleted: 1,
          taluka: "$applicationMasterData.taluka",
          talukaName: "$applicationMasterData.talukaListData.talukaName",
          districtName: "$applicationMasterData.talukaListData.districtName",
          villageName: "$applicationMasterData.villageListData.villageName",
          applicationYear: "$applicationMasterData.applicationYear",
        },
      },
      {
        $sort: {
          applicationYear: -1,
        },
      },
      {
        $group: {
          _id: {
            taluka: "$taluka",
            applicationYear: "$applicationYear",
            sarveId: "$sarveId",
          },
          sarveData: {
            $push: "$$ROOT",
          },
          applicationYear: {
            $first: "$applicationYear",
          },
          sarveId: {
            $first: "$sarveId",
          },
          talukaName: {
            $first: "$talukaName",
          },
          districtName: {
            $first: "$districtName",
          },
          villageName: {
            $first: "$villageName",
          },
        },
      },
      {
        $sort: {
          applicationYear: 1,
        },
      },
      {
        $addFields: {
          count: {
            $cond: {
              if: {
                $isArray: "$sarveData",
              },
              then: {
                $size: "$sarveData",
              },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: {
            taluka: "$talukaName",
            applicationYear: "$applicationYear",
          },
          sarveData: {
            $push: "$$ROOT",
          },
          applicationYear: {
            $first: "$applicationYear",
          },
          sarveId: {
            $first: "$sarveId",
          },
          talukaName: {
            $first: "$talukaName",
          },
          districtName: {
            $first: "$districtName",
          },
          villageName: {
            $first: "$villageName",
          },
        },
      },
      {
        $sort: {
          talukaName: 1,
        },
      },
    ];
    AssignModel.advancedAggregate(query, {}, (err, applicationMaster) => {
      if (err) {
        throw err;
      } else if (_.isEmpty(applicationMaster)) {
        response.setError(AppCode.NotFound);
        response.send(res);
      } else {
        response.setData(AppCode.Success, applicationMaster);
        response.send(res);
      }
    });
  } catch (exception) {
    response.setError(AppCode.InternalServerError);
    response.send(res);
  }
};

/* Reject applicationMaster */
applicationMasterCtrl.rejectApplicationMaster = (req, res) => {
  const response = new HttpRespose();
  try {
    let query1 = { _id: ObjectID(req.body.applicationId) };
    ApplicationMasterModel.updateOne(query1, { $set: { isCompleted: 2 } }, function (err, updateApplicationMaster) {
      if (err) {
        AppCode.Fail.error = err.message;
        response.setError(AppCode.Fail);
        response.send(res);
      } else {
        let query = [
          {
            $match: {
              applicationId: ObjectID(req.body.applicationId),
            },
          },
          {
            $project: {
              _id: 1,
              applicationId: 1,
            },
          },
        ];
        AssignModel.advancedAggregate(query, {}, (err, assignList) => {
          if (err) {
            throw err;
          } else if (_.isEmpty(assignList)) {
            response.setError(AppCode.NotFound);
            response.send(res);
          } else {
            assignList.forEach((assignData, index) => {
              let query = { _id: ObjectID(assignData._id) };
              AssignModel.updateOne(query, { $set: { isCompleted: 2 } }, function (err, updateAssignData) {
                if (err) {
                  console.log(err);
                  // response.setError(AppCode.Fail);
                  // response.send(res);
                } else {
                  if (assignList.length - 1 == index) {
                    response.setData(AppCode.Success);
                    response.send(res);
                  }
                }
              })

            })
          }
        }
        );
      }
    }
    );




  } catch (exception) {
    response.setError(AppCode.InternalServerError);
    response.send(res);
  }
};

module.exports = applicationMasterCtrl;
