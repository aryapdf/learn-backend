#!/usr/bin/env node

import fs from "fs";

const TASKS_FILE = "./tasks.json";

function loadTasks() {
	if (!fs.existsSync(TASKS_FILE)) return [];
	const data = fs.readFileSync(TASKS_FILE, "utf8");
    try {
      return JSON.parse(data || "[]");
    } catch {
      console.error("⚠️ tasks.json corrupted, resetting file...");
      return [];
    }
}

function saveTasks(tasks) {
	fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

const [,, command, ...args] = process.argv;

// Handle command

switch (command) {
  case "add": {
    const task = args.join(" ");
    if (!task) {
      console.log("Please add task name");
      process.exit(1);
    }
    const tasks = loadTasks();
    const addedTask = {
      id: Date.now(),
      title: task,
      status: "todo"
    };
    tasks.push(addedTask);
    saveTasks(tasks);
    console.log(`Task ${addedTask.title} added!`);
    break;
  }
  
  case "list": {
    const tasks = loadTasks();
    if (tasks.length === 0) {
      console.log("No tasks yet.");
    } else {
      console.log("Tasks List");
      console.log("-------------------------");
      tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.title} | [${task.status}]`)
      });
    }
    break;
  }

  case "update": {
    const [taskNumber, ...newTitleArgument] = args;
    const newTitle = newTitleArgument.join(" ");
    const tasks = loadTasks();

    if (!taskNumber || !newTitle) {
      console.log("Use format: task-cli update <number> <new_title>");
      process.exit(1);
    };

    if (taskNumber < 1 || taskNumber > tasks.length) {
      console.log("Task number not found, try again.");
      process.exit(1);
    }

    const task = tasks[taskNumber - 1];

    task.title = newTitle;
    saveTasks(tasks);
    console.log(`Task ${taskNumber} is updated successfully.`);
    break;
  }

  case "mark-in-progress": {
    const taskNumber = Number(args[0]);
    const tasks = loadTasks();

    if (!taskNumber) {
      console.log("Use format task-cli mark-in-progress <task-number>");
      process.exit(1);
    }

    const task = tasks[taskNumber - 1];

    if (!task) {
      console.log("Task number not found, try again.");
      process.exit(1);
    };

    task.status = 'in-progress';
    saveTasks(tasks);
    console.log(`Task No.${taskNumber} is in progress!`);

    break;
  }

  case "mark-done": {
    const taskNumber = Number(args[0]);
    const tasks = loadTasks();

    if (!taskNumber) {
      console.log("Use format task-cli mark-done <task-number>");
      process.exit(1);
    }

    const task = tasks[taskNumber - 1];

    if (!task) {
      console.log("Task number not found, try again.");
      process.exit(1);
    };

    task.status = 'done';
    saveTasks(tasks);
    console.log(`Task No.${taskNumber} is done!`);

    break;
  }

  case "delete" : {
    const taskNumber = Number(args[0]);
    const tasks = loadTasks();


    if (!taskNumber || isNaN(taskNumber)) {
      console.log("Please provide a valid task number: task-cli delete <number>");
      process.exit(1);
    }

    if (taskNumber < 1 || taskNumber > tasks.length) {
      console.log(`Task number ${taskNumber} not found.`);
      process.exit(1);
    }

    const deletedTask = tasks[taskNumber - 1];
    tasks.splice(taskNumber - 1, 1);
    saveTasks(tasks);

    console.log(`Task "${deletedTask.title}" deleted.`);
    break;
  }

  default:
    console.log(`
    Available Commands:
      task-cli add "Task name"            → Add a new task
      task-cli list                       → List all tasks
      task-cli update <number> "New title"    → Update a task title
      task-cli mark-in-progress <number>      → Mark a task as in progress
      task-cli mark-done <number>             → Mark a task as done
      task-cli delete <number>                → Delete a task
`);
}

