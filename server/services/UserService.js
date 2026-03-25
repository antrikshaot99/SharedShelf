const { User } = require('../models');
const jwt = require('jsonwebtoken');
const admin = require('../utils/adminCreds');

const JWT_SECRET = process.env.JWT_SECRET || 'booknest_secret_key_2026';

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
    // Check for hardcoded admin credentials
    if (email === admin.email && password === admin.password) {
      const adminUser = {
        id: 0,
        name: 'Admin',
        email: admin.email,
        role: 'admin'
      };
      const token = this.generateToken(adminUser);
      return { token, user: adminUser };
    }

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
}

module.exports = UserService;
