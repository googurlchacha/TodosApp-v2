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
      // Cloud SQL public IP requires TLS; omit or false when using local Docker / Cloud SQL Auth Proxy on localhost
      ssl:
        process.env.DB_SSL === 'true'
          ? { rejectUnauthorized: false }
          : false,
      entities: [Todo],
      synchronize: true,
    }),
    TodosModule,
  ],
})
export class AppModule {}
