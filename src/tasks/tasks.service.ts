import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
// import { MulterOptionsFactory } from '@nestjs/platform-express';
// import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
    // private multerConfigService: MulterOptionsFactory
  ) {}

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: {
        id,
        userId: user.id
      }
    });
    if (!found) {
      throw new NotFoundException(`Task with the id of ${id} is not found`);
    }
    return found;
  };

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  };

  async deleteTaskById(id: number, user: User): Promise<any> {
    const task = await this.getTaskById(id, user);
    return this.taskRepository.delete(task.id)
  };

  async updateTaskById(id: number, status: TaskStatus, user: User): Promise<any> {
    const found = await this.getTaskById(id, user);
    found.status = status;
    return found.save();
  };

  async getTasksFilter(getTasksFilterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasksFilter(getTasksFilterDto, user);
  };

  // createMulterOptions(): MulterModuleOptions {

    
  // }
}
