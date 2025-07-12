import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIcon, provideIcons } from '@ng-icons/core';
// import { featherAirplay } from '@ng-icons/feather-icons';
import { heroUsers, heroTrash, heroPencil } from '@ng-icons/heroicons/outline';
import type { Task } from '../form-component/taskform-component';

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
  tasks: Task[] = [];
  // newTaskTitle = '';
  // newTaskDescription = '';
  // private nextId = 1;
  private originalTask: Partial<Task> = {};

  // addTask() {
  //   if (this.newTaskTitle.trim()) {
  //     const newTask: Task = {
  //       id: this.nextId++,
  //       title: this.newTaskTitle.trim(),
  //       description: this.newTaskDescription.trim(),
  //       completed: false,
  //       editing: false
  //     };
  //     this.tasks.push(newTask);
  //     this.newTaskTitle = '';
  //     this.newTaskDescription = '';
  //   }
  // }

  toggleTask(task: Task) {
    task.completed = !task.completed;
  }

  editTask(task: Task) {
    this.originalTask = {
      title: task.title,
      description: task.description
    };
    task.editing = true;
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
