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
            editing: false,
            originalVals: ['task title', 'task description']
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
    this.tasks.push(newTask);
  }

//   searchTasks(userId: string) {
//     return this.tasks.filter((task) => task.id === id);
//   }

 toggleTask(taskId: number) {
    const currentTask = this.tasks.find((task) => task.id === taskId);
    if (typeof(currentTask) !== 'undefined') { currentTask.completed = !currentTask.completed; }
  }

  toggleEdit(taskId: number) {
    const currentTask = this.tasks.find((task) => task.id === taskId);
    if (typeof(currentTask) !== 'undefined') { currentTask.editing = !currentTask.editing; }
  }

  saveTask(taskId: number) {
    const currentTask = this.tasks.find((task) => task.id === taskId);
    if (typeof(currentTask) !== 'undefined') { 
        currentTask.originalVals[0] = currentTask.title ;
        currentTask.originalVals[1] = currentTask.description ;
        currentTask.editing = !currentTask.editing; 
    }
    // if (typeof(currentTask) !== 'undefined') {  
    //     if (currentTask.title.trim()) {
    //         currentTask.editing = false;
    //     } else {
    //         currentTask.title = this.originalTask.title || '';
    //         currentTask.description = this.originalTask.description || '';
    //         currentTask.editing = false;
    //     }
    // }
  }

  cancelEdit(taskId: number) {
    const currentTask = this.tasks.find((task) => task.id === taskId);
    if (typeof(currentTask) !== 'undefined') { 
        currentTask.title  = currentTask.originalVals[0];
        currentTask.description = currentTask.originalVals[1];
        currentTask.editing = !currentTask.editing; 
    }
  }

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
