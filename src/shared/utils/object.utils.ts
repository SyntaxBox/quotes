import { Injectable } from '@nestjs/common';

type Obj1 = object;
type Obj2 = object;

// some useful object operations
@Injectable()
export class ObjectUtils {
  // takes two objects with the same key values
  // returns an objects contains the differences between the two objects
  // the differences will be taken from the first object
  public getObjectDifferences<Obj1 extends object, Obj2 extends Obj1>(
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
    // extracting the keys and sorting them to avoid error
    const keys1 = Object.keys(obj1).sort();
    const keys2 = Object.keys(obj2).sort();
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

  /**
   * Selects specified keys from a source object based on a selector object.
   * @param sourceObject The source object from which to select keys.
   * @param selectorObject The selector object that specifies which keys to select.
   * @returns A new object with selected keys and their corresponding values from the source object.
   */
  public selectKeys<T, K extends keyof T>(
    sourceObject: T,
    selectorObject: { [key in K]?: boolean },
  ): Partial<T> {
    // Filter the keys of selectorObject based on their boolean values.
    const selectedKeys = Object.keys(selectorObject).filter(
      (key) => selectorObject[key as K],
    ) as K[];

    // Create a new object to store the selected keys and values.
    const selectedObject: Partial<T> = {};

    // Iterate through the selected keys and copy their values from the source object.
    selectedKeys.forEach((key) => {
      if (sourceObject[key] !== undefined) {
        selectedObject[key] = sourceObject[key];
      }
    });

    // Return the new object with selected keys and values.
    return selectedObject;
  }
}
