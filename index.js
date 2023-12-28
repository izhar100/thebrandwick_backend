const express=require("express")
const cors=require("cors")
const { connection } = require("./connection")
const { userRouter } = require("./route/userRoute")
const app=express()

app.use(express.json())
app.use(cors())

app.use("/user",userRouter)

app.listen(8000,async()=>{
    try {
        await connection;
        console.log("connected to database")
        console.log("server is running at port:8000")
    } catch (error) {
        console.log("error connecting to database")
        console.log(error)
    }
})