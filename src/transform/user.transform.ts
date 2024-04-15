import {
  RootTransformer,
  Transformer,
} from '../shared/transform/root.transform';
import { IMapper } from '../shared/util/functions.util';
import { PhoneTransformer } from './phone.transfomer';

export class UserTransformer extends RootTransformer {
  availableIncludes = ['phones', 'firstUserPhone'];

  constructor() {
    super();
    this.mapper = {
      id: {
        key: 'id',
      },
      firstName: {
        key: 'firstName',
      },
      lastName: {
        key: 'lastName',
      },
      password: {
        key: 'password',
        transform: async (it) => (!!it ? '********' : null),
      },
    };
  }

  async includeFirstUserPhone(): Promise<IMapper> {
    return {
      firstUserPhone: {
        key: 'phones',
        transform: async (it) => it?.at(0)?.number ?? '-',
      },
    };
  }

  async includePhones(internalIncludes?: string[]): Promise<IMapper> {
    return {
      phones: {
        key: 'phones',
        transform: async (it) =>
          await Transformer(it, new PhoneTransformer(), internalIncludes),
      },
    };
  }
}
