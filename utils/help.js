// Print help and usage information for the CLI
function printHelp() {
  console.log(`\nTask Manager CLI - Help\n========================\nFeatures:\n- Add, update, delete, search, and list tasks\n- Mark tasks as completed/incomplete\n- Filter and sort tasks\n- Backup and restore\n- User authentication\n\nUsage:\n  node index.js\n\nAll actions are interactive.\n`);
}

// Export the printHelp function
module.exports = { printHelp };
