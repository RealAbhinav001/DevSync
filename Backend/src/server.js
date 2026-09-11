require("dotenv").config()
const app = require("./app");
const config = require("./config/config.js")
const connectDB = require("./config/db.js")
const http = require("http")
const server = http.createServer(app)
const {setIo} = require("./modules/realTime/socketManager.js")
const {Server} = require("socket.io")
const io = new Server(server,{
    cors:{
        origin:config.CLIENT_URL,
        methods:["GET","POST"]
    }
    
})

setIo(io)
const setUpSocket = require("./modules/realTime/socket.js")

const startServer = async ()=>{
    try{
        await connectDB();

        setUpSocket(io)

        server.listen(config.PORT || 5000,()=>{
            console.log("Backend Running")
        })
    }
    catch(error){
        console.log(error)
    }
}

startServer()