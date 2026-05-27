import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import connectDB from "./src/config/database.js";
import User from "./src/models/user.model.js";
import { config } from "./src/config/config.js";

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

const run = async () => {
  try {
    await connectDB();

    const email = "dummy.user@example.com";
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const token = generateToken(existingUser._id);
      console.log("Dummy user already exists:");
      console.log(JSON.stringify({
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        department: existingUser.department,
        token,
      }, null, 2));
      process.exit(0);
    }

    const user = await User.create({
      name: "Dummy User",
      email,
      password: "DummyPassword123!",
      role: "employee",
      department: "Engineering",
      managerId: null,
    });

    const token = generateToken(user._id);

    console.log("Dummy user created successfully:");
    console.log(JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      token,
    }, null, 2));
    process.exit(0);
  } catch (error) {
    console.error("Failed to create dummy user:", error);
    process.exit(1);
  }
};

run();
