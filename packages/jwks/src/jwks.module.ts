import {Module} from '@nestjs/common';
import {JwksController} from './jwks.controller';
import {JwksService} from './jwks.service';

@Module({
  providers: [JwksService],
  controllers: [JwksController],
})
export class JwksModule {}
