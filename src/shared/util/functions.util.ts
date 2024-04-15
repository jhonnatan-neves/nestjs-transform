export type IMapper<T = any> = Record<
  string,
  { key: string; transform?: (it: any, obj: T) => Promise<any> }
>;

export async function mapAsync<T, R>(
  items: T[],
  fnc: (item: T) => Promise<R>,
): Promise<R[]> {
  const result: R[] = [];

  for (const item of items) {
    result.push(await fnc(item));
  }

  return result;
}

export function finalItem<T>(obj: T, keys: string[]): T {
  let finalItemResult = obj;
  const excludeKeys: string[] = [];
  let stop = false;
  keys.forEach((key) => {
    if (stop) {
      return;
    }

    excludeKeys.push(key);
    if (!finalItemResult || !checkExistValue(finalItemResult[key])) {
      finalItemResult = null;
      return;
    }

    if (Array.isArray(finalItemResult[key])) {
      finalItemResult = finalItemResult[key].map((item) =>
        finalItem(
          item,
          keys.filter((item) => !excludeKeys.includes(item)),
        ),
      );
      stop = true;
      return;
    }

    finalItemResult = finalItemResult[key];
  });

  return finalItemResult;
}

function checkExistValue(value: any): boolean {
  return !!value || typeof value === 'boolean' || typeof value === 'number';
}

export async function transform<R, T>(obj: T, mapper: IMapper<T>): Promise<R> {
  if (!checkExistValue(obj)) {
    return null;
  }

  if (Array.isArray(obj)) {
    return (await mapAsync(
      obj,
      async (objMap) => await transform(objMap, mapper),
    )) as R;
  }

  const finalObject = {} as R;
  const objectEntries = Object.entries(obj);

  for (const [key, value] of Object.entries(mapper)) {
    if (value.key.split('.').length > 0) {
      const newValue = finalItem(obj, value.key.split('.'));

      if (checkExistValue(newValue)) {
        finalObject[key] = value.transform
          ? await value.transform(newValue, obj)
          : newValue;
      }
      continue;
    }

    if (checkExistValue(objectEntries[value.key])) {
      finalObject[key] = objectEntries[value.key];
    }
  }

  return finalObject;
}
