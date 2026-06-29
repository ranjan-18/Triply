// scripts/listUsers.js
import mongoose from "mongoose";
import env from "../server/config/env.js";
import User from "../server/modules/auth/auth.model.js";

(async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const users = await User.find({}).select("name email").lean();
    console.log("Users:", users);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.disconnect();
  }
})();
