import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() payload: CreateTaskDto) {
    return this.tasksService.createTask(payload);
  }

  @Get()
  getAllTask(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.tasksService.getAllTask(page, limit);
  }

  @Get(':id')
  getSingleTask(@Param('id') id: string) {
    return this.tasksService.getSingleTask(id);
  }

  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() payload: UpdateTaskDto) {
    return this.tasksService.updateTask(id, payload);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
