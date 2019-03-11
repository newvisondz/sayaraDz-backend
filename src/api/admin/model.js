const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const utils = require("../utils");

const AdminSchema = new Schema({
    email: {type: String, index:true, unique: true, require: true, validate: validator.isEmail, trim: true},
    password: {type: String, require: true, minlength:4},
    createdOn: {type: Date, default: Date.now}
});

AdminSchema.pre("save", utils.preSaveUser);

AdminSchema.methods.isValidPasswd = utils.isValidPasswd ;

AdminSchema.methods.sign = utils.sign ;

AdminSchema.virtual("type").get(()=>utils.USER_TYPE.ADMIN) ;
//for testing admins
AdminSchema.methods.toJSON = function () {
    return {
        email: this.email,
        id: this.id,
        token: this.token
    }
};

AdminSchema.statics.getQueryObject = utils.getAdminQueryObject;

AdminSchema.statics.type = ()=>utils.USER_TYPE.ADMIN;

const AdminModel = mongoose.model("Admin", AdminSchema);



module.exports = AdminModel;