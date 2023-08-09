import { Injectable } from '@nestjs/common';

type Obj1 = object;
type Obj2 = object;

@Injectable()
export class ObjectUtils {
  public getObjectDifferences(obj1: Obj1, obj2: Obj2): Partial<Obj1> {
    if (!this.objectsKeysEqual(obj1, obj2))
      throw new Error('object keys are not the same');

    const differences = {};
    for (const key in obj1) {
      if (obj1[key] !== obj1[key]) {
        differences[key] = obj1[key];
      }
    }
    return differences;
  }

  public objectsKeysEqual(obj1: Obj1, obj2: Obj2): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    return this.arraysAreEqual(keys1, keys2);
  }

  public arraysAreEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every((element, index) => element === arr2[index]);
  }
}
