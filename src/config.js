module.exports = {
    atlas_key: "10de0e55-765f-4301-a26a-15dae1585c9e",
    jwt_key: "jwt key",
    mongoUrl: process.env.NODE_ENV == "production" ?
        "mongodb://sayaradz:sayaradz@cluster0-shard-00-00-qfbg2.mongodb.net:27017,cluster0-shard-00-01-qfbg2.mongodb.net:27017,cluster0-shard-00-02-qfbg2.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true" :
        "mongodb://localhost:27017/sayaraDZ",

    dbUser: "",
    userPasswd: "",
    /*fb_app_id: "295799534401543",
    fb_app_secret: "5c58f66aec8e044ea064407b7a776880",
    google_app_id: "395633878963-6ur4sa08rvjhaqqjhsd17b3355vk92ub.apps.googleusercontent.com",
    google_app_secret: "HW6YmVkokkGu9fPPtMj7F-Kx"*/

    fb_app_id: "320960728554804",
    fb_app_secret: "09dd09c8baad300ad2a064e7258973a2",
    google_app_id: "127354430664-hk6dcbqghd155soavfon2hr4ud7sqeli.apps.googleusercontent.com",
    google_app_secret: "LNUZ8oebJ5983ksWj-fZGg4c"
};