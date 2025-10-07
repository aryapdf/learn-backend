#!/usr/bin/env node

import fs from "fs";

const TASKS_FILE = "./tasks.json";

function loadTasks() {
	if (!fs.existsSync(TASKS_FILE)) return [];
	const data = fs.readFileSync(TASKS_FILE, "utf8");
	return JSON.parse(data || "[]");
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
      id: tasks.length + 1,
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
      tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.title} [${task.status}]`)
      });
    }
    break;
  }

  case "update": {
    const [taskId, ...newTitleArgument] = args;
    const newTitle = newTitleArgument.join(" ");
    const tasks = loadTasks();

    if (!taskId || !newTitle) {
      console.log("Use format: task-cli update <id> <judul_baru>");
      process.exit(1);
    };

    const task = tasks.find(task => task.id === Number(taskId));

    if (!task) {
      console.log("Tasks ID not found, try again.");
      process.exit(1);
    };

    task.title = newTitle;
    saveTasks(tasks);
    console.log(`Task ${task.id} is updated successfully.`);
    break;
  }

  default:
    console.log(`Use command "add" for add task, "list" for list task.`);
}

