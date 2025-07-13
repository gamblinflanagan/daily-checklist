import { Component, EventEmitter, Input, Output, inject, OnInit, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIcon, provideIcons } from '@ng-icons/core';
// import { featherAirplay } from '@ng-icons/feather-icons';
import { heroUsers, heroTrash, heroPencil } from '@ng-icons/heroicons/outline';

import type { Task } from '../form-component/taskform-component';
import { TaskListService } from './tasklist-service';


@Component({
  selector: 'task-list',
  imports: [CommonModule, FormsModule, MatCheckboxModule, NgIcon],
  viewProviders: [provideIcons({ heroUsers, heroTrash, heroPencil })],
  templateUrl: './tasklist-component.html',
  styleUrl: './tasklist-component.css'
})
export class TaskListComponent implements OnInit {
  // private originalTask: Partial<Task> = {};
  // constructor(private taskListService: TaskListService) {}
  private taskListService = inject(TaskListService);
  // private httpClient = inject(HttpClient);
  // private destroyRef = inject(DestroyRef);
  // isFetching = signal(false);

  ngOnInit(): void {
    this.taskListService.getTasksFromServer();
    // this.isFetching.set(true);
    // const subscription = this.httpClient.get('https://daily-checklist-44f79-default-rtdb.firebaseio.com/tasks.json').subscribe({
    //   next: (responseData) => {
    //     //console.log(responseData);
    //     this.taskListService.setAllTasks(responseData);
    //   },
    //   complete: () => {
    //     this.isFetching.set(false);
    //   }
    // });

    // this.destroyRef.onDestroy(() => {
    //   subscription.unsubscribe();
    // });
  }
  

  get allTasks() {
    return this.taskListService.getAllTasks();
  }

  toggleTaskComplete(taskId: number) {
    this.taskListService.toggleTaskComplete(taskId);
  }

  editTask(taskId: number) {
    this.taskListService.toggleEdit(taskId);
  }

  saveTask(taskId: number) {
    this.taskListService.saveTask(taskId);
  }

  cancelEdit(taskId: number) {
    this.taskListService.cancelEdit(taskId);
  }

  deleteTask(taskId: number) {
    this.taskListService.deleteTask(taskId);
  }

  // getCompletedCount(): number {
  //   return this.tasks.filter(task => task.completed).length;
  // }

  // trackByTaskId(index: number, task: Task): number {
  //   return task.id;
  // }
}
