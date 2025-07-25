// Import required modules and dependencies
const boxenImport = require('boxen'); // For creating boxes in CLI
const boxen = boxenImport.default || boxenImport;
const chalkImport = require('chalk'); // For colored CLI output
const chalk = chalkImport.default || chalkImport;
const { TaskManager } = require('taskmanagerutil'); // Task CRUD and persistence
const TaskExtended = require('./TaskExtended'); // Custom class for extended task fields
const fs = require('fs'); // File system operations
const inquirer = require('inquirer').default || require('inquirer'); // CLI prompts
const TASKS_FILE = 'tasks.json'; // File to store tasks
const tm = new TaskManager('file', TASKS_FILE); // Task manager instance
const { printHelp } = require('./help'); // Help/usage info

// Format a task object for pretty CLI display
function formatTask(task) {
  return boxen(
    chalk.bold(`ID: ${task.id}`) +
    `\nTitle: ${task.title}` +
    `\nDescription: ${task.description}` +
    `\nStatus: ${task.completed ? chalk.green('Completed') : chalk.yellow('Pending')}` +
    `\nPriority: ${task.priority || 'Normal'}` +
    `\nDue: ${task.dueDate || 'None'}` +
    `\nCreated: ${task.createdAt || 'N/A'}`,
    { padding: 1, borderColor: task.completed ? 'green' : 'yellow', borderStyle: 'round' }
  );
}

// Filter and sort tasks based on user selection
function getFilteredSortedTasks(tasks, filter, sort) {
  let filtered = tasks;
  if (filter === 'completed') filtered = tasks.filter(t => t.completed);
  else if (filter === 'pending') filtered = tasks.filter(t => !t.completed);
  if (sort === 'due') filtered = filtered.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
  else if (sort === 'priority') filtered = filtered.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  else if (sort === 'created') filtered = filtered.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
  return filtered;
}

