const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
var expressSession = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const compression = require("compression");
const cors = require("cors");
const CONFIG = require("./../config");
const multer = require("multer");
const { expressjwt: jwt } = require("express-jwt");
const blacklist = require("express-jwt-blacklist");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dirPath = CONFIG.UPLOADS.DEFAULT;
    if (!!file.fieldname) {
      if (
        file.fieldname === "photos" ||
        file.fieldname === "icon" ||
        file.fieldname === "image" ||
        file.fieldname === "profile_image" ||
        file.fieldname === "logo" ||
        file.fieldname === "default_icon" ||
        file.fieldname === "active_icon" ||
        file.fieldname === "Image"
      ) {
        dirPath = CONFIG.UPLOADS.DIR_PATH_PHOTOS;
      } else if (
        file.fieldname === "videos" ||
        file.fieldname === "function_video"
      ) {
        dirPath = CONFIG.UPLOADS.DIR_PATH_VIDEOS;
      } else if (file.fieldname === "documents") {
        dirPath = CONFIG.UPLOADS.DIR_PATH_DOCUMENTS;
      }
    }
    cb(null, dirPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
});
module.exports = (app) => {
  app.use(compression());
  app.use(cors());

  CONFIG.JWTTOKENALLOWACCESS = jwt({
    secret: CONFIG.JWTTOKENKEY,
    algorithms: ["HS256"],
    userProperty: "payload",
    //   isRevoked: blacklist.isRevoked,
  });
  app.use(bodyParser.json({ limit: "2gb" }));
  app.use(
    bodyParser.urlencoded({
      limit: "2gb",
      extended: true,
    })
  );
  app.use(cookieParser());
  /**
   *@description Express Session
   */
  app.use(
    expressSession({
      secret: CONFIG.COOKIE_PRIVATE_KEY,
      name: "onn-app",
      proxy: true,
      resave: true,
      saveUninitialized: true,
      httponly: true,
    })
  );
  app.use(express.static("public"));
  app.use(logger("dev"));
  app.use("/v1/auth/modify-business-details", function (req, res, next) {
    next();
  });

  // connect with angular build file
  app.use("/", express.static(path.join(__dirname, CONFIG.APP.WEB.PUB_DIR)));

  app.use('/uploads', express.static(path.join(__dirname, '/../uploads')))
  app.use(
    "/images",
    express.static(path.resolve("/../client/dist/assets/images/default"))
  );
  app.use("/assets", express.static(path.resolve("/../client/dist/assets")));
  var cpUpload = upload.fields([
    {
      name: "photos",
      maxCount: 15,
    },
    {
      name: "icon",
      maxCount: 15,
    },
    {
      name: "videos",
      maxCount: 15,
    },
    {
      name: "documents",
      maxCount: 15,
    },
    {
      name: "talukaExcelDocument",
      maxCount: 1,
    },
    {
      name: "applicationExcelUpload",
      maxCount: 1,
    },
  ]);

  app.use("/v1/adminUser", cpUpload, require("../web/routes/v1/adminUser"));
  app.use("/v1/sarveMaster", cpUpload, require("../web/routes/v1/sarveMaster"));
  app.use(
    "/v1/applicationMaster",
    cpUpload,
    require("../web/routes/v1/applicationMaster")
  );
  app.use(
    "/v1/districtTalukaVillageExcel",
    cpUpload,
    require("../web/routes/v1/districtTalukaVillageExcel")
  );

  // app.use((req, res, next) => {
  //   next(createError(404));
  // });
  app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    console.log("err", err);
    if (err.name === "UnauthorizedError") {
      if (err.message === "jwt expired") {
        res.status(401);
        res.json({
          meta: { code: 402, message: err.name + ": " + err.message },
        });
      } else {
        res.status(401);
        res.json({
          meta: { code: 401, message: err.name + ": " + err.message },
        });
      }
    } else {
      res.status(err.status || 500).send({
        error: err.message ? err.message : "Something failed!",
      });
    }
  });

  // app.get("/*", function (req, res) {
  //   console.log("path not found.......req.url=" + req.url);
  //   res.sendFile(
  //     path.resolve(__dirname + CONFIG.APP.WEB.PUB_DIR + "/index.html")
  //   );
  // });

  // reload issuse solve of this line
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/dist/index.html'));
  });


  return app;
};
