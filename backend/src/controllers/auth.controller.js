import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { upsertStreamUser } from "../db/stream.js";

export const signup = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({
        message: "Please provide all the required fields",
      });
    }
    if (!password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const emailRegrex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegrex.test(email)){
      return res.status(400).json({
        message: "Invalid email format"
      })
    }

    const existingUser = User.findOne({email});
    if(existingUser){
      return res.status(400).json({
        message: "Email already exists, please use a difference one"
      })
    }

    const idx = Math.floor(Math.random() * 100) + 1; // generate a num between [1,100]
    const randomAvatar = `https://avatar.iran.liara.run/public/12`

    const newUser = await User.create({
      email: email,
      fullName:fullName,
      password:password,
      profilePic:randomAvatar
    })
    try{
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image:newUser.profilePic || "",   
      })
      console.log( `Stream user created for ${newUser.fullName}`)
    } catch(error){
      console.log("Error creating stream user: ", error)
    }

    const token = jwt.sign(
      {
        userId: newUser._id
      }, process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d"
      }
    );

    res.cookie("jwt", token,{
        maxAge: 7 * 24 * 60 * 1000,
        httpOnly: true, // prevent XSS attacks
        sameSite: "strict", // prevent CSRF attacks
        secure:process.env.NODE_ENV === 'prdoduction'
    })

    res.status(201).json({
      success:true,
      User: newUser,
    })

  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({
      message: "Internal Server Error"
    })
  }
};


export const login = async (req,res)=> {
  try {
    const {email, password} = req.body;

    if(!email || !password){
      return res.status(400).json({
        message: "All fields are required"
      })
    }

    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({
        message: "Invalid email or password"
      })}

    const isPasswordCorrect = await User.matchPassword(password);

    if(!isPasswordCorrect){
      return res.status(401).json({
        message: "Invalid email or password"
      })
    }

    const token = jwt.sign({
      userId: user._id
    }, process.env.JWT_SECRET_KEY,{
      expiresIn:"7d"
    })
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks,
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    })

    res.status(200).json({
      success:true,
      user
    })

  } catch (error) {
    console.log("Error in login controller", error.message)    
    res.status(500).json({
      message: "Internal Server Error"
    })
  }
}

export const logout = async (req,res)=> {
    res.clearCookie("jwt")
    res.status(200).json({
      success:true,
      message: "Logout successful"
    })
}