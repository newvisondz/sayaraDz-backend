function connect(cb){
    const mongoose = require("mongoose")
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost:27017/gen', {useNewUrlParser: true})
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