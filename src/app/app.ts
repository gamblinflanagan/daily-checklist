import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskListComponent } from './list/tasklist-component';
import { HeaderComponent } from './header/header-component';
import { TaskFormComponent } from './form-component/taskform-component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TaskListComponent,
    HeaderComponent,
    TaskFormComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('daily-checklist');
}
