//db
const dbconnection=require('../db/dbConfigue')
const bcrypt= require ('bcrypt')
const {StatusCodes}= require ('http-status-codes')
const jwt =require('jsonwebtoken')

// register
async function register(req,res){
   const {username, firstname, lastname,email, password}=req.body;
   if (!username||!firstname||!lastname||!email||!password) {
       return res.status(StatusCodes.BAD_REQUEST).json({msg: "please provide all require information"})
   }

   try {
    const [user]=await  dbconnection.query("SELECT username,userid from users where username= ? or email= ? ", [username, email])
 if (user.length>0) {
    return res.status(StatusCodes.BAD_REQUEST).json({msg: "user already existed"})
 }
 if (password.length<=8) {
    return res.status(StatusCodes.BAD_REQUEST).json({msg: "password must be 8 characters"})
 }
    

 // encrypt password
    const salt= await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(password,salt)
    await dbconnection.query("INSERT INTO users(username, firstname, lastname,email, password) VALUES(?,?,?,?,?)",[username, firstname, lastname,email, hashedPassword])
      
    return res.status(StatusCodes.CREATED).json({msg:"user register"})
    
   } catch (error) {
    console.log(error.message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"something went wrong, try again later!"})
    
   }
}


//login
async function login(req,res){
   const {email, password}=req.body;
   if (!email||!password) {
       return res.status(StatusCodes.BAD_REQUEST).json({msg: "please provide all require information"})
   }
   try {
      const [user]=await dbconnection.query("SELECT username, userid, password from users where email=?", [email])
      if (user.length==0) {
         return res.status(StatusCodes.BAD_REQUEST).json({msg: "invalid creddential"})
      }
       // compare password
           const isMatch= await bcrypt.compare(password,user[0].password)
           if (!isMatch) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: "invalid password"})
           }
           const username=user[0].username;
           const userid =user[0].userid;
           const token= jwt.sign({username,userid},"secret",{expiresIn:"1d"})
       return res.status(StatusCodes.OK).json({msg:"user login successful", token})


   } catch (error) {
   console.log(error.message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"something went wrong, try again later!"})
   }
}

//checkUser
async function checkUser(req,res){
   const username=req.user.username;
   const userid=req.user.userid;

    res.status(StatusCodes.OK).json({msg:"valid user",username,userid})
}

module.exports={register,login,checkUser}