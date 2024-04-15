import { RootTransformer } from '../shared/transform/root.transform';

export class PhoneTransformer extends RootTransformer {
  availableIncludes = [];

  constructor() {
    super();
    this.mapper = {
      id: {
        key: 'id',
      },
      number: {
        key: 'number',
      },
    };
  }
}
