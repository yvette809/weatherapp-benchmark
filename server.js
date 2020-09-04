const express = require ("express")
const listEndpoints = require("express-list-endpoints")
const userRouter = require("./src/routes/users/index")
const cityRouter = require("./src/routes/cities/index")

const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cors = require ("cors")

const {
    badRequestHandler,
    forbiddenHandler,
    notFoundHandler,
    genericErrorHandler,
} = require ("./src/errorHandler")


 dotenv.config()

 const server = express()
 console.log(listEndpoints(server))
 server.use(express.json()) 
 server.use (cors())


 server.use("/users", userRouter)
 server.use("/", cityRouter)

server.use(badRequestHandler)
server.use(forbiddenHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)


const port = process.env.PORT 


mongoose.connect("mongodb+srv://evebabe:ub021299@cluster0.znmxg.mongodb.net/Dev-connect",{
    useNewUrlParser:true,
    useUnifiedTopology:true
   
})
.then(
    server.listen(port, ()=>{
        console.log(`something is running on port ${port}`)
    })
    
).catch(error => console.log(error)

)


