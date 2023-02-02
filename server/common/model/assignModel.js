const ModelBase = require("./modelBase");
const CONFIG = require("../../config");
const _ = require("lodash");

class assignModel extends ModelBase {
  constructor() {
    super(CONFIG.DB.MONGO.DB_NAME, "assignApplication", {
      applicationId: { type: Object, allowNullEmpty: true },
      sarveId: { type: Object, allowNullEmpty: true },
      assignDate: { type: String, allowNullEmpty: true },
      submittedby: { type: Object, allowNullEmpty: true },
      submittedDate: { type: String, allowNullEmpty: true },
      isSubmitted: { type: Boolean, allowNullEmpty: true },
      isCompleted: {
        type: Number,
        allowNullEmpty: false,
        enum: { 1: "Completed", 2: "Reject", 3: "Not Completed" },
      },
    });
  }

  /**
   * @description create Always return an unique id after inserting new user
   * @param {*} data
   * @param {*} cb
   */
  create(data, cb) {
    var err = this.validate(data);

    if (err) {
      return cb(err);
    }

    data.createdAt = new Date();
    data.status = 1;
    //  data.isEditable = true;
    this.insert(data, (err, result) => {
      if (err) {
        return cb(err);
      }

      cb(null, result.ops[0]);
    });
  }

  find(conditions, options, cb) {
    this.getModel(function (err, model) {
      if (err) {
        return cb(err);
      }
      if (!_.isEmpty(options)) {
        const limit = !_.isEmpty(options) && options.limit ? options.limit : 20;
        const skip = options.skip ? options.skip : 0;
        const sort = options.sort ? options.sort : { _id: -1 };
        model
          .find(conditions)
          .sort(options.sort)
          .skip(options.skip)
          .limit(options.limit)
          .toArray(cb);
      } else {
        model.find(conditions).toArray(cb);
      }
    });
  }

  update(query, data, cb) {
    // data.birthDate = new Date(data.birthDate);

    console.log(data);

    var err = this.validate(data);
    if (err) {
      return cb(err);
    }

    data.updatedAt = new Date();
    var self = this;
    self.updateOne(query, { $set: data }, function (err, result) {
      if (err) {
        return cb(err);
      }
      cb(null, result);
    });
  }

  advancedAggregate(query, options, cb) {
    // do a validation with this.schema
    this.getModel(function (err, model) {
      if (err) {
        return cb(err);
      }
      if (!_.isEmpty(options)) {
        const limit = !_.isEmpty(options) && options.limit ? options.limit : 20;
        const skip = options.skip ? options.skip : 0;
        const sort = options.sort ? options.sort : { _id: -1 };
        model.aggregate(query).skip(skip).limit(limit).sort(sort).toArray(cb);
      } else {
        model.aggregate(query).toArray(cb);
      }
    });
  }
  aggregate(query, cb) {
    // do a validation with this.schema
    this.getModel(function (err, model) {
      if (err) {
        return cb(err);
      }
      model.aggregate(query).toArray(cb);
    });
  }
}

module.exports = assignModel;
