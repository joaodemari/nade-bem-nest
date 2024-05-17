import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class HttpAuthGuard extends AuthGuard('basic') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, member) {
    if (err || !member) {
      console.log('error', err);
      throw new HttpException('Unauthorized', 401);
    }
    return member.member;
  }
}
