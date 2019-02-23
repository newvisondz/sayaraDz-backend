
function connect(cb){
    const mongoose = require("mongoose");
    const keys = require("./keys");
    mongoose.Promise = global.Promise;
    mongoose.connect(keys.mongoUrl, {useNewUrlParser: true})
        .then(
            ()=>{
                console.log("database connected");
                if(cb) cb(false)
            },
            (err)=> {
                if(cb) cb(err)
            }
        )
}


module.exports = connect;