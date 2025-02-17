import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

export class TaskRepository extends Repository<Task> {

  private logger = new Logger('TaskRepository')

  async getTasksFilter(getTasksFilterDto: GetTasksFilterDto, user: User): Promise<Task[]> {

    const { status, search } = getTasksFilterDto;

    const query = await this.createQueryBuilder('task');

    query.where('task.userId = :userId', {userId: user.id});

    if (status) {
      query.andWhere('task.status = :statusVar', { statusVar: status })
    }

    if (search) {
      // %var%
      query.andWhere(('task.title LIKE :searchVar OR task.description LIKE :searchVar'), { searchVar: `%${search}%`})
    }

    try {
      const allTasks = query.getMany();
      return allTasks;
    } catch (error) {
      this.logger.error(`Failed to get tasks for user ${user.username}, DTO: ${JSON.stringify(getTasksFilterDto)}`, error.stack)
      throw new InternalServerErrorException()
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();

    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();
    return task;
  }
}
