import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
      const { name, dob, gender, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ msg: "User already exists" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = new User({
          name,
          dob,
          gender,
          email,
          password: hashedPassword,
      });

      // Save to DB
      await newUser.save();

      res.status(201).json({ msg: "User registered successfully" });

  } catch (error) {
      console.error("❌ Error in registerUser:", error);
      res.status(500).json({ msg: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {

      const { email, password } = req.body;

      if (!email || !password) {
          return res.status(400).json({ error: "Email and password are required." });
      }

      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).json({ error: "Invalid email or password." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ error: "Invalid email or password." });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({ token });
  } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Server error. Please try again later." });
  }
};


