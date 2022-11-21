import { CardAdf } from '@atlaskit/smart-card';

export type CardAppearance = 'inline' | 'block' | 'embed';
export type { CardAdf };

export interface CardProvider {
  resolve(
    url: string,
    appearance: CardAppearance,
    shouldForceAppearance?: boolean,
  ): Promise<CardAdf>;
  findPattern(url: string): Promise<boolean>;
}
