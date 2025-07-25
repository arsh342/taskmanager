# Task Manager CLI

A robust Node.js command-line Task Manager with user authentication, advanced task features, and a beautiful interactive UI.

## Features

- User authentication (username/password, session/cookie logic)
- Add, update, delete, search, and list tasks
- Task metadata: description, due date, priority, status, created date
- Mark tasks as completed/incomplete
- Filter and sort tasks (by status, due date, priority, created date)
- Backup and restore tasks
- Help and usage instructions
- Modern CLI UI: arrow-key navigation, colored output, boxed banners
- Persistent login (auto-login until logout)
- Modular, well-commented codebase

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/arsh342/taskmanager.git
   cd taskmanager
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```

## Usage

Start the CLI:
```sh
node index.js
```

### First Run
- Register a new user with a strong password (min 8 chars, uppercase, number, special char).
- After registration, log in to access the main menu.

### Main Menu Actions
- **Add Task:** Create a new task with title, description, due date, and priority.
- **Update Task:** Edit any field of an existing task by ID.
- **Delete Task:** Remove a task by ID.
- **List Tasks:** View all tasks, filter by status, and sort by various fields.
- **Search Task:** Find tasks by ID or keyword in description.
- **Mark Completed/Incomplete:** Toggle the status of a task.
- **Filter/Sort Tasks:** Quickly filter and sort tasks.
- **Backup/Restore:** Create or restore from backups (stored in `/backups`).
- **Help:** View usage instructions.
- **Logout:** End your session (auto-login resumes until logout).
- **Exit:** Quit the CLI.

### Navigation
- Use arrow keys to navigate menus.
- Type `back` or select `Back` to return to previous menus.
- All prompts are interactive and validated.

## Data & Security
- User credentials are stored in `users.txt` (excluded from git).
- Session info is stored in `session.json` (auto-login until logout).
- Tasks are stored in `tasks.json` (all metadata persisted).
- Backups are stored in the `backups/` directory.
- All sensitive files are listed in `.gitignore`.

## Project Structure

```
/ (root)
├── index.js                # Entry point, banner, main loop
├── utils/
│   ├── auth.js             # User authentication logic
│   ├── loginMenu.js        # Login/register menu
│   ├── taskMenu.js         # Main task menu and actions
│   ├── TaskExtended.js     # Extended task class for metadata
│   ├── backup.js           # Backup/restore logic
│   ├── help.js             # Help/usage info
│   └── session.js          # Session (cookie) logic
├── tasks.json              # Task data (gitignored)
├── users.txt               # User data (gitignored)
├── session.json            # Session data (gitignored)
├── backups/                # Task backups (gitignored)
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Dependencies
- [inquirer](https://www.npmjs.com/package/inquirer) - Interactive CLI prompts
- [boxen](https://www.npmjs.com/package/boxen) - Boxed UI elements
- [chalk](https://www.npmjs.com/package/chalk) - Colored CLI output
- [figlet](https://www.npmjs.com/package/figlet) - ASCII art banners
- [taskmanagerutil](https://www.npmjs.com/package/taskmanagerutil) - Task CRUD and persistence

## Customization & Extensibility
- All code is modular and well-commented for easy extension.
- Add new features by editing or adding files in the `utils/` directory.
- UI and validation logic can be easily customized.
