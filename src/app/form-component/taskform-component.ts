import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskListService } from '../list/tasklist-service';

export type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  editing: boolean;
  originalVals: string[];
}

@Component({
  selector: 'task-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './taskform-component.html',
  styleUrl: './taskform-component.css'
})
export class TaskFormComponent {
  private taskListService = inject(TaskListService);
  newTaskTitle = '';
  newTaskDescription = '';
  private nextId = 2;

  onAdd() {
    if (this.newTaskTitle.trim()) {
      const newTask: Task = {
        id: this.nextId++,
        title: this.newTaskTitle.trim(),
        description: this.newTaskDescription.trim(),
        completed: false,
        editing: false,
        originalVals: [this.newTaskTitle.trim(), this.newTaskDescription.trim()]
      };
      this.taskListService.addTask(newTask);
      this.newTaskTitle = '';
      this.newTaskDescription = '';
    }
  }

}
