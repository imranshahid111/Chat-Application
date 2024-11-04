import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import generateTokenandSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullname, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      fullname,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" 
        ? `https://avatar.iran.liara.run/public/boy?username=${username}` 
        : `https://avatar.iran.liara.run/public/girl?username=${username}`,
    });

    await newUser.save();
    generateTokenandSetCookie(newUser._id, res);

    res.status(201).send({
      message: "User created successfully",
      newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateTokenandSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullname,
			username: user.username,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt","",{maxAge : 0})
    res.status(200).send({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
