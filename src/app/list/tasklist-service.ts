import { Component, EventEmitter, Input, Output, inject, OnInit, DestroyRef, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { Task } from '../form-component/taskform-component';

@Injectable({ providedIn: 'root' })
export class TaskListService { 
    private httpClient = inject(HttpClient);
    private destroyRef = inject(DestroyRef);
    isFetching = signal(false);

    private tasks: Task[] = []
    //     {
    //         id: '1',
    //         title: '9pm stream',
    //         description: 'make sure to watch stream at 9pm tonight',
    //         completed: false,
    //         editing: false,
    //         originalVals: ['9pm stream', 'make sure to watch stream at 9pm tonight'],
    //         dbId: ''
    //     }
    // ];

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

  getTasksFromServer() {
     this.isFetching.set(true);
    const subscription = this.httpClient.get('https://daily-checklist-44f79-default-rtdb.firebaseio.com/tasks.json').subscribe({
      next: (responseData) => {
        //console.log(responseData);
        this.setAllTasks(responseData);
      },
      complete: () => {
        this.isFetching.set(false);
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  setAllTasks(tasks: any) {
    if (typeof(tasks) !== 'undefined' && tasks.length !== 0) {
        const ids = Object.keys(tasks);
        let tasksArr: Task[] = Object.values(tasks);
        // console.log(tasksArr);
        if (isPlatformBrowser(this.platformId)) {
            if (JSON.stringify(tasksArr) !== JSON.stringify(this.tasks)) {
                // ids.forEach((id, i) => {
                //     tasksArr[i].dbId = id;
                // });
                // this.tasks = tasksArr;
                // this.saveInStorage();
            }
        }
    }
  }

   
  addTask(newTask: Task) {
    this.isFetching.set(true);
    newTask.id = uuidv4();
    console.log(typeof(newTask.id));
    const subscription = this.httpClient.post('https://daily-checklist-44f79-default-rtdb.firebaseio.com/tasks.json', newTask).subscribe({
      next: (responseData: any) => {
        console.log(responseData);
        newTask.dbId = responseData.name || '';
      },
      complete: () => {
        this.tasks.push(newTask);
        this.saveTask(newTask.id)
        //this.saveInStorage();
        this.isFetching.set(false);
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
    //if error just do this
    // this.tasks.push(newTask);
    // this.saveInStorage();
  }


//   searchTasks(TaskId: string) {
//     return this.tasks.filter((task) => task.id === id);
//   }

//   sortTasks(TaskId: string) {
//     return this.tasks.filter((task) => task.id === id);
//   }

 toggleTaskComplete(taskId: string) {
    const currentTask = this.tasks.find((task) => task.id === taskId);
    if (typeof(currentTask) !== 'undefined') { 
        console.log(typeof(taskId));
        console.log(typeof(currentTask.id));
        currentTask.completed = !currentTask.completed; 
        this.saveInStorage();

        this.isFetching.set(true);
        const subscription = this.httpClient.put('https://daily-checklist-44f79-default-rtdb.firebaseio.com/tasks/'+currentTask.dbId+'.json', currentTask).subscribe({
        next: (responseData: any) => {
            console.log(responseData);
        },
        complete: () => {
            this.isFetching.set(false);
        }
        });

        this.destroyRef.onDestroy(() => {
            subscription.unsubscribe();
        });
        }
  }

  toggleEdit(taskId: string) {
    const currentTask = this.tasks.find((task) => task.id === taskId);
    if (typeof(currentTask) !== 'undefined') { currentTask.editing = !currentTask.editing; }
  }

  saveTask(taskId: string) {
    const currentTask = this.tasks.find((task) => task.id === taskId);
    if (typeof(currentTask) !== 'undefined') { 
        currentTask.originalVals[0] = currentTask.title ;
        currentTask.originalVals[1] = currentTask.description ;
        currentTask.editing = false;
        this.isFetching.set(true);
        const subscription = this.httpClient.put('https://daily-checklist-44f79-default-rtdb.firebaseio.com/tasks/'+currentTask.dbId+'.json', currentTask).subscribe({
        next: (responseData: any) => {
            console.log(responseData);
        },
        complete: () => {
            this.isFetching.set(false);
        }
        });

        this.destroyRef.onDestroy(() => {
            subscription.unsubscribe();
        });
        this.saveInStorage();
    }
  }

  cancelEdit(taskId: string) {
    const currentTask = this.tasks.find((task) => task.id === taskId);
    if (typeof(currentTask) !== 'undefined') { 
        currentTask.title  = currentTask.originalVals[0];
        currentTask.description = currentTask.originalVals[1];
        currentTask.editing = !currentTask.editing; 
    }
  }

  deleteTask(taskId: string) {
    if (confirm('Are you sure you want to delete this task?')) {
       const currentTask = this.tasks.find((task) => task.id === taskId);
        if (typeof(currentTask) !== 'undefined') { 
            this.isFetching.set(true);
            const subscription = this.httpClient.delete('https://daily-checklist-44f79-default-rtdb.firebaseio.com/tasks/'+currentTask.dbId+'.json').subscribe({
            next: (responseData: any) => {
                console.log(responseData);
            },
            complete: () => {
                this.isFetching.set(false);
            }
            });

            this.destroyRef.onDestroy(() => {
                subscription.unsubscribe();
            });
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveInStorage();
      }
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
