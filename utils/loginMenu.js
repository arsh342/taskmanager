// Import required modules and dependencies
const inquirer = require('inquirer').default || require('inquirer'); // CLI prompts
const boxenImport = require('boxen'); // For CLI boxes
const boxen = boxenImport.default || boxenImport;
const chalkImport = require('chalk'); // For colored output
const chalk = chalkImport.default || chalkImport;
const { authenticate, register, ensureUsersFile, getUsers } = require('./auth'); // Auth functions

// Login and registration menu logic
async function loginMenu() {
  ensureUsersFile(); // Make sure user file exists
  const { setSession, getSession } = require('./session'); // Session management
  // If session exists, skip login
  const sessionUser = getSession();
  if (sessionUser) {
    console.log(chalk.green(`Welcome back, ${sessionUser}!`));
    return sessionUser;
  }
  let loggedIn = false;
  while (!loggedIn) {
    try {
      // Prompt user to login or register
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Login or Register?',
          choices: [
            { name: '1. Login', value: 'login' },
            { name: '2. Register', value: 'register' }
          ]
        }
      ]);

      // Registration flow
      if (action === 'register') {
        // Prompt for username and password
        const { username, password } = await inquirer.prompt([
          {
            type: 'input',
            name: 'username',
            message: 'Choose a username:',
            validate: input => {
              if (!input || input.trim().length < 3) return 'Username must be at least 3 characters.';
              if (/[^a-zA-Z0-9_]/.test(input)) return 'Username can only contain letters, numbers, and underscores.';
              // Check if user already exists
              const users = getUsers();
              if (users.some(line => line.split(':')[0] === input)) return 'Username already exists.';
              return true;
            }
          },
          {
            type: 'password',
            name: 'password',
            message: 'Choose a password:',
            mask: '*',
            validate: input => {
              if (!input || input.length < 8) return 'Password must be at least 8 characters.';
              if (!/[A-Z]/.test(input)) return 'Password must contain at least one uppercase letter.';
              if (!/[0-9]/.test(input)) return 'Password must contain at least one number.';
              if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(input)) return 'Password must contain at least one special character.';
              return true;
            }
          }
        ]);
        try {
          // Register new user
          register(username, password);
          console.log(chalk.green('User registered! Please login.'));
        } catch (err) {
          console.log(chalk.red('Registration failed: ' + err.message));
        }
        continue;
      // Login flow
      } else {
        // Prompt for username and password
        const { username, password } = await inquirer.prompt([
          {
            type: 'input',
            name: 'username',
            message: 'Username:',
            validate: input => {
              if (!input || input.trim().length < 3) return 'Username must be at least 3 characters.';
              return true;
            }
          },
          {
            type: 'password',
            name: 'password',
            message: 'Password:',
            mask: '*',
            validate: input => {
              if (!input || input.length < 4) return 'Password must be at least 4 characters.';
              return true;
            }
          }
        ]);
        try {
          // Authenticate user
          if (authenticate(username, password)) {
            setSession(username); // Set session cookie
            console.log(chalk.green('Login successful!'));
            loggedIn = true;
            return username;
          } else {
            console.log(chalk.red('Invalid credentials.'));
          }
        } catch (err) {
          console.log(chalk.red('Login failed: ' + err.message));
        }
      }
    } catch (err) {
      console.log(chalk.red('An error occurred: ' + err.message));
    }
  }
}

// Export loginMenu for use in index.js
module.exports = { loginMenu };
