import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    occupation: { type: String, default: '' },
    dob: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    settings: {
      notifications: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: false },
      twoFactor: { type: Boolean, default: true },
      biometrics: { type: Boolean, default: true },
      cloudSync: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);