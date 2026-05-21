const { User } = require('../models');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sharedshelf_secret_key_2026';

class UserService {
  /**
   * Generate JWT token for authenticated user
   */
  static generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  /**
   * Register a new user
   */
  static async register(name, email, password) {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new Error('Email already registered');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'user'
    });

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    };
  }

  /**
   * Authenticate user with email and password
   */
  static async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    };
  }

  /**
   * Get current authenticated user
   */
  static async getMe(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Get all users (admin only)
   */
  static async getAll() {
    return await User.findAll({
      attributes: { exclude: ['password'] }
    });
  }

  /**
   * Get user by ID
   */
  static async getById(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Update user role (admin only)
   */
  static async updateRole(userId, role) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.role = role;
    await user.save();

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  /**
   * Delete user (admin only)
   */
  static async delete(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const deletedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    await user.destroy();
    return deletedUser;
  }

  /**
   * Find or create user by Firebase UID
   * This is used when authenticating with Firebase
   */
  static async findOrCreateByFirebaseUid(firebaseUid, email, displayName) {
    // Try to find existing user by Firebase UID
    let user = await User.findOne({ where: { firebaseUid } });

    if (user) {
      return user;
    }

    // Check if user with this email already exists
    user = await User.findOne({ where: { email } });

    if (user) {
      // Update existing user with Firebase UID
      user.firebaseUid = firebaseUid;
      await user.save();
      return user;
    }

    // Create new user
    user = await User.create({
      firebaseUid,
      email,
      name: displayName || email.split('@')[0],
      password: null, // No password for Firebase auth
      role: 'user'
    });

    return user;
  }

  /**
   * Get user by Firebase UID
   */
  static async getByFirebaseUid(firebaseUid) {
    const user = await User.findOne({ where: { firebaseUid } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Get user by email (returns null if not found, doesn't throw)
   */
  static async getByEmail(email) {
    return await User.findOne({ 
      where: { email },
      attributes: { exclude: ['password'] }
    });
  }
}

module.exports = UserService;
