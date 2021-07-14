import { Injectable } from '@nestjs/common';

@Injectable()
class StatusService {
  async status(): Promise<Health> {
    return {
      status: '',
      error: false,
    };
  }

  main(): string {
    return `This is <a href=https://tornado.cash>tornado.cash</a> Relayer service. Check the <a href=/status>/status</a> for settings`;
  }
}

export { StatusService };
