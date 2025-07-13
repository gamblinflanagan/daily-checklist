import { Component, EventEmitter, Input, Output, inject, signal, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskListService } from '../list/tasklist-service';

export type Task = {
  id: any;
  title: string;
  description: string;
  completed: boolean;
  editing: boolean;
  originalVals: string[];
  dbId: string;
}

@Component({
  selector: 'task-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './taskform-component.html',
  styleUrl: './taskform-component.css'
})
export class TaskFormComponent {
  private httpClient = inject(HttpClient);
  private taskListService = inject(TaskListService);
  private destroyRef = inject(DestroyRef);
  isFetching = signal(false);
  newTaskTitle = '';
  newTaskDescription = '';
  private nextId = 0;
  dbResponse = '';

  onAdd() {
    if (this.newTaskTitle.trim()) {
      const newTask: Task = {
        id: this.nextId,
        title: this.newTaskTitle.trim(),
        description: this.newTaskDescription.trim(),
        completed: false,
        editing: false,
        originalVals: [this.newTaskTitle.trim(), this.newTaskDescription.trim()],
        dbId: ''
      };
       this.taskListService.addTask(newTask);
      this.newTaskTitle = '';
      this.newTaskDescription = '';
    }
  }
}
