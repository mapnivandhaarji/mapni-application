let adminUserCtrl = {};
const adminUserModel = new (require("../../common/model/adminUserModel"))
const HttpRespose = require("../../common/httpResponse");
const AppCode = require("../../common/constant/appCods");
const Logger = require("../../common/logger");
const bcrypt = require("bcryptjs");
const ObjectID = require("mongodb").ObjectId;
const CONFIG = require("../../config");
const nodemailer = require("nodemailer");
const _ = require("lodash");

/* Token Check */
// AdminAuthCtrl.TokenCheck = (req, res) => {
//     var response = new HttpRespose();
//     if (!!req.payload && !!c) {
//         response.setData(AppCode.Success);
//         response.send(res);
//     }
//     else {
//         response.setError(AppCode.PleaseLoginAgain);
//         response.send(res);
//     }
// };

// /* Admin Create */
// AdminAuthCtrl.adminCreate = (req, res) => {
//     var response = new HttpRespose();
//     var data = req.body;
//     let password = req.body.pwd;
//     console.log(data)
//     AdminUserModel.create(data, (err, newId) => {
//         if (err) {
//             console.log(err)
//             response.setError(AppCode.Fail);
//             response.send(res);
//         } else {
//             var transporter = nodemailer.createTransport({
//                 service: CONFIG.MAIL.SERVICEPROVIDER,
//                 auth: {
//                     user: CONFIG.MAIL.MAILID,
//                     pass: CONFIG.MAIL.PASSWORD
//                 }
//             });
//             var mailOptions = {
//                 from: CONFIG.MAIL.MAILID,
//                 to: data.email,
//                 subject: "your password is : ",
//                 text: 'Your password Is ' + password
//             };
//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                 } else {
//                     console.log('Email sent: ' + info.response);
//                 }
//             });
//             response.setData(AppCode.UserRegistrationSuccess, newId);
//             response.send(res);
//         }
//     });
// };

/* Admin Login */
adminUserCtrl.login = (req, res) => {
    const response = new HttpRespose();
    adminUserModel.findOne({
        $or: [
            { email: req.body.email.toLowerCase() }
        ]
    }, {
        _id: 1,
        pwd: 1,
        status: 1,
    }, (err, adminUser) => {
        if (err) {
            response.setError(AppCode.Fail
            );
            response.send(res);
        } else {
            if (adminUser === null) {
                response.setError(AppCode.NoUserFound);
                response.send(res);
            } else {
                if (adminUser.status == 2) {
                    response.setError(AppCode.UserNotActivated);
                    response.send(res);
                } else {
                    bcrypt.compare(req.body.pwd, adminUser.pwd, function (err, pwdResult) {
                        console.log("---------------", pwdResult)
                        if (pwdResult) {
                            adminUserModel.generateSessionToken({ _id: adminUser._id }, function (err, userResData) {
                                if (err) {
                                    response.setError(err);
                                    response.send(res);
                                } else {
                                    res.cookie('woven-token', userResData.myToken, {
                                        maxAge: CONFIG.JWTTIMEOUT,
                                        httpOnly: false
                                    });
                                    response.setData(AppCode.LoginSuccess, userResData);
                                    response.send(res);
                                }
                            });
                        } else {
                            response.setError(AppCode.InvalidCredential);
                            response.send(res);
                        }
                    });
                }
            }
        }
    });
};

// /*Admin User save Data */ /
adminUserCtrl.usersaveData = (req, res) => {
    var response = new HttpRespose();
    if (!!req.body &&!!req.body.email ) {
        try {
            if (!!req.body.roleId ) {
                roleId = ObjectID(req.body.roleId);
             } 

                let query = {
                    email: req.body.email,
             }; 
             adminUserModel.findOne(query, function (err, user) {
                if (err) {
                    console.log(err)
                    //TODO: Log the error here
                    AppCode.userInsertFail.error = err.message;
                    response.setError(AppCode.userInsertFail);
                    response.send(res);
                } else {
                    if (user === null) {
                        console.log(err)
                        adminUserModel.create(req.body, function (err, user) {
                            if (err) {
                                console.log(err)
                                //TODO: Log the error here
                                AppCode.userInsertFail.error = err.message;
                                response.setError(AppCode.userInsertFail);
                            } else {
                                response.setData(AppCode.UserSaveSuccess, user);
                                response.send(res);
                            }
                        });

                    } else {
                        response.setError(AppCode.emailIsAlreadyVerify);
                        response.send(res);
                    }
                }
            });
        } catch (exception) {
            console.log("exception",exception)
         }
    }
    else {
        AppCode.userInsertFail.error = "Oops! something went wrong, please try again later";
        response.setError(AppCode.userInsertFail);
        response.send(res);
    }
};


module.exports = adminUserCtrl;
