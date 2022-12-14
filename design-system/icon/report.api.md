## API Report File for "@atlaskit/icon"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

<!--
	Generated API Report version: 2.0
-->

[Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

```ts
/// <reference types="react" />

import type { ComponentType } from 'react';
import { NamedExoticComponent } from 'react';
import type { ReactNode } from 'react';
import type { SVGProps as SVGProps_2 } from 'react';

// @public (undocumented)
export interface CustomGlyphProps extends SVGProps_2<SVGSVGElement> {
  'aria-label'?: string;
  'data-testid'?: string;
  className?: string;
}

// @public (undocumented)
interface GlyphColorProps {
  primaryColor?: string;
  secondaryColor?: string;
}

// @public (undocumented)
export interface GlyphProps
  extends OtherGlyphProps,
    GlyphSizeProps,
    GlyphColorProps {}

// @public (undocumented)
interface GlyphSizeProps {
  size?: Size;
}

// @public
const Icon: NamedExoticComponent<IconProps>;
export default Icon;

// @public (undocumented)
export interface IconProps extends GlyphProps {
  // @deprecated (undocumented)
  dangerouslySetGlyph?: string;
  glyph?: ComponentType<CustomGlyphProps>;
}

// @public (undocumented)
interface OtherGlyphProps {
  label: string;
  testId?: string;
}

// @public (undocumented)
export type Size = 'small' | 'medium' | 'large' | 'xlarge';

// @public (undocumented)
export const size: Record<Size, Size>;

// @public (undocumented)
export const sizes: Record<Size, string>;

// @public
export const Skeleton: NamedExoticComponent<SkeletonProps>;

// @public (undocumented)
export interface SkeletonProps {
  // (undocumented)
  color?: string;
  // (undocumented)
  size?: Size;
  testId?: string;
  // (undocumented)
  weight?: 'normal' | 'strong';
}

// @public
export const SVG: NamedExoticComponent<SVGProps>;

// @public (undocumented)
export interface SVGProps extends GlyphProps {
  children?: ReactNode;
}

// (No @packageDocumentation comment for this package)
```
