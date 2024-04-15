import { IMapper, transform } from '../util/functions.util';

export abstract class RootTransformer {
  mapper: IMapper;
  availableIncludes: string[] = [];
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function Transformer<T, R>(
  source: T,
  rootTransformer: RootTransformer,
  includes: string[] = [],
): Promise<R> {
  for (const include of includes) {
    const key = capitalizeFirstLetter(include);
    const fnc = rootTransformer[`include${key}`];

    if (!!fnc) {
      const fncInclude = includes
        .filter(
          (includeFilter) =>
            includeFilter.toLowerCase().indexOf(key.toLowerCase()) > -1 &&
            includeFilter.split('.').length > 1,
        )
        .map((includeMap) =>
          includeMap
            .split('.')
            .filter(
              (includeFilter) =>
                includeFilter.toLowerCase() !== key.toLowerCase(),
            )
            .join('.'),
        );

      rootTransformer.mapper = {
        ...rootTransformer.mapper,
        ...(await fnc(fncInclude)),
      };
    }
  }

  return await transform<R, T>(source, rootTransformer.mapper);
}
