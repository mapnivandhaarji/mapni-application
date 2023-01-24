let UniqueCtrl = {};
const AdminUserModel = new (require("./../../common/model/adminUserModel"))
const HttpRespose = require("./../../common/httpResponse");
const AppCode = require("../../common/constant/appCods");
const Logger = require("../../common/logger");
const ObjectID = require("mongodb").ObjectID;
const _ = require("lodash");



module.exports = UniqueCtrl;
