import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import User from "../models/userModel.js";
import { sendingContactMail } from "../utils/sendingMails.js";

const register = async (req, res) => {
  let {
    username,
    email,
    password,
    DOB,
    description,
    role,
  } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(401).json({
        message: "Email already used",
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(401).json({
        message: "Username already used",
      });
    }

    // Hash the password before saving
    const saltRounds = 10;
    password = await bcrypt.hash(password, saltRounds);

    // Check if an image was uploaded
    const image = req.file ? req.file.path : null;

    await User.create({
      username,
      email,
      password,
      DOB,
      description,
      role,
      image,
    });

    return res.status(201).json({
      message: "User successfully created, please log in to your account!",
      success: true,
    });
  } catch (error) {
    console.error(error);

    //image upload/download errors
    if (error.code === "ENOENT") {
      return res.status(400).json({
        error: "Image not found or invalid path",
      });
    }

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const jwtToken = generateToken(user);
    res.cookie("accessToken", jwtToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true, // Set to true in production (requires HTTPS)
    });

    return res.status(200).json({
      message: "User logged in",
    });
  } catch (err) {
    return res.status(401).json({ message: err.message, success: false });
  }
};

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const users = await User.find()
      .limit(parseInt(limit, 10))
      .skip(parseInt(offset, 10));

    return res.status(200).json({
      data: users,
      success: true,
      message: "Users list",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const getUser = async (req, res) => {
  const { id } = req.userData;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.status(200).json({
      data: user,
      success: true,
      message: "User found",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};


const getUserById = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.status(200).json({
      data: user,
      success: true,
      message: "User found",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);
    let {
      username,
      email,
      password,
      DOB,
      role,
      description,
    } = req.body;

    if (password) {
      // Hash the password before saving
      const saltRounds = 10;
      password = await bcrypt.hash(password, saltRounds);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imagePath = null;

    if (req.file) {
      imagePath = req.file.path;
    }

    await User.findByIdAndUpdate(id, {
      username,
      email,
      password,
      DOB,
      description,
      role,
      image: imagePath || user.image,
    });


    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('accessToken');
    res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const sendingEmail = async (req, res) => {
  try {
    const { name,email,message } = req.body;


    await sendingContactMail(name,email,message)
    return res.status(200).json({ message: "email send succ" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export { register, login, getUsers, getUser, updateProfile, deleteUser, logout, getUserById,sendingEmail };
