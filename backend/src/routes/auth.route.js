import { Router } from "express";

const authRoutes = Router();

authRoutes.get("/signup", (req,res) => {
    res.send("signup route")
})

authRoutes.get("/signin", (req,res) => {
    res.json({
        message: "Signin successful"
    })
})

authRoutes.get("/logout", (req,res) => {
    res.json({
        message: "Logout successful"
    })
})

export {authRoutes};