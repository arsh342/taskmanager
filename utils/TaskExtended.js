const { v4: uuidv4 } = require('uuid');


// Extended Task class to store all task metadata
class TaskExtended {
  // Construct a new TaskExtended object
  constructor({ id, title, description, completed, priority, dueDate, createdAt }) {
    this.id = id || TaskExtended.generateId(); // Unique ID
    this.title = title;
    this.description = description;
    this.completed = completed || false;
    this.priority = priority || 'Normal';
    this.dueDate = dueDate || '';
    this.createdAt = createdAt || new Date().toISOString();
  }

  // Generate a unique ID for a task
  static generateId() {
    // Use timestamp and random number for uniqueness
    return (
      Date.now().toString(36) +
      Math.random().toString(36).substr(2, 6)
    ).toUpperCase();
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      priority: this.priority,
      dueDate: this.dueDate,
      createdAt: this.createdAt
    };
  }

  static fromJSON(data) {
    return new TaskExtended(data);
  }
}

// Export the TaskExtended class
module.exports = TaskExtended;
