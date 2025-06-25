const jwt=require("jsonwebtoken") 
const isAuth = async(req,res,next)=>{
    try{
        const token=req.cookies.token
        if(!token)
        {
            return res.status(400).json({message:'token not found'})
        }
        const verifyToken=await jwt.verify(token,process.env.JWT_SECRET)
       req.userId = verifyToken.userId;
       console.log("Cookies received:", req.cookies);
console.log("Token decoded:", verifyToken);



        next()
    }
    catch(error)
        {
            console.log(error)
            return res.status(500).json({message:"is Auth erro"})
            
        }
}
module.exports=isAuth;