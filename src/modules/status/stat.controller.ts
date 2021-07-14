import { Controller, Body, Get, Post } from '@nestjs/common';

import { StatusService } from './stat.service';

@Controller()
export class StatusController {
  constructor(private readonly service: StatusService) {}

  @Get('/status')
  async status(): Promise<Health> {
    return await this.service.status();
  }

  @Get('/')
  async main(): Promise<string> {
    return this.service.main();
  }

  @Post('/withdrawal')
  async withdrawal(_, @Body() { body }: any): Promise<string> {
    console.log('body', body)

    return await this.service.withdrawal(JSON.parse(body))
  }
}
