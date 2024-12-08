require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  loginHistory: [
    {
      dateTime: { type: Date, default: Date.now },
      userAgent: { type: String, required: true },
    },
  ],
});

let User; 

const initialize = async () => {
  try {
    const db = await mongoose.createConnection(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    User = db.model("User", userSchema);
    console.log("Connected to the database successfully!");
    return "Schema created!";
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
    throw err;
  }
};

const registerUser = async (userData) => {
  if (userData.password !== userData.password2) {
    throw new Error("Passwords do not match");
  }

  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = new User({
      userName: userData.userName,
      password: hashedPassword,
      email: userData.email,
      loginHistory: [],
    });

    await newUser.save();
    console.log("User registered:", newUser.userName);
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("User Name already taken");
    } else {
      throw new Error("There was an error encrypting the password: " + error.message);
    }
  }
};

const checkUser = async (userData) => {
  try {
    const user = await User.findOne({ userName: userData.userName });
    if (!user) {
      throw new Error("Unable to find user: " + userData.userName);
    }

    const isMatch = await bcrypt.compare(userData.password, user.password);
    if (!isMatch) {
      throw new Error("Incorrect Password for user: " + userData.userName);
    }

    user.loginHistory.push({
      dateTime: new Date(),
      userAgent: userData.userAgent,
    });

    await User.updateOne(
      { userName: user.userName },
      { $set: { loginHistory: user.loginHistory } }
    );

    return user;
  } catch (err) {
    throw new Error("There was an error verifying the user: " + err.message);
  }
};

module.exports = { initialize, registerUser, checkUser };
