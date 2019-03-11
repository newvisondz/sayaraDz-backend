const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const utils = require("../utils");

const fabricantUserSchema = new Schema({
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
    fabricant: {
        type: Schema.Types.ObjectId,
        ref: "Fabricant",
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

fabricantUserSchema.pre("save", utils.preSaveUser);

fabricantUserSchema.methods.isValidPasswd = utils.isValidPasswd;

fabricantUserSchema.methods.sign = utils.sign;

fabricantUserSchema.methods.toJSON = function () {
    return {
        email: this.email,
        id: this.id,
        isAdmin: this.isAdmin || false,
        token: this.token
    }
};
fabricantUserSchema.virtual("type").get(() => utils.USER_TYPE.FABRICANT);

fabricantUserSchema.statics.getQueryObject = utils.getFabQueryObject;
fabricantUserSchema.statics.type = () => utils.USER_TYPE.FABRICANT;

const FabricantUserModel = mongoose.model("User-Fabricant", fabricantUserSchema);

module.exports = FabricantUserModel