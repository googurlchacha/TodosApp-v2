import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todos: TodosService) {}

  @Get()
  list() {
    return this.todos.findAll();
  }

  @Post()
  create(@Body() dto: CreateTodoDto) {
    return this.todos.create(dto);
  }

  @Patch(':id/toggle')
  toggle(@Param('id') id: string) {
    return this.todos.toggle(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todos.remove(id);
  }
}
