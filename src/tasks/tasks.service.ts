import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto.js';
import { TaskStatus } from './enums/task-status.enum.js';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(payload: CreateTaskDto) {
    try {
      await this.prisma.task.create({
        data: {
          title: payload.title,
          description: payload.description || null,
          status: TaskStatus.PENDING,
          completed_at: null,
          is_deleted: false,
        },
      });

      return {
        message: 'task created successfully',
        title: payload.title,
        description: payload.description,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllTask(pageQuery?: string, limitQuery?: string) {
    try {
      const page = pageQuery ? parseInt(pageQuery, 10) : 1;
      const limit = limitQuery ? parseInt(limitQuery, 10) : 10;
      const skip = (page - 1) * limit;

      const [tasks, total] = await this.prisma.$transaction([
        this.prisma.task.findMany({
          where: { is_deleted: false },
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            completed_at: true,
            created_at: true,
          },
          orderBy: { created_at: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.task.count({
          where: { is_deleted: false },
        }),
      ]);

      return {
        tasks,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw error;
    }
  }

  async getSingleTask(id: string) {
    try {
      const task = await this.prisma.task.findFirst({
        where: { id, is_deleted: false },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          completed_at: true,
          created_at: true,
        },
      });

      if (!task) {
        throw new NotFoundException('task not found');
      }

      return task;
    } catch (error) {
      throw error;
    }
  }

  async updateTask(id: string, payload: UpdateTaskDto) {
    try {
      const task = await this.prisma.task.findFirst({
        where: { id, is_deleted: false },
      });

      if (!task) {
        throw new NotFoundException('task not found');
      }

      let completed_at = task.completed_at;

      if (payload.status !== undefined) {
        if (
          payload.status === TaskStatus.COMPLETED &&
          task.status !== TaskStatus.COMPLETED
        ) {
          completed_at = new Date();
        } else if (payload.status !== TaskStatus.COMPLETED) {
          completed_at = null;
        }
      }

      return await this.prisma.task.update({
        where: { id },
        data: {
          ...(payload.title !== undefined && { title: payload.title }),
          ...(payload.description !== undefined && {
            description: payload.description,
          }),
          ...(payload.status !== undefined && { status: payload.status }),
          completed_at,
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          completed_at: true,
          updated_at: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteTask(id: string) {
    try {
      const task = await this.prisma.task.findFirst({
        where: { id, is_deleted: false },
      });

      if (!task) {
        throw new NotFoundException('task not found');
      }

      await this.prisma.task.update({
        where: { id },
        data: { is_deleted: true },
      });

      return { message: 'task deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
