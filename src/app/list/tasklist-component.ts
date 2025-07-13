import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIcon, provideIcons } from '@ng-icons/core';
// import { featherAirplay } from '@ng-icons/feather-icons';
import { heroUsers, heroTrash, heroPencil } from '@ng-icons/heroicons/outline';
import type { Task } from '../form-component/taskform-component';
import { TaskListService } from './tasklist-service';

// interface Task {
//   id: number;
//   title: string;
//   description: string;
//   completed: boolean;
//   editing: boolean;
// }

@Component({
  selector: 'task-list',
  imports: [CommonModule, FormsModule, MatCheckboxModule, NgIcon],
  viewProviders: [provideIcons({ heroUsers, heroTrash, heroPencil })],
  templateUrl: './tasklist-component.html',
  styleUrl: './tasklist-component.css'
})
export class TaskListComponent {
  constructor(private taskListService: TaskListService) {}
  private originalTask: Partial<Task> = {};

  get allTasks() {
    return this.taskListService.getAllTasks();
  }

  toggleTask(task: Task) {
    task.completed = !task.completed;
  }

  editTask(taskId: number) {
    // this.originalTask = {
    //   title: task.title,
    //   description: task.description
    // };
    // task.editing = true;
  }

  saveTask(task: Task) {
    if (task.title.trim()) {
      task.editing = false;
    } else {
      task.title = this.originalTask.title || '';
      task.description = this.originalTask.description || '';
      task.editing = false;
    }
  }

  cancelEdit(task: Task) {
    task.title = this.originalTask.title || '';
    task.description = this.originalTask.description || '';
    task.editing = false;
  }

  deleteTask(taskId: number) {
    this.taskListService.deleteTask(taskId);
  }

  // getCompletedCount(): number {
  //   return this.tasks.filter(task => task.completed).length;
  // }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }
}
