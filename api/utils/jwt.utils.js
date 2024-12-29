import jwt from "jsonwebtoken";


export const genToken = async(userId,res)=>{
  try {
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
      expiresIn: "1h",
    })
    res.cookie("a-token",token,{
      httpOnly:true,
      expires: new Date(Date.now() + 60 * 60 * 1000),
    })
    return token;
  } catch (error) {
    console.log(error);
    return res.statis(500).json({code:0,message:"error in gen token"})
  }
}