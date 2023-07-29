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
                    }
                    else {
                      let excelData = {};
                      excelData.MTRno = xslxData[0] ? xslxData[0].toString() : null;
                      excelData.applicantName = xslxData[1];
                      excelData.applicantMobileNo =
                        xslxData[2] == null ? "" : xslxData[2].toString();
                      excelData.applicantAddress =
                        xslxData[3] == null ? "" : xslxData[3].toString();
                      excelData.district = 8;
                      excelData.taluka = parseInt(req.body.taluka);
                      excelData.village = villageList[0]?.villageId;
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

    let options = {};
    let searchKey = !!req.body.searchKey ? req.body.searchKey : "";
    let sortField = !!req.body.sortField ? req.body.sortField.toString() : "";
    let sortDirection = !!req.body.sortDirection ? parseInt(req.body.sortDirection) : -1;
    let sort = {};
    if (sortField == "applicantName") {
      sort = {
        applicantName: sortDirection
      }
    }
    if (sortField == "talukaName") {
      sort = {
        talukaName: sortDirection
      }
    }
    if (sortField == "villageName") {
      sort = {
        villageName: sortDirection
      }
    }
    if (sortField == "applicationFullDate") {
      sort = {
        applicationFullDate: sortDirection
      }
    }
    if (sortField == "MTRno") {
      sort = {
        MTRno: sortDirection
      }
    }
    if (sortField == "applicantMobileNo") {
      sort = {
        applicantMobileNo: sortDirection
      }
    }
    if (sortField == "newServeNo") {
      sort = {
        newServeNo: sortDirection
      }
    }
    if (sortField == "oldServeNo") {
      sort = {
        oldServeNo: sortDirection
      }
    }

    let pageNumber = !!req.body.pageNumber ? (parseInt(req.body.pageNumber) - 1) : 0;
    let limit = !!req.body.pageSize ? parseInt(req.body.pageSize) : 50;
    let skip = limit * parseInt(pageNumber);
    options.skip = skip;
    options.limit = limit;

    let condition = {};
    condition["$and"] = [];

    condition["$and"].push({
      status: 1,
    });

    condition["$and"].push({
      isCompleted: 3,
    });

    if (req.body.isAssign == false || req.body.isAssign != 'null') {
      condition["$and"].push({
        isAssign: false,
      });
    }

    if (!!req.body.taluka && req.body.taluka != "null") {
      condition["$and"].push({
        taluka: parseInt(req.body.taluka),
      });
    }

    if (!!req.body.village && req.body.village != "null") {
      condition["$and"].push({
        village: parseInt(req.body.village),
      });
    }
    if (!!req.body.applicationYear && req.body.applicationYear != "null") {
      condition["$and"].push({
        applicationYear: req.body.applicationYear,
      });
    }
    if (!!req.body.searchKey && req.body.searchKey != "") {
      condition["$and"].push({
        $or: [
          {
            applicantName: new RegExp(
              ".*" + searchKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ".*",
              "i"
            ),
          },
          {
            MTRno: new RegExp(
              ".*" + searchKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ".*",
              "i"
            ),
          },
          {
            applicantMobileNo: new RegExp(
              ".*" + searchKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ".*",
              "i"
            ),
          },
          {
            newServeNo: new RegExp(
              ".*" + searchKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ".*",
              "i"
            ),
          },
          {
            oldServeNo: new RegExp(
              ".*" + searchKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ".*",
              "i"
            ),
          },
        ],
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
          MTRno: {
            $convert: {
              input: "$MTRno",
              to: "int",
              onError: '*'
            }
          },
          isAssign: 1,
          talukaName: "$talukaListData.talukaName",
          villageName: "$villageListData.villageName",
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    ];

    let result = {};
    async.parallel(
      [
        function (cb) {
          // UserModel.advancedAggregate(countQuery, {}, (err, countData) => {
          ApplicationMasterModel.count(condition, (err, countData) => {
            if (err) {
              throw err;
            } else if (options.skip === 0 && countData === 0) {
              result.totaldata = 0;
              cb(null);
            } else if (options.skip > 0 && countData === 0) {
              result.totaldata = 0;
              cb(null);
            } else {
              console.log("---------", countData)
              if (countData <= skip + limit) {
                result.totaldata = countData;
              } else {
                result.totaldata = countData;
              }
              cb(null);

            }
          });
        },
        function (cb) {
          ApplicationMasterModel.aggregate(query, (err, applicationMaster) => {
            console.log("applicationMaster", applicationMaster);
            if (err) {
              throw err;
            } else if (options.skip === 0 && _.isEmpty(applicationMaster)) {
              cb(null);
            } else if (options.skip > 0 && _.isEmpty(applicationMaster)) {
              cb(null);
            } else {
              result.result = applicationMaster;
              cb(null);
            }
          }
          );
        }
      ],
      function (err) {
        if (err) {
          throw err;
        } else if (options.skip === 0 && _.isEmpty(result.result)) {
          response.setData(AppCode.NotFound, result);
          response.send(res);
        } else if (options.skip > 0 && _.isEmpty(result.result)) {
          response.setData(AppCode.NotFound, result);
          response.send(res);
        } else {
          response.setData(AppCode.Success, result);
          response.send(res);
        }
      })
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
        applicantName: applicationId.applicantName,
        applicantMobileNo: applicationId.applicantMobileNo,
        applicantAddress: applicationId.applicantAddress,
        district: applicationId.district,
        taluka: applicationId.taluka,
        village: applicationId.village,
        applicationFullDate: applicationId.applicationFullDate,
        applicationYear: applicationId.applicationYear,
        applicationMonth: applicationId.applicationMonth,
        applicationDate: applicationId.applicationDate,
        newServeNo: applicationId.newServeNo,
        oldServeNo: applicationId.oldServeNo,
        MTRno: applicationId.MTRno.toString(),
        sarveId: data.sarveId,
        applicationId: ObjectID(applicationId._id),
        assignDate: data.assignDate,
        isSubmitted: false,
        isCompleted: 3,
      };
      let query = { _id: ObjectID(applicationId._id) };
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
              applicationId: ObjectID(applicationId._id),
              isSubmitted: false,
            };
            AssignModel.findOne(query1, {}, (err, assign) => {
              if (err) {
                console.log(err);
              } else {
                if (assign !== null) {
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

const getApplicationList = (taluka, village, applicationYear) => {
  const promise = new Promise((resolve, reject) => {
    let condition = {};
    if (taluka != "" || village != "" || applicationYear != "") {
      condition["$and"] = [];
    }
    if (taluka != "") {
      condition["$and"].push({
        taluka: parseInt(taluka),
      });
    }
    if (village != "") {
      condition["$and"].push({
        village: parseInt(village),
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
        $group: {
          _id: "",
          //allData: {$push: "$$ROOT"},
          data: {
            $addToSet: "$_id",
          },
        },
      },
      {
        $project: {
          _id: 0,
          data: 1,
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
// applicationMasterCtrl.applicationMasterListforAssign = (req, res) => {
//   const response = new HttpRespose();
//   try {
//     let taluka = "";
//     let village = "";
//     let applicationYear = "";
//     if (!!req.body.taluka && req.body.taluka != "null") {
//       taluka = req.body.taluka;
//     }
//     if (!!req.body.village && req.body.village != "null") {
//       village = req.body.village;
//     }
//     if (!!req.body.applicationYear && req.body.applicationYear != "null") {
//       applicationYear = req.body.applicationYear;
//     }
//     let applicationList = [];
//     getApplicationList(taluka, village, applicationYear).then((applicationData) => {
//       if (applicationData[0]?.data.length > 0) {
//         applicationList = applicationData[0].data
//       }

//       let options = {};
//       let searchKey = !!req.body.searchKey ? req.body.searchKey : "";
//       let sortField = !!req.body.sortField ? req.body.sortField.toString() : "";
//       let sortDirection = !!req.body.sortDirection ? parseInt(req.body.sortDirection) : "";
//       let sort = {};
//       if (sortField == "applicantName") {
//         sort = {
//           applicantName: sortDirection
//         }
//       }
//       if (sortField == "talukaName") {
//         sort = {
//           talukaName: sortDirection
//         }
//       }
//       if (sortField == "villageName") {
//         sort = {
//           villageName: sortDirection
//         }
//       }
//       if (sortField == "applicationFullDate") {
//         sort = {
//           applicationFullDate: sortDirection
//         }
//       }
//       if (sortField == "MTRno") {
//         sort = {
//           MTRno: sortDirection
//         }
//       }
//       if (sortField == "applicantMobileNo") {
//         sort = {
//           applicantMobileNo: sortDirection
//         }
//       }
//       if (sortField == "newServeNo") {
//         sort = {
//           newServeNo: sortDirection
//         }
//       }
//       if (sortField == "oldServeNo") {
//         sort = {
//           oldServeNo: sortDirection
//         }
//       } else {
//         sort = {
//           applicantName: -1
//         }
//       }

//       let pageNumber = !!req.body.pageNumber ? (parseInt(req.body.pageNumber) - 1) : 0;
//       let limit = !!req.body.pageSize ? parseInt(req.body.pageSize) : 50;
//       let skip = limit * parseInt(pageNumber);
//       options.skip = skip;
//       options.limit = limit;

//       let condition = {};
//       condition["$and"] = [];
//       condition["$and"].push({
//         isSubmitted: false,
//       });
//       condition["$and"].push({
//         isCompleted: 3,
//       });
//       condition["$and"].push({
//         applicationId: { $in: applicationList },
//       });

//       if (!!req.body.sarveId && req.body.sarveId != "null") {
//         condition["$and"].push({
//           sarveId: ObjectID(req.body.sarveId),
//         });
//       }

//       if (!!req.body.searchKey && req.body.searchKey != "") {
//         condition["$and"].push({
//           $or: [
//             {
//               applicantName: new RegExp(
//                 ".*" + searchKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ".*",
//                 "i"
//               ),
//             },

//             {
//               MTRno: new RegExp(
//                 ".*" + searchKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ".*",
//                 "i"
//               ),
//             },
//             {
//               applicantMobileNo: new RegExp(
//                 ".*" + searchKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ".*",
//                 "i"
//               ),
//             },
//             {
//               newServeNo: new RegExp(
//                 ".*" + searchKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ".*",
//                 "i"
//               ),
//             },
//             {
//               oldServeNo: new RegExp(
//                 ".*" + searchKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ".*",
//                 "i"
//               ),
//             },
//           ],
//         });
//       }
//       // console.log("condition", condition);
//       let query = [
//         {
//           $match: condition,
//         },
//         {
//           $lookup: {
//             from: "applicationMaster",
//             as: "applicationMasterData",
//             let: { applicationId: "$applicationId" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $eq: ["$_id", "$$applicationId"],
//                   },
//                 },
//               },
//               {
//                 $lookup: {
//                   from: "talukaList",
//                   as: "talukaListData",
//                   let: { taluka: "$taluka" },
//                   pipeline: [
//                     {
//                       $match: {
//                         $expr: {
//                           $eq: ["$talukaId", "$$taluka"],
//                         },
//                       },
//                     },

//                     {
//                       $project: {
//                         _id: 1,
//                         talukaName: 1,
//                       },
//                     },
//                   ],
//                 },
//               },
//               {
//                 $unwind: {
//                   path: "$talukaListData",
//                   preserveNullAndEmptyArrays: true,
//                 },
//               },
//               {
//                 $lookup: {
//                   from: "villageList",
//                   as: "villageListData",
//                   let: { village: "$village" },
//                   pipeline: [
//                     {
//                       $match: {
//                         $expr: {
//                           $eq: ["$villageId", "$$village"],
//                         },
//                       },
//                     },

//                     {
//                       $project: {
//                         _id: 1,
//                         villageName: 1,
//                       },
//                     },
//                   ],
//                 },
//               },
//               {
//                 $unwind: {
//                   path: "$villageListData",
//                   preserveNullAndEmptyArrays: true,
//                 },
//               },
//               {
//                 $project: {
//                   _id: 1,
//                   applicantName: 1,
//                   applicantMobileNo: 1,
//                   applicantAddress: 1,
//                   district: 1,
//                   taluka: 1,
//                   village: 1,
//                   applicationFullDate: 1,
//                   applicationYear: 1,
//                   applicationMonth: 1,
//                   applicationDate: 1,
//                   newServeNo: 1,
//                   oldServeNo: 1,
//                   MTRno: {
//                     $convert: {
//                       input: "$MTRno",
//                       to: "int",
//                       onError: '*'
//                     }
//                   },
//                   talukaName: "$talukaListData.talukaName",
//                   villageName: "$villageListData.villageName",
//                   isAssign: 1,
//                   sarveId: 1,
//                   sarveName: "$sarveMasterData.name",
//                   status: 1,
//                   createdAt: 1,
//                   updatedAt: 1,
//                 },
//               },
//             ],
//           },
//         },
//         {
//           $unwind: {
//             path: "$applicationMasterData",
//             preserveNullAndEmptyArrays: true,
//           },
//         },
//         {
//           $lookup: {
//             from: "sarveMaster",
//             as: "sarveMasterData",
//             let: { sarveId: "$sarveId" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $eq: ["$_id", "$$sarveId"],
//                   },
//                 },
//               },

//               {
//                 $project: {
//                   _id: 1,
//                   name: 1,
//                 },
//               },
//             ],
//           },
//         },
//         {
//           $unwind: {
//             path: "$sarveMasterData",
//             preserveNullAndEmptyArrays: true,
//           },
//         },
//         {
//           $project: {
//             _id: 1,
//             applicationId: "$applicationMasterData._id",
//             applicantName: "$applicationMasterData.applicantName",
//             applicantMobileNo: "$applicationMasterData.applicantMobileNo",
//             applicantAddress: "$applicationMasterData.applicantAddress",
//             district: "$applicationMasterData.district",
//             taluka: "$applicationMasterData.taluka",
//             village: "$applicationMasterData.village",
//             applicationFullDate: "$applicationMasterData.applicationFullDate",
//             applicationYear: "$applicationMasterData.applicationYear",
//             applicationMonth: "$applicationMasterData.applicationMonth",
//             applicationDate: "$applicationMasterData.applicationDate",
//             newServeNo: "$applicationMasterData.newServeNo",
//             oldServeNo: "$applicationMasterData.oldServeNo",
//             MTRno: "$applicationMasterData.MTRno",
//             talukaName: "$applicationMasterData.talukaName",
//             villageName: "$applicationMasterData.villageName",
//             isAssign: "$applicationMasterData.isAssign",
//             sarveId: 1,
//             sarveName: "$sarveMasterData.name",
//             status: 1,
//             createdAt: 1,
//             updatedAt: 1,
//           },
//         },
//         { $sort: sort },
//         { $skip: skip },
//         { $limit: limit },
//       ];

//       let result = {};
//       async.parallel(
//         [
//           function (cb) {
//             // UserModel.advancedAggregate(countQuery, {}, (err, countData) => {
//             AssignModel.count(condition, (err, countData) => {
//               if (err) {
//                 throw err;
//               } else if (options.skip === 0 && countData === 0) {
//                 result.totaldata = 0;
//                 cb(null);
//               } else if (options.skip > 0 && countData === 0) {
//                 result.totaldata = 0;
//                 cb(null);
//               } else {
//                 console.log("---------", countData)
//                 if (countData <= skip + limit) {
//                   result.totaldata = countData;
//                 } else {
//                   result.totaldata = countData;
//                 }
//                 cb(null);

//               }
//             });
//           },
//           function (cb) {
//             AssignModel.aggregate(query, (err, applicationMaster) => {
//               if (err) {
//                 throw err;
//               } else if (options.skip === 0 && _.isEmpty(applicationMaster)) {
//                 cb(null);
//               } else if (options.skip > 0 && _.isEmpty(applicationMaster)) {
//                 cb(null);
//               } else {
//                 result.result = applicationMaster;
//                 cb(null);
//               }
//             });

//           }
//         ],
//         function (err) {
//           if (err) {
//             throw err;
//           } else if (options.skip === 0 && _.isEmpty(result.result)) {
//             response.setData(AppCode.NotFound, result);
//             response.send(res);
//           } else if (options.skip > 0 && _.isEmpty(result.result)) {
//             response.setData(AppCode.NotFound, result);
//             response.send(res);
//           } else {
//             response.setData(AppCode.Success, result);
//             response.send(res);
//           }
//         }
//       );









//     });
//   } catch (exception) {
//     response.setError(AppCode.InternalServerError);
//     response.send(res);
//   }
// };

applicationMasterCtrl.applicationMasterListforAssign = (req, res) => {
  const response = new HttpRespose();
  try {

    let options = {};
    let searchKey = !!req.body.searchKey ? req.body.searchKey : "";
    let sortField = !!req.body.sortField ? req.body.sortField.toString() : "";
    let sortDirection = !!req.body.sortDirection ? parseInt(req.body.sortDirection) : -1;
    let sort = {};
    if (sortField == "applicantName") {
      sort = {
        applicantName: sortDirection
      }
    }
    if (sortField == "talukaName") {
      sort = {
        talukaName: sortDirection
      }
    }
    if (sortField == "villageName") {
      sort = {
        villageName: sortDirection
      }
    }
    if (sortField == "applicationFullDate") {
      sort = {
        applicationFullDate: sortDirection
      }
    }
    if (sortField == "MTRno") {
      sort = {
        MTRno: sortDirection
      }
    }
    if (sortField == "applicantMobileNo") {
      sort = {
        applicantMobileNo: sortDirection
      }
    }
    if (sortField == "newServeNo") {
      sort = {
        newServeNo: sortDirection
      }
    }
    if (sortField == "oldServeNo") {
      sort = {
        oldServeNo: sortDirection
      }
    }

    let pageNumber = !!req.body.pageNumber ? (parseInt(req.body.pageNumber) - 1) : 0;
    let limit = !!req.body.pageSize ? parseInt(req.body.pageSize) : 50;
    let skip = limit * parseInt(pageNumber);
    options.skip = skip;
    options.limit = limit;

    let condition = {};
    condition["$and"] = [];

    condition["$and"].push({
      isSubmitted: false,
    });
    condition["$and"].push({
      isCompleted: 3,
    });

    if (!!req.body.sarveId && req.body.sarveId != "null") {
      condition["$and"].push({
        sarveId: ObjectID(req.body.sarveId),
      });
    }

    if (!!req.body.taluka && req.body.taluka != "null") {
      condition["$and"].push({
        taluka: parseInt(req.body.taluka),
      });
    }

    if (!!req.body.village && req.body.village != "null") {
      condition["$and"].push({
        village: parseInt(req.body.village),
      });
    }
    if (!!req.body.applicationYear && req.body.applicationYear != "null") {
      condition["$and"].push({
        applicationYear: req.body.applicationYear,
      });
    }
    if (!!req.body.searchKey && req.body.searchKey != "") {
      condition["$and"].push({
        $or: [
          {
            applicantName: new RegExp(
              ".*" + searchKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ".*",
              "i"
            ),
          },
          {
            MTRno: new RegExp(
              ".*" + searchKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ".*",
              "i"
            ),
          },
          {
            applicantMobileNo: new RegExp(
              ".*" + searchKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ".*",
              "i"
            ),
          },
          {
            newServeNo: new RegExp(
              ".*" + searchKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ".*",
              "i"
            ),
          },
          {
            oldServeNo: new RegExp(
              ".*" + searchKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ".*",
              "i"
            ),
          },
        ],
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
          _id: "$applicationId",
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
          MTRno: {
            $convert: {
              input: "$MTRno",
              to: "int",
              onError: '*'
            }
          },
          isAssign: 1,
          talukaName: "$talukaListData.talukaName",
          villageName: "$villageListData.villageName",
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    ];

    let result = {};
    async.parallel(
      [
        function (cb) {
          // UserModel.advancedAggregate(countQuery, {}, (err, countData) => {
          AssignModel.count(condition, (err, countData) => {
            if (err) {
              throw err;
            } else if (options.skip === 0 && countData === 0) {
              result.totaldata = 0;
              cb(null);
            } else if (options.skip > 0 && countData === 0) {
              result.totaldata = 0;
              cb(null);
            } else {
              console.log("---------", countData)
              if (countData <= skip + limit) {
                result.totaldata = countData;
              } else {
                result.totaldata = countData;
              }
              cb(null);

            }
          });
        },
        function (cb) {
          AssignModel.aggregate(query, (err, applicationMaster) => {
            console.log("applicationMaster", applicationMaster);
            if (err) {
              throw err;
            } else if (options.skip === 0 && _.isEmpty(applicationMaster)) {
              cb(null);
            } else if (options.skip > 0 && _.isEmpty(applicationMaster)) {
              cb(null);
            } else {
              result.result = applicationMaster;
              cb(null);
            }
          }
          );
        }
      ],
      function (err) {
        if (err) {
          throw err;
        } else if (options.skip === 0 && _.isEmpty(result.result)) {
          response.setData(AppCode.NotFound, result);
          response.send(res);
        } else if (options.skip > 0 && _.isEmpty(result.result)) {
          response.setData(AppCode.NotFound, result);
          response.send(res);
        } else {
          response.setData(AppCode.Success, result);
          response.send(res);
        }
      })
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

    if (!!req.query.taluka && req.query.taluka != "null") {
      condition["$and"].push({
        taluka: parseInt(req.query.taluka),
      });
    }

    if (!!req.query.village && req.query.village != "null") {
      condition["$and"].push({
        village: parseInt(req.query.village),
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

    let condition = {};
    condition["$and"] = [];

    condition["$and"].push({
      isSubmitted: false,
    });
    condition["$and"].push({
      isCompleted: 3,
    });

    if (!!req.query.sarveId && req.query.sarveId != "null") {
      condition["$and"].push({
        sarveId: ObjectID(req.query.sarveId),
      });
    }

    if (!!req.query.taluka && req.query.taluka != "null") {
      condition["$and"].push({
        taluka: parseInt(req.query.taluka),
      });
    }

    if (!!req.query.village && req.query.village != "null") {
      condition["$and"].push({
        village: parseInt(req.query.village),
      });
    }


    let query = [
      {
        $match: condition
      },

      {
        $group: {
          _id: {
            year: "$applicationYear",
          },
          year: {
            $first: "$applicationYear",
          },
        },
      },
      { $sort: { year: -1 } }
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

        console.log('....................', updateApplicationMaster);

        AssignModel.findOne({ applicationId: ObjectID(req.body.applicationId) }, function (err, assignApplicationData) {
          if (err) {
            console.log("err", err);
            response.setError(AppCode.Fail);
            response.send(res);
          } else {
            if (assignApplicationData === null) {
              response.setData(AppCode.Success);
              response.send(res);
            }
            else {
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
        })
      }
    }
    );




  } catch (exception) {
    response.setError(AppCode.InternalServerError);
    response.send(res);
  }
};

/* Reject applicationMaster */
applicationMasterCtrl.rejectMultiApplicationMaster = (req, res) => {
  const response = new HttpRespose();
  const data = req.body;

  try {
    data.applicationId.forEach((applicationId, index) => {

      let query1 = { _id: ObjectID(applicationId) };
      ApplicationMasterModel.updateOne(query1, { $set: { isCompleted: 2 } }, function (err, updateApplicationMaster) {
        if (err) {
          AppCode.Fail.error = err.message;
          response.setError(AppCode.Fail);
          response.send(res);
        } else {


          let query = { applicationId: ObjectID(applicationId) };
          AssignModel.updateMany(query, { $set: { isCompleted: 2 } }, function (err, updateAssignData) {
            if (err) {
              console.log(err);
              // response.setError(AppCode.Fail);
              // response.send(res);
            } else {
              if (data.applicationId.length - 1 == index) {
                response.setData(AppCode.Success);
                response.send(res);
              }
            }
          })



        }
      })


    })




  } catch (exception) {
    response.setError(AppCode.InternalServerError);
    response.send(res);
  }
};



/* applicationMaster Export*/
applicationMasterCtrl.applicationMasterExport = (req, res) => {
  const response = new HttpRespose();
  try {

    let condition = {};
    condition["$and"] = [];

    condition["$and"].push({
      isCompleted: 3,
    });

    if (!!req.query.taluka && req.query.taluka != "null") {
      condition["$and"].push({
        taluka: parseInt(req.query.taluka),
      });
    }

    if (!!req.query.village && req.query.village != "null") {
      condition["$and"].push({
        village: parseInt(req.query.village),
      });
    }

    if (!!req.query.applicationYear && req.query.applicationYear != "null") {
      condition["$and"].push({
        applicationYear: req.query.applicationYear,
      });
    }

    let query = [
      {
        $match: condition
      },
      {
        $lookup: {
          from: "assignApplication",
          as: "assignApplicationData",
          let: {
            applicationId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    "$applicationId",
                    "$$applicationId",
                  ],
                },
                isSubmitted: false,
              },
            },
            {
              $lookup: {
                from: "sarveMaster",
                as: "sarveMasterData",
                let: {
                  sarveId: "$sarveId",
                },
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
                sarveId: 1,
                sarveName: "$sarveMasterData.name",
                applicationId: 1,
                assignDate: 1,
                isSubmitted: 1,
                submittedDate: 1,
                submittedby: 1,
                submittedbyName:
                  "$submittedbyData.name",
                isCompleted: 1,
              },
            },
            {
              $sort: {
                submittedDate: 1,
              },
            },
          ],
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
          isAssign: 1,
          talukaName: "$talukaListData.talukaName",
          villageName: "$villageListData.villageName",
          assignApplicationData: "$assignApplicationData",
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

module.exports = applicationMasterCtrl;
