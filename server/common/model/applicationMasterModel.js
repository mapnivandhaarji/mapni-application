const ModelBase = require("./modelBase");
const CONFIG = require("../../config");
const _ = require("lodash")

class applicationMasterModel extends ModelBase {
    constructor() {
        super(CONFIG.DB.MONGO.DB_NAME, "applicationMaster", {
            applicantName: { type: String, allowNullEmpty: true },
            applicantMobileNo: { type: String, allowNullEmpty: true },
            applicantAddress: { type: String, allowNullEmpty: true },
            district: { type: String, allowNullEmpty: true },
            taluka: { type: String, allowNullEmpty: true },
            village: { type: String, allowNullEmpty: true },
            applicationFullDate: { type: String, allowNullEmpty: true },
            applicationYear: { type: String, allowNullEmpty: true },
            applicationMonth: { type: String, allowNullEmpty: true },
            applicationDate: { type: String, allowNullEmpty: true },
            newServeNo: { type: String, allowNullEmpty: true },
            oldServeNo: { type: String, allowNullEmpty: true },
            MTRno: { type: String, allowNullEmpty: true },
            // isEditAllows: { type: Boolean, allowNullEmpty: true },
            status: {
                type: Number,
                allowNullEmpty: false,
                enum: { 1: "active", 2: "inactive" }
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

        data.createdAt = new Date();;
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
                const limit = (!_.isEmpty(options) && options.limit) ? options.limit : 20;
                const skip = options.skip ? options.skip : 0;
                const sort = options.sort ? options.sort : { _id: -1 };
                model.find(conditions).sort(options.sort).skip(options.skip).limit(options.limit).toArray(cb);
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
                const limit = (!_.isEmpty(options) && options.limit) ? options.limit : 20;
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

module.exports = applicationMasterModel;