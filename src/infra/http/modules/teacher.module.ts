import { Module } from '@nestjs/common';
import { TeacherController } from '../controllers/teacher/teacher.controller';
import { DatabaseModule } from '../../database/database.module';
import { TeacherService } from '../../../domain/services/teachers/teacher.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
