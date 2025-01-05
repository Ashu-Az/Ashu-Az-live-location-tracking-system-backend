// src/middleware/admin.js
import { User } from '../models/User.js';

export const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.isAdmin) {
      throw new Error('Admin access required');
    }
    next();
  } catch (err) {
    res.status(403).json({ error: 'Admin access denied' });
  }
};

