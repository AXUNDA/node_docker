const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const session = require("express-session")
const {MONGO_USER,MONGO_PASSWORD,MONGO_IP,MONGO_PORT,SESSION_SECRET,REDIS_PORT,REDIS_URL} = require('./config/config.js')

const redis = require("redis")
let RedisStore = require("connect-redis")(session)
let redisClient = redis.createClient({
      host:REDIS_URL,
      port:REDIS_PORT ,
      
})
const app = express()
const connectWithRetry= ()=>{
      const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
mongoose.connect(MONGO_URL,{
      useNewUrlParser:true,
      useUnifiedTopology:true,

}).then(()=>{console.log("connected to the database")}).catch((e)=>{console.log(e)
      setTimeout(connectWithRetry,5000)



})


}
const postRouter = require("./routes/postRoute")
const userRouter = require("./routes/userRoute")
connectWithRetry()
app.enable("trust proxy")
app.use(cors({
      origin:"*"
}))
app.use(
      session({
        store: new RedisStore({ client: redisClient }),
        secret: SESSION_SECRET,
      

        cookie:{
            secure:false,
            resave:false,
            saveUninitialized:false,


            httpOnly:true,
            maxAge:60000 * 100,
        }
      })
    )
app.get("/api/v1",(req, res) => {
      res.send("<h2>hello world !!!</h2>")
      console.log("we are live ")
})
app.use(express.json())
app.use("/api/v1/posts",postRouter)
app.use("/api/v1/users", userRouter)

const PORT =process.env.PORT ||3000
app.listen(PORT, function () {
      console.log(`listening on ${PORT}`)
})