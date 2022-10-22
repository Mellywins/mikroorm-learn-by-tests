import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: [__dirname + '/**/*.entity.js'],
      dbName: 'local',
      user: 'root',
      type: 'postgresql',
      debug: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
