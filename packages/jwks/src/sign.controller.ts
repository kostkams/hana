import {Body, Controller, HttpCode, Post} from '@nestjs/common';
import {JwksService} from './jwks.service';
import {SignDto} from './sign.dto';

@Controller('')
export class SignController {
  constructor(private readonly service: JwksService) {
  }

  @Post('/sign')
  @HttpCode(200)
  async sign(@Body() body: SignDto) {
    return this.service.sign(body.id, body.email);
  }
}
