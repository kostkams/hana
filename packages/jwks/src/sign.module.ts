import {Module} from '@nestjs/common';
import {JwksService} from './jwks.service';
import {SignController} from './sign.controller';

@Module({
  controllers: [SignController],
  providers: [JwksService],
})
export class SignModule {}
