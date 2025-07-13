import { Injectable } from '@angular/core';
import type { Task } from '../form-component/taskform-component';

@Injectable({ providedIn: 'root' })
export class TaskListService { 
    private tasks= [
        {
            id: 1,
            title: 'task title',
            description: 'task description',
            completed: false,
        }
    ]

    constructor() {
    const tasks: Task[] = [];//localStorage.getItem('tasks');

    // if (tasks) {
    //   this.tasks = JSON.parse(tasks);
    // }
  }

  getAllTasks() {
    return this.tasks;
  }

  addTask(newTask: Task) {
    // if (this.newTaskTitle.trim()) {
    //   const newTask: Task = {
    //     id: this.nextId++,
    //     title: this.newTaskTitle.trim(),
    //     description: this.newTaskDescription.trim(),
    //     completed: false,
    //     editing: false
    //   };
      this.tasks.push(newTask);
    //   this.newTaskTitle = '';
    //   this.newTaskDescription = '';
    //}
  }

//   getUserTasks(userId: string) {
//     return this.tasks.filter((task) => task.id === id);
//   }

 toggleTask(index: number) {
    this.tasks[index].completed = !this.tasks[index].completed;
  }

//   editTask(task: Task) {
//     this.originalTask = {
//       title: task.title,
//       description: task.description
//     };
//     task.editing = true;
//   }

//   saveTask(task: Task) {
//     if (task.title.trim()) {
//       task.editing = false;
//     } else {
//       task.title = this.originalTask.title || '';
//       task.description = this.originalTask.description || '';
//       task.editing = false;
//     }
//   }

//   cancelEdit(task: Task) {
//     task.title = this.originalTask.title || '';
//     task.description = this.originalTask.description || '';
//     task.editing = false;
//   }

  deleteTask(taskId: number) {
    //const taskId = this.tasks[index].id;
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
    }
  }

  getCompletedCount(): number {
    return this.tasks.filter(task => task.completed).length;
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }

}