// Main interactive menu for all task operations
async function mainMenu() {
  while (true) {
    // Show main menu and get user action
    const { clearSession, getSession } = require('./session');
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: `Select an action${getSession() ? ' (User: ' + getSession() + ')' : ''}:`,
        choices: [
          { name: '1. Add Task', value: 'add' },
          { name: '2. Update Task', value: 'update' },
          { name: '3. Delete Task', value: 'delete' },
          { name: '4. List Tasks', value: 'list' },
          { name: '5. Search Task', value: 'search' },
          { name: '6. Mark Task as Completed/Incomplete', value: 'toggle' },
          { name: '7. Filter/Sort Tasks', value: 'filter' },
          { name: '8. Backup/Restore', value: 'backup' },
          { name: '9. Help', value: 'help' },
          { name: '10. Logout', value: 'logout' },
          { name: '11. Exit', value: 'exit' }
        ]
      }
    ]);

    // Add Task flow
    if (action === 'add') {
      // Prompt for task details
      const { title, description, dueDate, priority } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Task Title (or type "back" to return):' },
        { type: 'input', name: 'description', message: 'Task Description (or type "back" to return):' },
        { type: 'input', name: 'dueDate', message: 'Due Date (YYYY-MM-DD, optional, or type "back" to return):' },
        { type: 'list', name: 'priority', message: 'Priority:', choices: ['Low', 'Normal', 'High', 'Back'], default: 'Normal' }
      ]);
      // Allow user to go back
      if ([title, description, dueDate, priority].includes('Back') || [title, description, dueDate].some(v => v && v.toLowerCase() === 'back')) continue;
      // Create and save new task
      const taskObj = new TaskExtended({
        title,
        description,
        dueDate,
        priority,
        createdAt: new Date().toISOString(),
        completed: false
      });
      const all = tm.getAllTasks();
      all.push(taskObj);
      fs.writeFileSync(TASKS_FILE, JSON.stringify(all, null, 2));
      console.log('Task added:\n' + formatTask(taskObj));
    // Update Task flow
    } else if (action === 'update') {
      // Prompt for task ID and new details
      const { id } = await inquirer.prompt({ type: 'input', name: 'id', message: 'Task ID to update (or type "back" to return):' });
      if (id.toLowerCase() === 'back') continue;
      const all = tm.getAllTasks();
      const idx = all.findIndex(t => t.id === id);
      if (idx === -1) {
        console.log('Task not found.');
        continue;
      }
      const task = all[idx];
      const { title, description, dueDate, priority } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'New Title (or type "back" to return):', default: task.title },
        { type: 'input', name: 'description', message: 'New Description (or type "back" to return):', default: task.description },
        { type: 'input', name: 'dueDate', message: 'New Due Date (YYYY-MM-DD, optional, or type "back" to return):', default: task.dueDate },
        { type: 'list', name: 'priority', message: 'New Priority:', choices: ['Low', 'Normal', 'High', 'Back'], default: task.priority || 'Normal' }
      ]);
      if ([title, description, dueDate, priority].includes('Back') || [title, description, dueDate].some(v => v && v.toLowerCase() === 'back')) continue;
      // Update and save task
      const updated = new TaskExtended({
        id: task.id,
        title,
        description,
        dueDate,
        priority,
        createdAt: task.createdAt,
        completed: task.completed
      });
      all[idx] = updated;
      fs.writeFileSync(TASKS_FILE, JSON.stringify(all, null, 2));
      console.log('Task updated:\n' + formatTask(updated));
    // Delete Task flow
    } else if (action === 'delete') {
      // Prompt for task ID to delete
      const { id } = await inquirer.prompt({ type: 'input', name: 'id', message: 'Task ID to delete (or type "back" to return):' });
      if (id.toLowerCase() === 'back') continue;
      const deleted = tm.deleteTask(id);
      if (deleted) console.log('Task deleted.');
      else console.log('Task not found.');
    // List Tasks flow
    } else if (action === 'list') {
      // Prompt for filter and sort options
      const { filter, sort } = await inquirer.prompt([
        { type: 'list', name: 'filter', message: 'Filter by status:', choices: ['all', 'completed', 'pending', 'Back'], default: 'all' },
        { type: 'list', name: 'sort', message: 'Sort by:', choices: ['created', 'due', 'priority', 'Back'], default: 'created' }
      ]);
      if (filter === 'Back' || sort === 'Back') continue;
      // Get and display filtered/sorted tasks
      const all = tm.getAllTasks();
      const tasks = getFilteredSortedTasks(all, filter, sort);
      if (tasks.length === 0) console.log('No tasks found.');
      else tasks.forEach(t => console.log(formatTask(t)));
    // Search Task flow
    } else if (action === 'search') {
      // Prompt for search type
      const { searchType } = await inquirer.prompt({ type: 'list', name: 'searchType', message: 'Search by:', choices: ['ID', 'Keyword', 'Back'] });
      if (searchType === 'Back') continue;
      if (searchType === 'ID') {
        // Search by ID
        const { id } = await inquirer.prompt({ type: 'input', name: 'id', message: 'Task ID to search (or type "back" to return):' });
        if (id.toLowerCase() === 'back') continue;
        const found = tm.getTaskById(id);
        if (found) console.log(formatTask(found));
        else console.log('Task not found.');
      } else {
        // Search by keyword in description
        const { keyword } = await inquirer.prompt({ type: 'input', name: 'keyword', message: 'Keyword to search in description (or type "back" to return):' });
        if (keyword.toLowerCase() === 'back') continue;
        const all = tm.getAllTasks();
        const found = all.filter(t => t.description && t.description.toLowerCase().includes(keyword.toLowerCase()));
        if (found.length) found.forEach(t => console.log(formatTask(t)));
        else console.log('No tasks found.');
      }
    // Toggle Task Completed/Incomplete
    } else if (action === 'toggle') {
      // Prompt for task to toggle
      const all = tm.getAllTasks();
      if (all.length === 0) {
        console.log('No tasks to update.');
        continue;
      }
      const { id } = await inquirer.prompt({ type: 'list', name: 'id', message: 'Select task to toggle status:', choices: [...all.map(t => ({ name: `${t.title} (${t.completed ? 'Completed' : 'Pending'})`, value: t.id })), { name: 'Back', value: 'back' }] });
      if (id === 'back') continue;
      const idx = all.findIndex(t => t.id === id);
      if (idx === -1) {
        console.log('Task not found.');
        continue;
      }
      // Toggle and save task
      const taskToToggle = all[idx];
      const toggledTask = new TaskExtended({
        ...taskToToggle,
        completed: !taskToToggle.completed
      });
      all[idx] = toggledTask;
      fs.writeFileSync(TASKS_FILE, JSON.stringify(all, null, 2));
      console.log(`Task marked as ${toggledTask.completed ? 'Completed' : 'Pending'}:\n` + formatTask(toggledTask));
    // Filter/Sort Tasks (shortcut)
    } else if (action === 'filter') {
      // Prompt for filter and sort
      const { filter, sort } = await inquirer.prompt([
        { type: 'list', name: 'filter', message: 'Filter by status:', choices: ['all', 'completed', 'pending', 'Back'], default: 'all' },
        { type: 'list', name: 'sort', message: 'Sort by:', choices: ['created', 'due', 'priority', 'Back'], default: 'created' }
      ]);
      if (filter === 'Back' || sort === 'Back') continue;
      // Get and display filtered/sorted tasks
      const all = tm.getAllTasks();
      const tasks = getFilteredSortedTasks(all, filter, sort);
      if (tasks.length === 0) console.log('No tasks found.');
      else tasks.forEach(t => console.log(formatTask(t)));
    // Backup/Restore flow
    } else if (action === 'backup') {
      // Prompt for backup/restore action
      const { backupAction } = await inquirer.prompt({ type: 'list', name: 'backupAction', message: 'Backup/Restore:', choices: ['Backup Now', 'Restore from Backup', 'List Backups', 'Cancel', 'Back'] });
      if (backupAction === 'Back' || backupAction === 'Cancel') continue;
      if (backupAction === 'Backup Now') {
        // Backup tasks
        const file = backupTasks();
        console.log('Backup created:', file);
      } else if (backupAction === 'Restore from Backup') {
        // Restore tasks from backup
        const backups = listBackups();
        if (backups.length === 0) {
          console.log('No backups found.');
        } else {
          const { file } = await inquirer.prompt({ type: 'list', name: 'file', message: 'Select backup to restore:', choices: [...backups, 'Back'] });
          if (file === 'Back') continue;
          const ok = restoreTasks(`backups/${file}`);
          if (ok) console.log('Tasks restored from backup.');
          else console.log('Restore failed.');
        }
      } else if (backupAction === 'List Backups') {
        // List all backup files
        const backups = listBackups();
        if (backups.length === 0) console.log('No backups found.');
        else backups.forEach(f => console.log(f));
      }
    // Show help
    } else if (action === 'help') {
      printHelp();
    // Logout user and clear session
    } else if (action === 'logout') {
      clearSession();
      console.log(chalk.yellow('Logged out.'));
      break;
    // Exit the CLI
    } else if (action === 'exit') {
      break;
    }
  }
}

// Export mainMenu for use in index.js
module.exports = { mainMenu };
