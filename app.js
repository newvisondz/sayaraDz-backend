const server = require("./server")
const connect = require("./src/config/db-connection");

connect((err) => {
    if (!err) {
        const PORT = process.env.PORT || 3000;
        server.connect(PORT)
    } else throw err;
})
