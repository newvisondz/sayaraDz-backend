const server = require("./server")
const connect = require("./src/services/database");

connect((err) => {
    if (!err) {
        const PORT = process.env.PORT || 3000;
        server.connect(PORT)
    } else throw err;
})
