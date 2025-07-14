import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  ngOnInit(): void {
    this.taskListService.getTasksFromServer();
  }
  

  get allTasks() {
    return this.taskListService.getAllTasks();
  }

  toggleTaskComplete(taskId: string) {
    this.taskListService.toggleTaskComplete(taskId);
  }

  editTask(taskId: string) {
    this.taskListService.toggleEdit(taskId);
  }

  saveTask(taskId: string) {
    this.taskListService.saveTask(taskId);
  }

  cancelEdit(taskId: string) {
    this.taskListService.cancelEdit(taskId);
  }

  deleteTask(taskId: string) {
    this.taskListService.deleteTask(taskId);
  }
}
