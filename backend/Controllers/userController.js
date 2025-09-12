import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Make sure you have a User model defined

// This function assumes your User model handles password hashing automatically
// using a pre-save hook with a library like bcrypt.

const generateToken = (userId, email, role) => {
  return jwt.sign({ userId, email, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({ error: 'Please provide all fields (password >= 6 chars).' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) return res.status(400).json({ error: 'Email already in use.' });

    // ... inside registerUser function
const user = await User.create({ name, email: email.toLowerCase(), passwordHash: password }); // Corrected line
    const token = generateToken(user._id, user.email, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user && (await user.comparePassword(password))) { // Assumes comparePassword method exists on your model
      const token = generateToken(user._id, user.email, user.role);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    } else {
      res.status(401).json({ error: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

// Logout User
export const logoutUser = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};