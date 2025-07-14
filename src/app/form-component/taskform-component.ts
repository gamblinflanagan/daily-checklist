import { Component, EventEmitter, Input, Output, inject, signal, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskListService } from '../list/tasklist-service';

export type Task = {
  completed: boolean;
  dbId: string;
  description: string;
  editing: boolean;
  id: string;
  originalVals: string[];
  title: string;
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
  dbResponse = '';

  onAdd() {
    if (this.newTaskTitle.trim()) {
      const newTask: Task = {
        completed: false,
        dbId: '',
        description: this.newTaskDescription.trim(),
        editing: false,
        id: '0',
        originalVals: [this.newTaskTitle.trim(), this.newTaskDescription.trim()],
        title: this.newTaskTitle.trim(),
      };
       this.taskListService.addTask(newTask);
      this.newTaskTitle = '';
      this.newTaskDescription = '';
    }
  }
}
