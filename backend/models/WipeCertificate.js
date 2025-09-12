// --- Wipe Certificate Model (ES Module Version) ---
// Location: Bhagalpur, Bihar
// Timestamp: Thursday, 11 September 2025, 11:36 PM IST

import mongoose from 'mongoose';

// This schema defines the structure for storing proof of a data wipe event.
const wipeCertificateSchema = new mongoose.Schema({
  // A reference to the user who performed the wipe.
  // This links this record to a specific document in the 'users' collection.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // The Mongoose model to link to
  },

  // Store a key piece of hardware info for easy searching and identification in the user's dashboard.
  deviceSerial: {
    type: String,
    required: true,
  },

  // This is the most critical piece of data. It is the unique, verifiable
  // SHA-256 fingerprint of the entire JSON object containing the wipe event details.
  // It acts as the immutable proof of the event.
  certificateHash: {
    type: String,
    required: true,
    unique: true, // Guarantees that the same wipe event cannot be certified twice.
  },
}, {
  // Automatically adds `createdAt` and `updatedAt` timestamps to each record.
  timestamps: true,
});

// Create the Mongoose model from the schema.
// The third argument "wipe_certificates" explicitly tells Mongoose to use this collection name in MongoDB.
const WipeCertificate = mongoose.model('WipeCertificate', wipeCertificateSchema, "wipe_certificates");

export default WipeCertificate;

