import {Controller, Get} from '@nestjs/common';
import {JwksService} from './jwks.service';

@Controller('')
export class JwksController {
  constructor(private readonly service: JwksService) {
  }

  @Get('')
  async jwks() {
    return this.service.getPublicJwks();
  }
}
