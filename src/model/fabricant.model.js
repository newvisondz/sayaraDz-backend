const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const utils = require("./utils.model");

const fabricantSchema = new Schema({
    marque: {type: String, required: true, unique: true, validate: validator.isAlphanumeric},
    createdOn: {type: Date, default: Date.now}
});
fabricantSchema.statics.getQueryObject = (query)=>{
    let {marque, createdOn} = query;
    const q = {marque, createdOn};
    for(let prop in q) if(!q[prop]) delete q[prop];

    return q
};
fabricantSchema.methods.toJSON = function () {
    return {
        id: this.id,
        marque: this.marque,
        logo: this.logo,
        error: this.error,
        createdOn: this.createdOn
    }
};
const FabricantModel = mongoose.model("fabricant", fabricantSchema);
// FabricantModel.create({marque: "Toyota"})
module.exports = FabricantModel;