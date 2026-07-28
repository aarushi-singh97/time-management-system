const databasePool = require('../config/database');

async function findUserByEmail(email) {
  const [users] = await databasePool.execute(
    `SELECT id, full_name, email, password_hash, role, is_active, created_at
     FROM users WHERE email = ?`,
    [email]
  );

  return users[0];
}

async function findUserById(userId) {
  const [users] = await databasePool.execute(
    `SELECT id, full_name, email, role, is_active, created_at
     FROM users WHERE id = ?`,
    [userId]
  );

  return users[0];
}

async function createUser(fullName, email, passwordHash, role) {
  const [result] = await databasePool.execute(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES (?, ?, ?, ?)`,
    [fullName, email, passwordHash, role]
  );

  return result.insertId;
}

module.exports = { findUserByEmail, findUserById, createUser };
