function connect(){
    const mongoose = require("mongoose")
    mongoose.Promise = require("bluebird");
    mongoose.connect('mongodb://localhost:27017/gen', {useNewUrlParser: true})
        .then(
            ()=>console.log("connected"),
            (err)=> {throw err}
        )
}
module.exports = connect;