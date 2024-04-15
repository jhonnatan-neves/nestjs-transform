import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Transformer } from './shared/transform/root.transform';
import { UserTransformer } from './transform/user.transform';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async get() {
    const users = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        password: 'a123456@A',
        phones: [
          {
            id: 1,
            number: '123456789',
          },
          {
            id: 2,
            number: '987654321',
          },
        ],
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        password: 'b123456@B',
      },
      {
        id: 3,
        firstName: 'Alice',
        lastName: 'Doe',
        password: null,
      },
    ];

    return {
      data: await Transformer(users, new UserTransformer(), [
        'firstUserPhone',
        'phones',
      ]),
    };
  }
}
