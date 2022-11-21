import type { BaseToken } from '../../../palettes/palette';
import type { InteractionColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<InteractionColorTokenSchema<BaseToken>> = {
  color: {
    interaction: {
      hovered: {
        // @ts-ignore temporary values
        value: '#00000029',
      },
      pressed: {
        // @ts-ignore temporary values
        value: '#00000052',
      },
    },
  },
};

export default color;
