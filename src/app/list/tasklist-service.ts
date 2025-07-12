import { Injectable } from '@angular/core';
import type { Task } from '../form-component/taskform-component';

@Injectable({ providedIn: 'root' })
export class TasksService { 
    private tasks = []
}
