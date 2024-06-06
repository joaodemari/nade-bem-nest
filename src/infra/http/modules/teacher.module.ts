import { Module } from '@nestjs/common';
import { TeacherController } from '../controllers/teacher/teacher.controller';
import { TeacherService } from '../../../domain/services/teacher.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
