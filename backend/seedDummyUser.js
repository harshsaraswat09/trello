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

    const seedUsers = [
      {
        name: "System Admin",
        email: "admin.user@example.com",
        password: "AdminPassword123!",
        role: "admin",
        department: "Executive",
      },
      {
        name: "Dummy Manager",
        email: "manager.user@example.com",
        password: "ManagerPassword123!",
        role: "manager",
        department: "Engineering",
      },
      {
        name: "Dummy User",
        email: "dummy.user@example.com",
        password: "DummyPassword123!",
        role: "employee",
        department: "Engineering",
      },
      {
        name: "QA User",
        email: "qa.user@example.com",
        password: "QaPassword123!",
        role: "employee",
        department: "QA",
      },
    ];

    const results = [];

    for (const seed of seedUsers) {
      let user = await User.findOne({ email: seed.email });

      if (!user) {
        user = await User.create({
          ...seed,
          managerId: null,
        });
      }

      results.push({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: seed.password,
        role: user.role,
        department: user.department,
        token: generateToken(user._id),
      });
    }

    console.log("Seed users ready:");
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed users:", error);
    process.exit(1);
  }
};

run();
