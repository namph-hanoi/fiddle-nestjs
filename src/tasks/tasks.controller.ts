import { Controller, Get, Post, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { title } from 'process';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {};

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  @Post()
  createTask(
    @Body('title') title: string,
    @Body('description') description: string
  ): void {
    console.log(["TasksController -> createTask -> body", title, description])
  }
}
