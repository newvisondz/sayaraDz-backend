const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const utils = require("../utils");

const ManufacturerUserSchema = new Schema({
    email: {
        type: String,
        index: true,
        unique: true,
        require: true,
        validate: validator.isEmail,
        trim: true
    },
    password: {
        type: String,
        require: true,
        minlength: 4
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    isAdmin: Boolean,
    manufacturer: {
        type: Schema.Types.ObjectId,
        ref: "Fabricant",
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

ManufacturerUserSchema.pre("save", utils.preSaveUser);

ManufacturerUserSchema.methods.isValidPasswd = utils.isValidPasswd;

ManufacturerUserSchema.methods.sign = utils.sign;

ManufacturerUserSchema.methods.toJSON = function () {
    return {
        email: this.email,
        id: this.id,
        isAdmin: this.isAdmin || false,
        token: this.token
    }
};
ManufacturerUserSchema.virtual("type").get(() => utils.USER_TYPE.FABRICANT);

ManufacturerUserSchema.statics.getQueryObject = utils.getFabQueryObject;
ManufacturerUserSchema.statics.type = () => utils.USER_TYPE.FABRICANT;

const ManufacturerUser = mongoose.model("Manufacturer-user", ManufacturerUserSchema);

module.exports = ManufacturerUser