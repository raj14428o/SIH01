// --- Secure User Model ---
// Location: Bhagalpur, Bihar
// Timestamp: Thursday, 11 September 2025, 8:55 PM IST

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


// Define the structure of the User document
const userSchema = new mongoose.Schema({
    // Defines user role, defaulting to 'user'
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'], // Role must be one of these values
        required: true
    },
    // User's full name
    name:{
        type: String,
        required: [true, "Please provide your name."],
        trim: true // Removes leading/trailing whitespace
    },
    // User's email address, must be unique
    email: {
        type: String,
        required: [true, "Please provide an email."],
        unique: true,
        trim: true,
        // Regular expression to validate email format
        match: [/.+\@.+\..+/, 'Please fill a valid email address.']
    },
    // A short user biography
    bio: {
        type: String,
        default: '',
        trim: true
    },
    // URL to the user's profile picture
    avatar: {
        type: String,
        trim: true,
        default: 'https://i.pravatar.cc/150' // Provides a random default avatar
    },
    // Stores the secure hash of the user's password, not the password itself
    passwordHash: {
        type: String,
        required: [true, "Password is required."],
    }
}, { 
    // Automatically adds `createdAt` and `updatedAt` fields
    timestamps: true 
});


// --- Mongoose Middleware for Password Hashing ---
// This function runs automatically *before* a user document is saved (`.pre('save', ...)`).
// It's the most secure way to ensure passwords are never stored in plain text.
userSchema.pre('save', async function(next) {
    // We only want to re-hash the password if it's being created or changed.
    // This prevents re-hashing on profile updates (e.g., changing a bio).
    if (!this.isModified('passwordHash')) {
        return next();
    }

    try {
        // Generate a "salt" - a random string to add to the password before hashing.
        // This ensures that even if two users have the same password, their hashes will be different.
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt and update the document.
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
        next(); // Proceed with the save operation
    } catch (error) {
        next(error); // Pass any errors to the next middleware
    }
});


// --- Mongoose Instance Method for Password Comparison ---
// This adds a custom helper method (`comparePassword`) to every user document retrieved from the DB.
// It allows for a clean and secure way to check passwords during login.
userSchema.methods.comparePassword = async function(candidatePassword) {
    // `bcrypt.compare` securely compares the plain-text password from the login attempt
    // with the stored hash in the database. It returns true if they match, false otherwise.
    return await bcrypt.compare(candidatePassword, this.passwordHash);
};


// Create the Mongoose model from the schema.
// The third argument "users" explicitly tells Mongoose to use the collection named "users".
const User = mongoose.model('User', userSchema, "users");

export default User;

