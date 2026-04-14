import { User } from '../models/user_model.js';

class UserDao {
  async upsertUser(profile) {
    const email = profile.email || `user-${Date.now()}@example.com`;

    return User.findOneAndUpdate(
      { email },
      {
        name: profile.name || 'AI Loan User',
        email,
        phone: profile.phone || '',
        location: profile.location || '',
        occupation: profile.occupation || '',
        dob: profile.dob || '',
        avatarUrl: profile.avatarUrl || '',
        settings: profile.settings || {}
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
  }

  async findUserByEmail(email) {
    return User.findOne({ email }).lean();
  }
}

export const userDao = new UserDao();