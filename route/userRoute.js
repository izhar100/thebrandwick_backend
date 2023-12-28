const express=require("express");
const { User } = require("../model/userModel");
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
require("dotenv").config()
const userRouter=express.Router()

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
  
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const token = jwt.sign(
        { userId: existingUser._id, email: existingUser.email },
        process.env.secretKey,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({message:"Login success", token, user: existingUser });
    } catch (error) {
      res.status(500).json({ error: "Login failed", error: error.message });
    }
  });

userRouter.post("/signup", async (req, res) => {
    const { name, username, email, phone, password } = req.body;
  
    try {
      // Check if the email already exists in the database
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        username,
        email,
        phone,
        password: hashedPassword, 
      });
  
      await newUser.save();
  
      const token = jwt.sign(
        { userId: newUser._id, email: newUser.email },
        process.env.secretKey,
        { expiresIn: "1h" }
      );
  
      res.status(201).json({message:"Account created", token, user: newUser });
    } catch (error) {
      res.status(500).json({ error: "Signup failed", error: error.message });
    }
  });


module.exports={
    userRouter
}