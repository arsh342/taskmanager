// Import file system and path modules for backup operations
const fs = require('fs');
const path = require('path');

const TASKS_FILE = 'tasks.json'; // File to backup/restore
const BACKUP_DIR = 'backups'; // Directory to store backups

// Ensure the backup directory exists
function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
  }
}

// Create a backup of the tasks file
function backupTasks() {
  ensureBackupDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(BACKUP_DIR, `tasks-backup-${timestamp}.json`);
  fs.copyFileSync(TASKS_FILE, backupFile);
  return backupFile;
}

// Restore tasks from a backup file
function restoreTasks(backupFile) {
  if (fs.existsSync(backupFile)) {
    fs.copyFileSync(backupFile, TASKS_FILE);
    return true;
  }
  return false;
}

// List all backup files
function listBackups() {
  ensureBackupDir();
  return fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json'));
}

// Export backup/restore functions
module.exports = { backupTasks, restoreTasks, listBackups };
