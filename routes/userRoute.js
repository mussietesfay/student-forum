const express= require ("express");
const router=express.Router()


// auth middleware
const authmiddleware= require('../middleware/authmiddleware')


 // user controller
const {register,login,checkUser}=require('../Controller/userController')


// register
router.post('/register',register)

// login user
router.post('/login',login)

// check user
router.get('/check',authmiddleware,checkUser)
 
module.exports=router