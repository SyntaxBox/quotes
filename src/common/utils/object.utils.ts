import { Injectable } from '@nestjs/common';

type Obj1 = object;
type Obj2 = object;

// some useful object operations
@Injectable()
export class ObjectUtils {
  // takes two objects with the same key values
  // returns an objects contains the differences between the two objects
  // the differences will be taken from the first object
  public getObjectDifferences<Obj1 extends object, Obj2 extends object>(
    obj1: Obj1,
    obj2: Obj2,
  ): Partial<Obj1> {
    // checking if the keys are equal
    if (!this.objectsKeysEqual(obj1, obj2))
      throw new Error('object keys are not the same');

    // collecting differences
    const differences: Partial<Obj1> = {};
    for (const key in obj1) {
      if (obj1[key] !== obj1[key]) {
        differences[key] = obj1[key];
      }
    }
    // returning differences
    return differences;
  }

  // takes two objects
  // checking if the two object keys are equal
  // return boolean value
  public objectsKeysEqual(obj1: Obj1, obj2: Obj2): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    return this.arraysAreEqual(keys1, keys2);
  }

  // takes two arrays
  // checking if the array elements are equal
  // return boolean value
  private arraysAreEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every((element, index) => element === arr2[index]);
  }
}
