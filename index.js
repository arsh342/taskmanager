#!/usr/bin/env node

// Import main menu and login menu
const { loginMenu } = require('./utils/loginMenu'); // Login/register logic
const { mainMenu } = require('./utils/taskMenu'); // Main task menu

const figlet = require('figlet'); // For ASCII art banner
const boxenImport = require('boxen'); // For CLI boxes
const boxen = boxenImport.default || boxenImport;
const chalkImport = require('chalk'); // For colored output
const chalk = chalkImport.default || chalkImport;

// Main entry point for the CLI app
async function start() {
  const { getSession } = require('./utils/session'); // Session management
  // Show banner
  const banner = figlet.textSync('Task Manager', { horizontalLayout: 'default' });
  console.log(boxen(chalk.cyan(banner), { padding: 1, borderColor: 'green', borderStyle: 'double' }));
  // Loop: login, then main menu, repeat if user logs out
  while (true) {
    await loginMenu();
    await mainMenu();
    // If session is cleared, show login again; if still logged in, exit
    if (!getSession()) continue;
    else break;
  }
}

// Start the CLI
start();
