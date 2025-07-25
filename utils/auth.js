// Import file system module for user file operations
const fs = require('fs');
const USERS_FILE = 'users.txt'; // File to store user credentials

// Ensure the users file exists
function ensureUsersFile() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '');
  }
}

// Get all users from the users file
function getUsers() {
  ensureUsersFile();
  return fs.readFileSync(USERS_FILE, 'utf-8').split('\n').filter(Boolean);
}

// Authenticate a user by username and password
function authenticate(username, password) {
  const users = getUsers();
  for (const line of users) {
    const [user, pass] = line.split(':');
    if (user === username && pass === password) {
      return true;
    }
  }
  return false;
}

// Register a new user
function register(username, password) {
  fs.appendFileSync(USERS_FILE, `${username}:${password}\n`);
}

// Export authentication and user management functions
module.exports = { authenticate, register, ensureUsersFile, getUsers };
