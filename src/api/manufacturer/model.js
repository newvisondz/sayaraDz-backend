const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const ManufacturerSchema = new Schema({
    marque: {
        type: String,
        required: true,
        unique: true,
        validate: validator.isAlphanumeric
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})
ManufacturerSchema.statics.getQueryObject = (query) => {
    let {
        marque,
        createdOn
    } = query;
    const q = {
        marque,
        createdOn
    };
    for (let prop in q)
        if (!q[prop]) delete q[prop];

    return q
}
ManufacturerSchema.methods.toJSON = function () {
    return {
        id: this.id,
        marque: this.marque,
        logo: this.logo,
        error: this.error,
        createdOn: this.createdOn
    }
}
const ManufacturerModel = mongoose.model("fabricant", ManufacturerSchema);

module.exports = ManufacturerModel;