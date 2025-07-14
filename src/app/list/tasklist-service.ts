import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  OnInit,
  DestroyRef,
  signal,
} from '@angular/core';
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
  error = signal('');

  private tasks: Task[] = [];
  private offlineTasks: Task[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    //const tasks: Task[] = [];//
    if (isPlatformBrowser(this.platformId)) {
      const tasks = localStorage.getItem('tasks'); // || [];
      const offlineTasks = localStorage.getItem('offlineTasks');

      if (tasks) {
        this.tasks = JSON.parse(tasks);
      }
      if (offlineTasks) {
        this.offlineTasks = JSON.parse(offlineTasks);
      }
    }
  }

  getAllTasks() {
    return this.tasks;
  }

  getTasksFromServer() {
    this.isFetching.set(true);
    const subscription = this.httpClient
      .get(
        'https://daily-checklist-44f79-default-rtdb.firebaseio.com/tasks.json'
      )
      .subscribe({
        next: (responseData) => {
          //console.log(responseData);
          this.setAllTasks(responseData);
        },
        complete: () => {
          this.isFetching.set(false);
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  setAllTasks(tasks: any) {
    if (typeof tasks !== 'undefined' && tasks.length !== 0) {
      let tasksArr: Task[] = Object.values(tasks);
      if (isPlatformBrowser(this.platformId)) {
        if (
          JSON.stringify(tasksArr) !== JSON.stringify(this.tasks) &&
          this.offlineTasks.length !== 0
        ) {
          this.isFetching.set(true);
          this.offlineTasks.forEach(function (this: any, task) {
            //console.log(task);
            if (task.method === 'POST') {
              //console.log('post');
              task.method = 'null';
              const subscription = this.httpClient
                .post(
                  'https://daily-checklist-44f79-default-rtdb.firebaseio.com/tasks.json',
                  task
                )
                .subscribe({
                  next: (responseData: any) => {
                    console.log(responseData);
                    task.dbId = responseData.name || '';
                  },
                  complete: () => {
                    this.saveTask(task.id);
                    //this.saveInStorage();
                    this.isFetching.set(false);
                  },
                });
              this.destroyRef.onDestroy(() => {
                subscription.unsubscribe();
              });
            } else if (task.method === 'PUT') {
              // console.log('put');
              task.method = 'null';
              const subscription = this.httpClient
                .put(
                  'https://daily-checklist-44f79-default-rtdb.firebaseio.com/tasks/' +
                    task.dbId +
                    '.json',
                  task
                )
                .subscribe({
                  next: (responseData: any) => {
                    console.log(responseData);
                  },
                  complete: () => {
                    this.isFetching.set(false);
                  },
                });
              this.destroyRef.onDestroy(() => {
                subscription.unsubscribe();
              });
            } else if (task.method === 'DELETE') {
              // console.log('delete');
              task.method = 'null';
              const subscription = this.httpClient
                .delete(
                  'https://daily-checklist-44f79-default-rtdb.firebaseio.com/tasks/' +
                    task.dbId +
                    '.json'
                )
                .subscribe({
                  next: (responseData: any) => {
                    console.log(responseData);
                  },
                  complete: () => {
                    this.isFetching.set(false);
                  },
                });
              this.destroyRef.onDestroy(() => {
                subscription.unsubscribe();
              });
            }
          });
          this.offlineTasks.splice(0, this.offlineTasks.length);
          this.saveInStorage();
          this.isFetching.set(false);
        }
      }
    }
  }

  addTask(newTask: Task) {
    this.isFetching.set(true);
    newTask.id = uuidv4();
    console.log(typeof newTask.id);
    const subscription = this.httpClient
      .post(
        'https://daily-checklist-44f79-default-rtdb.firebaseio.com/tasks.json',
        newTask
      )
      .subscribe({
        next: (responseData: any) => {
          console.log(responseData);
          newTask.dbId = responseData.name || '';
        },
        error: (error) => {
          this.error.set(error);
          newTask.method = 'POST';
          this.offlineTasks.push(newTask);
        },
        complete: () => {
          this.tasks.push(newTask);
          this.saveTask(newTask.id);
          //this.saveInStorage();
          this.isFetching.set(false);
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  //   searchTasks(TaskId: string) {
  //     return this.tasks.filter((task) => task.id === id);
  //   }

  //   sortTasks(TaskId: string) {
  //     return this.tasks.filter((task) => task.id === id);
  //   }

  toggleTaskComplete(taskId: string) {
    const currentTask = this.tasks.find((task) => task.id === taskId);
    if (typeof currentTask !== 'undefined') {
      console.log(typeof taskId);
      console.log(typeof currentTask.id);
      currentTask.completed = !currentTask.completed;
      this.saveInStorage();

      this.isFetching.set(true);
      const subscription = this.httpClient
        .put(
          'https://daily-checklist-44f79-default-rtdb.firebaseio.com/tasks/' +
            currentTask.dbId +
            '.json',
          currentTask
        )
        .subscribe({
          next: (responseData: any) => {
            console.log(responseData);
          },
          error: (error) => {
            this.error.set(error);
            currentTask.method = 'PUT';
            this.offlineTasks.push(currentTask);
          },
          complete: () => {
            this.isFetching.set(false);
          },
        });
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
  }

  toggleEdit(taskId: string) {
    const currentTask = this.tasks.find((task) => task.id === taskId);
    if (typeof currentTask !== 'undefined') {
      currentTask.editing = !currentTask.editing;
    }
  }

  saveTask(taskId: string) {
    const currentTask = this.tasks.find((task) => task.id === taskId);
    if (typeof currentTask !== 'undefined') {
      currentTask.originalVals[0] = currentTask.title;
      currentTask.originalVals[1] = currentTask.description;
      currentTask.editing = false;
      this.isFetching.set(true);
      const subscription = this.httpClient
        .put(
          'https://daily-checklist-44f79-default-rtdb.firebaseio.com/tasks/' +
            currentTask.dbId +
            '.json',
          currentTask
        )
        .subscribe({
          next: (responseData: any) => {
            console.log(responseData);
          },
          error: (error) => {
            this.error.set(error);
            currentTask.method = 'PUT';
            this.offlineTasks.push(currentTask);
          },
          complete: () => {
            this.isFetching.set(false);
          },
        });

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
      this.saveInStorage();
    }
  }

  cancelEdit(taskId: string) {
    const currentTask = this.tasks.find((task) => task.id === taskId);
    if (typeof currentTask !== 'undefined') {
      currentTask.title = currentTask.originalVals[0];
      currentTask.description = currentTask.originalVals[1];
      currentTask.editing = !currentTask.editing;
    }
  }

  deleteTask(taskId: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      const currentTask = this.tasks.find((task) => task.id === taskId);
      if (typeof currentTask !== 'undefined') {
        this.isFetching.set(true);
        const subscription = this.httpClient
          .delete(
            'https://daily-checklist-44f79-default-rtdb.firebaseio.com/tasks/' +
              currentTask.dbId +
              '.json'
          )
          .subscribe({
            next: (responseData: any) => {
              console.log(responseData);
            },
            error: (error) => {
              this.error.set(error);
              currentTask.method = 'DELETE';
              this.offlineTasks.push(currentTask);
            },
            complete: () => {
              this.isFetching.set(false);
            },
          });
        this.destroyRef.onDestroy(() => {
          subscription.unsubscribe();
        });
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.saveInStorage();
      }
    }
  }

  private saveInStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    localStorage.setItem('offlineTasks', JSON.stringify(this.offlineTasks));
  }

  //   getCompletedCount(): number {
  //     return this.tasks.filter(task => task.completed).length;
  //   }

  //   trackByTaskId(index: number, task: Task): number {
  //     return task.id;
  //   }
}
