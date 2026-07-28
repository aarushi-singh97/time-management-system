const bcrypt = require('bcrypt');
const { createUser, findUserByEmail } = require('../models/userModel');
const generateToken = require('../utils/generateToken');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createUserResponse(user) {
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
  };
}

async function registerUser(request, response, next) {
  try {
    const { full_name: fullName, email, password } = request.body || {};
    const normalizedEmail = email?.trim().toLowerCase();

    if (!fullName?.trim() || !normalizedEmail || !password) {
      return response.status(400).json({ message: 'Full name, email, and password are required.' });
    }

    if (!emailPattern.test(normalizedEmail)) {
      return response.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (password.length < 8) {
      return response.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return response.status(409).json({ message: 'An account with this email already exists.' });
    }

    // bcrypt adds a random salt before hashing, so identical passwords have different hashes.
    const passwordHash = await bcrypt.hash(password, 10);
    // Public registration creates executive accounts. Admin and secretary accounts are managed by an admin.
    const role = 'executive';
    const userId = await createUser(fullName.trim(), normalizedEmail, passwordHash, role);

    return response.status(201).json({
      message: 'User registered successfully.',
      user: { id: userId, full_name: fullName.trim(), email: normalizedEmail, role },
    });
  } catch (error) {
    next(error);
  }
}

async function loginUser(request, response, next) {
  try {
    const { email, password } = request.body || {};
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return response.status(400).json({ message: 'Email and password are required.' });
    }

    if (!emailPattern.test(normalizedEmail)) {
      return response.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const user = await findUserByEmail(normalizedEmail);
    if (!user || !user.is_active) {
      return response.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return response.status(401).json({ message: 'Invalid email or password.' });
    }

    return response.status(200).json({
      token: generateToken(user.id),
      ...createUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
}

function getProfile(request, response) {
  return response.status(200).json({ user: createUserResponse(request.user) });
}

function logoutUser(request, response) {
  return response.status(200).json({
    message: 'Logged out successfully. Remove the token from localStorage on the client.',
  });
}

module.exports = { registerUser, loginUser, getProfile, logoutUser };
