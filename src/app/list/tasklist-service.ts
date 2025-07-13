import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { Task } from '../form-component/taskform-component';

@Injectable({ providedIn: 'root' })
export class TaskListService { 
    private tasks= [
        {
            id: 1,
            title: '9pm stream',
            description: 'make sure to watch stream at 9pm tonight',
            completed: false,
            editing: false,
            originalVals: ['9pm stream', 'make sure to watch stream at 9pm tonight']
        }
    ];

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        //const tasks: Task[] = [];//
        if (isPlatformBrowser(this.platformId)) {
            const tasks = localStorage.getItem('tasks');// || [];

            if (tasks) {
            this.tasks = JSON.parse(tasks);
            }
        }
    }

  getAllTasks() {
    return this.tasks;
  }

  addTask(newTask: Task) {
    this.tasks.push(newTask);
    this.saveInStorage();
  }

//   searchTasks(userId: string) {
//     return this.tasks.filter((task) => task.id === id);
//   }

 toggleTask(taskId: number) {
    const currentTask = this.tasks.find((task) => task.id === taskId);
    if (typeof(currentTask) !== 'undefined') { 
        currentTask.completed = !currentTask.completed; 
        this.saveInStorage();
    }
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
         this.saveInStorage();
    }
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
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
      this.saveInStorage();
    }
  }

  private saveInStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

//   getCompletedCount(): number {
//     return this.tasks.filter(task => task.completed).length;
//   }

//   trackByTaskId(index: number, task: Task): number {
//     return task.id;
//   }

}
