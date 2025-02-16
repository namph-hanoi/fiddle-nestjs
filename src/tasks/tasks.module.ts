import { Module } from '@nestjs/common';
// import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TaskRepository } from './task.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskRepository]),
    AuthModule,
    // MulterModule.register({
    //   dest: '/upload',
    // })
  ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
