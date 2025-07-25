// Import file system module for session file operations
const fs = require('fs');
const SESSION_FILE = 'session.json'; // File to store session info

// Set the current session (simulate cookie)
function setSession(username) {
  fs.writeFileSync(SESSION_FILE, JSON.stringify({ username }, null, 2));
}

// Get the current session username
function getSession() {
  if (!fs.existsSync(SESSION_FILE)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'));
    return data.username || null;
  } catch {
    return null;
  }
}

// Clear the current session (logout)
function clearSession() {
  if (fs.existsSync(SESSION_FILE)) fs.unlinkSync(SESSION_FILE);
}

// Export session management functions
module.exports = { setSession, getSession, clearSession };
