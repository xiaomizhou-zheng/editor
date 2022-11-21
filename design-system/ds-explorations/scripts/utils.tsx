import type { CSSProperties } from 'react';

export const tokenToStyle = (
  prop: keyof CSSProperties,
  token: string,
  fallback: string,
) => {
  return `css({\n\t${prop}: token('${token}', '${fallback}')\n})`;
};

type BooleanCallback<T> = (args: T) => boolean;

export const compose = (...fns: ((...any: any[]) => any)[]) => (x: any) =>
  fns.reduce((res, fn) => fn(res), x);
export const pick = <T extends any>(key: keyof T) => (obj: T) => obj[key];
export const isAccent = (str: string) => str.includes('accent');
export const isPressed = (str: string) => str.includes('pressed');
export const isHovered = (str: string) => str.includes('hovered');
export const not = <T extends any>(cb: BooleanCallback<T>) => (val: T) =>
  !cb(val);
export const or = <T extends any>(...fns: BooleanCallback<T>[]) => (val: T) =>
  fns.some((fn) => fn(val));
export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
