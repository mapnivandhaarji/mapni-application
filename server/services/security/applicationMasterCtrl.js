let applicationMasterCtrl = {};
const AdminUserModel = new (require("../../common/model/adminUserModel"))();
const ApplicationMasterModel =
  new (require("../../common/model/applicationMasterModel"))();
const HttpRespose = require("../../common/httpResponse");
const AppCode = require("../../common/constant/appCods");
const Logger = require("../../common/logger");
const bcrypt = require("bcryptjs");
const blacklist = require("express-jwt-blacklist");
const ObjectID = require("mongodb").ObjectID;
const async = require("async");
const CONFIG = require("../../config");

const _ = require("lodash");

/* applicationMaster Create */
applicationMasterCtrl.applicationMasterCreate = (req, res) => {
  var response = new HttpRespose();
  var data = req.body;
  data.isAssign = false;
  let query = {
    applicantMobileNo: data.applicantMobileNo,
  };

  ApplicationMasterModel.findOne(query, {}, (err, applicationMaster) => {
    if (err) {
      console.log(err);
      response.setError(AppCode.Fail);
      response.send(res);
    } else if (applicationMaster !== null) {
      response.setError(AppCode.AllreadyExist);
      response.send(res);
    } else {
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
    }
  });
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
      let bodydata = {
        isAssign: data.isAssign,
        assignDate: data.assignDate,
        sarveId: data.sarveId,
      };
      let query = { _id: ObjectID(applicationId) };
      ApplicationMasterModel.update(
        query,
        bodydata,
        function (err, applicationMaster) {
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
        }
      );
    });
  } catch (exception) {
    response.setError(AppCode.InternalServerError);
    response.send(res);
  }
};

/* ApplicationMaster List */
applicationMasterCtrl.applicationMasterListforAssign = (req, res) => {
  const response = new HttpRespose();
  try {
    let condition = {};
    condition["$and"] = [];
    condition["$and"].push({
      status: 1,
    });
    if (!!req.query.isAssign) {
      condition["$and"].push({
        isAssign: req.query.isAssign === "true",
      });
    }
    if (!!req.query.sarveId && req.query.sarveId != "null") {
      condition["$and"].push({
        sarveId: ObjectID(req.query.sarveId),
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
