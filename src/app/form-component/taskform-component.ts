import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  editing: boolean;
}

@Component({
  selector: 'task-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './taskform-component.html',
  styleUrl: './taskform-component.css'
})
export class TaskFormComponent {
  newTaskTitle = '';
  newTaskDescription = '';
  private nextId = 1;
  private originalTask: Partial<Task> = {};

  addTask() {
    if (this.newTaskTitle.trim()) {
      const newTask: Task = {
        id: this.nextId++,
        title: this.newTaskTitle.trim(),
        description: this.newTaskDescription.trim(),
        completed: false,
        editing: false
      };
      //this.tasks.push(newTask);
      this.newTaskTitle = '';
      this.newTaskDescription = '';
    }
  }

}
