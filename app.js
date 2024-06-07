 require('dotenv').config()

const express= require('express')
const app=express()
const port=5500;

//db connection
const dbconnection= require('./db/dbConfigue')

// usre routes middleware file
const userRoutes= require ("./routes/userRoute")



//json middleware to dxtract json data
app.use(express.json())


// usre routes middleware 
app.use("/api/user" ,userRoutes )



async function start(){
    try {
       const result=await dbconnection.execute("select 'test'") 
        await app.listen(port)
       console.log("database connection established");
       console.log(`listening on ${port}`);
    } catch (error) {
        console.log(error.message)
    }
}

start();


