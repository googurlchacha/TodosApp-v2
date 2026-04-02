import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly repo: Repository<Todo>,
  ) {}

  findAll(): Promise<Todo[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateTodoDto): Promise<Todo> {
    const todo = this.repo.create({ title: dto.title, done: false });
    return this.repo.save(todo);
  }

  async toggle(id: string): Promise<Todo> {
    const todo = await this.repo.findOne({ where: { id } });
    if (!todo) throw new NotFoundException();
    todo.done = !todo.done;
    return this.repo.save(todo);
  }

  async remove(id: string): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException();
  }
}
