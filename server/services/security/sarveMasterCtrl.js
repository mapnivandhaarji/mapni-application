let sarveMasterCtrl = {};
const AdminUserModel = new (require("../../common/model/adminUserModel"))
const SarveMasterModel = new (require("../../common/model/sarveMasterModel"))
const HttpRespose = require("../../common/httpResponse");
const AppCode = require("../../common/constant/appCods");
const Logger = require("../../common/logger");
const bcrypt = require("bcryptjs");
const blacklist = require('express-jwt-blacklist');
const ObjectID = require("mongodb").ObjectID;
const async = require("async");
const CONFIG = require("../../config");

const _ = require("lodash");

/* sarveMaster Create */
sarveMasterCtrl.sarveMasterCreate = (req, res) => {
    var response = new HttpRespose()
    var data = req.body;
    let query = {
        mobile: data.mobile
    }

    SarveMasterModel.findOne(query, {}, (err, sarveMaster) => {
        if (err) {
            console.log(err)
            response.setError(AppCode.Fail);
            response.send(res);
        } else if (sarveMaster !== null) {
            response.setError(AppCode.AllreadyExist);
            response.send(res);
        } else {
            SarveMasterModel.create(data, (err, sarveMaster) => {
                if (err) {
                    console.log(err)
                    response.setError(AppCode.Fail);
                    response.send(res);
                } else {
                    response.setData(AppCode.Success, sarveMaster);
                    response.send(res);
                }
            });
        }
    })
};

/* sarveMaster Active-Deactive */
sarveMasterCtrl.sarveMasterActiveDeactive = (req, res) => {
    const response = new HttpRespose();
    let query = { _id: ObjectID(req.body._id) };
    SarveMasterModel.updateOne(query, { $set: { status: req.body.status } }, function (err, sarveMaster) {
        if (err) {
            AppCode.Fail.error = err.message;
            response.setError(AppCode.Fail);
            response.send(res);
        } else {
            response.setData(AppCode.Success);
            response.send(res);
        }
    });
};

/* sarveMaster Details By Id*/
sarveMasterCtrl.sarveMasterDetailsById = (req, res) => {
    const response = new HttpRespose();
    try {
        let query = [
            {
                $match: {
                    _id: ObjectID(req.query._id)
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    mobile: 1,
                    email: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                }
            }
        ];
        SarveMasterModel.advancedAggregate(query, {}, (err, sarveMaster) => {
            if (err) {
                throw err;
            } else if (_.isEmpty(sarveMaster)) {
                response.setError(AppCode.NotFound);
                response.send(res);
            } else {
                response.setData(AppCode.Success, sarveMaster[0]);
                response.send(res);
            }
        });
    } catch (exception) {
        response.setError(AppCode.InternalServerError);
        response.send(res);
    }
}

/* SarveMaster List */
sarveMasterCtrl.sarveMasterList = (req, res) => {
    const response = new HttpRespose();
    try {
        let query = [
            {
                $match: {}
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    mobile: 1,
                    email: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                }
            }
        ];
        SarveMasterModel.advancedAggregate(query, {}, (err, sarveMaster) => {
            if (err) {
                throw err;
            } else if (_.isEmpty(sarveMaster)) {
                response.setError(AppCode.NotFound);
                response.send(res);
            } else {
                response.setData(AppCode.Success, sarveMaster);
                response.send(res);
            }
        });
    } catch (exception) {
        response.setError(AppCode.InternalServerError);
        response.send(res);
    }
}

/* Active sarveMaster List */
sarveMasterCtrl.activeSarveMasterList = (req, res) => {
    const response = new HttpRespose();
    try {
        let query = [
            {
                $match: {
                    status: 1
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    mobile: 1,
                    email: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                }
            }
        ];
        SarveMasterModel.advancedAggregate(query, {}, (err, sarveMaster) => {
            if (err) {
                throw err;
            } else if (_.isEmpty(sarveMaster)) {
                response.setError(AppCode.NotFound);
                response.send(res);
            } else {
                response.setData(AppCode.Success, sarveMaster);
                response.send(res);
            }
        });
    } catch (exception) {
        response.setError(AppCode.InternalServerError);
        response.send(res);
    }
}

/* sarveMaster Update*/
sarveMasterCtrl.sarveMasterUpdate = (req, res) => {
    var response = new HttpRespose();
    var _id = ObjectID(req.body._id);
    let bodydata = req.body;
    if (!!req.body) {
        try {
            let query = { _id: _id };
            delete bodydata._id
            SarveMasterModel.findOne(query, function (err, sarveMaster) {
                if (err) {
                    console.log("err", err)
                    response.setError(AppCode.Fail);
                    response.send(res);
                } else {
                    if (sarveMaster === null) {
                        response.setError(AppCode.NotFound);
                        response.send(res);
                    } else {
                        SarveMasterModel.update(query, bodydata, function (err, sarveMaster) {
                            if (err) {
                                console.log(err)
                                response.setError(AppCode.Fail);
                                response.send(res);
                            } else if (sarveMaster == undefined || (sarveMaster.matchedCount === 0 && sarveMaster.modifiedCount === 0)) {
                                response.setError(AppCode.NotFound);
                            } else {
                                response.setData(AppCode.Success, req.body);
                                response.send(res);
                            }
                        });
                    }
                }
            });
        } catch (exception) {
            response.setError(AppCode.Fail);
            response.send(res);
        }
    }
    else {
        AppCode.Fail.error = "Oops! something went wrong, please try again later";
        response.setError(AppCode.Fail);
        response.send(res);
    }
};

/* sarveMaster Delete*/
sarveMasterCtrl.deleteSarveMaster = (req, res) => {
    const response = new HttpRespose();
    const data = req.body;
    const query = {
        _id: ObjectID(data._id)
    };
    SarveMasterModel.findOne(query, function (err, sarveMaster) {
        if (err) {
            AppCode.Fail.error = err.message;
            response.setError(AppCode.Fail);
            response.send(res);
        } else {
            if (sarveMaster == null) {
                AppCode.Fail.error = "No record found";
                response.setError(AppCode.Fail);
                response.send(res);
            } else {
                SarveMasterModel.remove(query, function (err, sarveMaster) {
                    if (err) {
                        AppCode.Fail.error = err.message;
                        response.setError(AppCode.Fail);
                        response.send(res);
                    } else if (sarveMaster == undefined || sarveMaster.deletedCount === 0) {
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


module.exports = sarveMasterCtrl;
