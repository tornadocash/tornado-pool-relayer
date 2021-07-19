import { Controller, Body, Param, Get, Post } from '@nestjs/common';
import { Job } from 'bull';

import { ApiService } from './api.service';

@Controller()
export class ApiController {
  constructor(private readonly service: ApiService) {}

  @Get('/api')
  async status(): Promise<Health> {
    return await this.service.status();
  }

  @Get('/')
  async main(): Promise<string> {
    return this.service.main();
  }

  @Get('/job/:jobId')
  async getJob(@Param('jobId') jobId: string): Promise<Job> {
    return await this.service.getJob(jobId);
  }

  @Post('/withdrawal')
  async withdrawal(_, @Body() { body }: any): Promise<string> {
    console.log('body', body);

    return await this.service.withdrawal(JSON.parse(body));
  }
}
