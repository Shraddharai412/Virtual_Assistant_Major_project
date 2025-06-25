const express=require("express");
const { getCurrentUser, updateAssistant, askToAssistant } = require("../Controllers/UserController");
const isAuth=require("../middleware/isAuth")
const upload =require("../middleware/multer")

const userrouter=express.Router()

userrouter.get("/current",isAuth,getCurrentUser)
userrouter.post("/update",isAuth,upload.single("assistantImage"),updateAssistant)
userrouter.post("/asktoassistant",isAuth,askToAssistant)
module.exports=userrouter
