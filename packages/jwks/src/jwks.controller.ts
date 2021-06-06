import {Controller, Get} from '@nestjs/common';
import {JwksService} from './jwks.service';

@Controller('')
export class JwksController {
  constructor(private readonly service: JwksService) {
  }

  @Get(process.env.WELL_KNOWN_PATH)
  async jwks() {
    return this.service.getPublicJwks();
  }
}
