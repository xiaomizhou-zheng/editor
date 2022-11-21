import {
  debounce,
  isUndefined,
  matches,
  omitBy,
  pick,
} from '../../utils/helpers';

describe('helpers', () => {
  it('isUndefined', () => {
    expect(isUndefined(undefined)).toBeTruthy();
    expect(isUndefined(123)).toBeFalsy();
    expect(isUndefined('123')).toBeFalsy();
  });

  it('pick', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toStrictEqual({
      a: 1,
      c: 3,
    });
    expect(pick({ a: 1, b: 2, c: 3 }, ['d'])).toStrictEqual({});
  });

  it('omitBy', () => {
    expect(
      omitBy({ a: undefined, b: 2, c: undefined }, isUndefined),
    ).toStrictEqual({
      b: 2,
    });
    expect(omitBy({ a: 1, b: 2 }, isUndefined)).toStrictEqual({ a: 1, b: 2 });
  });

  it('debounce', async () => {
    jest.useFakeTimers();
    const callback = jest.fn();

    debounce(callback, 3000)(1, 2);
    jest.runAllTimers();
    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(1, 2);
  });

  it('matches', () => {
    const obj = { a: 4, b: 5, c: 6 };
    expect(matches({ a: 4, c: 6 })(obj)).toBeTruthy();
    expect(matches({ a: 1, c: 6 })(obj)).toBeFalsy();
    expect(matches({ d: 5 })(obj)).toBeFalsy();
  });
});
