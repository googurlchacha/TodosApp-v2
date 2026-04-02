import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './todos/todos.module';
import { Todo } from './todos/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER ?? 'todo',
      password: process.env.DB_PASSWORD ?? 'todo',
      database: process.env.DB_NAME ?? 'todos',
      entities: [Todo],
      synchronize: true,
    }),
    TodosModule,
  ],
})
export class AppModule {}
