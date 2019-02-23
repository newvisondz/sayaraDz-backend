const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const utils = require("./utils.model");

const providers = ["google", "facebook"];

const AutoMobiliste = new Schema({
    email: {type: String, index:true, unique: true, validate: validator.isEmail, trim: true},
    password: {type: String, minlength:4},
    providers: [
        {
            name: {type: String, enum: providers},
            id: {type: String, validate: ()=>{}}

        }
        ],
    createdOn: {type: Date, default: Date.now}
});

AutoMobiliste.pre("save", utils.preSaveUser);

AutoMobiliste.methods.isValidPasswd = utils.isValidPasswd ;

AutoMobiliste.methods.sign = utils.sign ;


AutoMobiliste.methods.toJSON = function () {
    return {
        email: this.email,
        id: this.id,
        token: this.token
    }
};

const Automobiliste = mongoose.model("Automobiliste", AutoMobiliste);

AutoMobiliste.statics.getQueryObject = utils.getAdminQueryObject;

module.exports = Automobiliste;