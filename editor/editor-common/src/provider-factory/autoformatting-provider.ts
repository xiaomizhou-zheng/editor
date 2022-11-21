import type { ADFEntity } from '@atlaskit/adf-utils/types';

export type AutoformatReplacement = ADFEntity;

export type AutoformatHandler = (
  match: Array<string>,
) => Promise<AutoformatReplacement>;

export type AutoformatRuleset = {
  [regex: string]: AutoformatHandler;
};

export interface AutoformattingProvider {
  getRules(): Promise<AutoformatRuleset>;
}
