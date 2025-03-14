import { Controller, Post } from '@nestjs/common';
import { REFRESH_QUEUE } from '../../constants/queue.constants';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../../../domain/enums/role.enum';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { AuthPayloadDTO } from '../../dtos/auth/login.dto';

@Roles(Role.Teacher)
@Controller('integration')
export class RefreshSwimmersController {
  constructor(
    @InjectQueue(REFRESH_QUEUE)
    private readonly refreshQueue: Queue<{ teacherNumber: number }>,
  ) {}

  @Post('/swimmer/refresh')
  async handle(@CurrentUser() user: AuthPayloadDTO): Promise<void> {
    await this.refreshQueue.add(
      { teacherNumber: user.memberNumber },
      {
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
}
