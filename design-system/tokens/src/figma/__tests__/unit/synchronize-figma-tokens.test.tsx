// We don't statically export these so we suppress the error.
// This is done so we can copy and paste the script to run it in Figma.
import __noop from '@atlaskit/ds-lib/noop';

import {
  // @ts-ignore
  synchronizeFigmaTokens as sync,
  SynchronizeFigmaTokens,
} from '../../synchronize-figma-tokens';
import type { FigmaEffectStyle, FigmaPaintStyle } from '../../types';

const synchronizeFigmaTokens: SynchronizeFigmaTokens = sync;

type FigmaMockAPI = {
  getLocalPaintStyles: jest.Mock<FigmaPaintStyle[]>;
  getLocalEffectStyles: jest.Mock<FigmaEffectStyle[]>;
  createPaintStyle: jest.Mock<FigmaPaintStyle>;
  createEffectStyle: jest.Mock<FigmaEffectStyle>;
};

describe('synchronizeFigmaTokens', () => {
  let figma: FigmaMockAPI;

  beforeEach(() => {
    figma = (window as any).figma = {
      getLocalPaintStyles: jest.fn().mockReturnValue([]),
      getLocalEffectStyles: jest.fn().mockReturnValue([]),
      createPaintStyle: jest.fn(),
      createEffectStyle: jest.fn(),
    };
  });

  describe('when creating tokens', () => {
    it('should create a paint token', () => {
      const style: FigmaPaintStyle = {
        name: '',
        description: '',
        paints: [],
        remove: __noop,
      };
      figma.createPaintStyle.mockReturnValue(style);

      synchronizeFigmaTokens('AtlassianDark', {
        Color: {
          value: '#03040421',
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.1.0',
            description: 'Primary text color',
          },
        },
      });

      expect(style).toEqual(
        expect.objectContaining({
          name: 'Color',
          description: 'Primary text color',
          paints: [
            {
              blendMode: 'NORMAL',
              color: {
                b: 0.01568627450980392,
                g: 0.01568627450980392,
                r: 0.011764705882352941,
              },
              opacity: 0.13,
              type: 'SOLID',
              visible: true,
            },
          ],
        }),
      );
    });

    it('should trim token descriptions', () => {
      const style: FigmaPaintStyle = {
        name: '',
        description: '',
        paints: [],
        remove: __noop,
      };
      figma.createPaintStyle.mockReturnValue(style);

      synchronizeFigmaTokens('AtlassianDark', {
        Color: {
          value: '#03040421',
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.1.0',
            description: '    Primary text color     ',
          },
        },
      });

      expect(style).toEqual(
        expect.objectContaining({
          description: 'Primary text color',
        }),
      );
    });

    it('should trim token tagged template descriptions', () => {
      const style: FigmaPaintStyle = {
        name: '',
        description: '',
        paints: [],
        remove: __noop,
      };
      figma.createPaintStyle.mockReturnValue(style);

      synchronizeFigmaTokens('AtlassianDark', {
        Color: {
          value: '#03040421',
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.1.0',
            description: `
Primary text color
Primary text color

            `,
          },
        },
      });

      expect(style).toEqual(
        expect.objectContaining({
          description: 'Primary text color\nPrimary text color',
        }),
      );
    });

    it('should create an array of paint tokens', () => {
      const styles: FigmaPaintStyle[] = [];
      figma.createPaintStyle.mockImplementation(() => {
        const style: FigmaPaintStyle = {
          name: '',
          description: '',
          paints: [],
          remove: __noop,
        };

        styles.push(style);

        return style;
      });

      synchronizeFigmaTokens('AtlassianDark', {
        'Color/BackgroundBlanket': {
          value: '#03040421',
          attributes: {
            group: 'paint',
            description: '',
            state: 'active',
            introduced: '0.1.0',
          },
        },
        'Color/BackgroundDisabled': {
          value: '#A1BDD908',
          attributes: {
            group: 'paint',
            description: '',
            state: 'active',
            introduced: '0.1.0',
          },
        },
        'Color/BackgroundBoldBrand': {
          value: '#579DFF',
          attributes: {
            group: 'paint',
            description: '',
            state: 'active',
            introduced: '0.1.0',
          },
        },
      });

      expect(figma.createPaintStyle).toHaveBeenCalledTimes(3);

      expect(styles[0]).toEqual(
        expect.objectContaining({
          name: 'Color/BackgroundBlanket',
        }),
      );
      expect(styles[1]).toEqual(
        expect.objectContaining({
          name: 'Color/BackgroundDisabled',
        }),
      );
      expect(styles[2]).toEqual(
        expect.objectContaining({
          name: 'Color/BackgroundBoldBrand',
        }),
      );
    });

    it('should create an effect token', () => {
      const style: FigmaEffectStyle = {
        name: '',
        description: '',
        effects: [],
        remove: __noop,
      };

      figma.createEffectStyle.mockReturnValue(style);

      synchronizeFigmaTokens('AtlassianDark', {
        Color: {
          value: [
            {
              radius: 1,
              offset: {
                x: 0,
                y: 0,
              },
              color: '#161A1D',
              opacity: 0.5,
            },
          ],
          attributes: {
            group: 'shadow',
            description: '',
            state: 'active',
            introduced: '0.1.0',
          },
        },
      });

      expect(style).toEqual(
        expect.objectContaining({
          name: 'Color',
          effects: [
            {
              blendMode: 'NORMAL',
              color: {
                a: 0.5,
                b: 0.11372549019607843,
                g: 0.10196078431372549,
                r: 0.08627450980392157,
              },
              offset: { x: 0, y: 0 },
              radius: 1,
              type: 'DROP_SHADOW',
              visible: true,
            },
          ],
        }),
      );
    });
  });

  describe('when reassigning / removing tokens', () => {
    it('should remove paint token and reassign it to an effect token', () => {
      const removeMock = jest.fn();
      const newEffectStyle = {
        name: '',
        description: '',
        effects: [],
        remove: __noop,
      };

      figma.createEffectStyle.mockReturnValue(newEffectStyle);
      figma.getLocalPaintStyles.mockReturnValue([
        {
          name: 'foo',
          description: 'token description',
          paints: [],
          remove: () => removeMock('foo'),
        },
      ]);

      synchronizeFigmaTokens('AtlassianDark', {
        foo: {
          value: [],
          attributes: {
            group: 'shadow',
            description: 'token description',
            state: 'active',
            introduced: '0.1.0',
          },
        },
      });

      expect(removeMock).toHaveBeenCalledWith('foo');
      expect(newEffectStyle).toEqual(expect.objectContaining({ name: 'foo' }));
    });

    it('should remove effect token and reassign it to an paint token', () => {
      const removeMock = jest.fn();
      const newPaintStyle = {
        name: '',
        description: '',
        paints: [],
        remove: __noop,
      };

      figma.createPaintStyle.mockReturnValue(newPaintStyle);
      figma.getLocalEffectStyles.mockReturnValue([
        {
          name: 'foo',
          description: 'token description',
          effects: [],
          remove: () => removeMock('foo'),
        },
      ]);

      synchronizeFigmaTokens('AtlassianDark', {
        foo: {
          value: '#03040421',
          attributes: {
            group: 'paint',
            state: 'active',
            description: 'token description',
            introduced: '0.1.0',
          },
        },
      });

      expect(removeMock).toHaveBeenCalledWith('foo');
      expect(newPaintStyle).toEqual(expect.objectContaining({ name: 'foo' }));
    });
  });

  describe('when updating tokens', () => {
    it('should update a paint token', () => {
      const styles: FigmaPaintStyle[] = [
        {
          name: 'foo',
          description: '',
          paints: [
            {
              blendMode: 'NORMAL',
              color: {
                b: 0.0,
                g: 0.0,
                r: 0.0,
              },
              opacity: 0.33,
              type: 'SOLID',
              visible: true,
            },
          ],
          remove: __noop,
        },
      ];

      figma.getLocalPaintStyles.mockReturnValue(styles);

      synchronizeFigmaTokens('AtlassianDark', {
        foo: {
          value: '#03040421',
          attributes: {
            group: 'paint',
            description: '',
            state: 'active',
            introduced: '0.1.0',
          },
        },
      });

      expect(styles[0].paints[0]).toEqual(
        expect.objectContaining({
          color: {
            b: 0.01568627450980392,
            g: 0.01568627450980392,
            r: 0.011764705882352941,
          },
        }),
      );
    });

    it('should update an effect token', () => {
      const styles: FigmaEffectStyle[] = [
        {
          name: 'foo',
          description: '',
          effects: [
            {
              blendMode: 'NORMAL',
              color: {
                a: 0.5,
                b: 0.11372549019607843,
                g: 0.10196078431372549,
                r: 0.08627450980392157,
              },
              offset: { x: 0, y: 0 },
              radius: 1,
              type: 'DROP_SHADOW',
              visible: true,
            },
          ],
          remove: __noop,
        },
      ];

      figma.getLocalEffectStyles.mockReturnValue(styles);

      synchronizeFigmaTokens('AtlassianDark', {
        foo: {
          value: [
            {
              radius: 1,
              offset: { x: 0, y: 0 },
              color: '#ffffff',
              opacity: 0.5,
            },
          ],
          attributes: {
            group: 'shadow',
            description: '',
            state: 'active',
            introduced: '0.1.0',
          },
        },
      });

      expect(styles[0].effects[0]).toEqual(
        expect.objectContaining({
          color: { a: 0.5, b: 1, g: 1, r: 1 },
        }),
      );
    });

    it('should prefix a warning to the description of deprecated tokens', () => {
      const styles: FigmaPaintStyle[] = [
        {
          name: 'foo',
          description: 'token description',
          paints: [
            {
              blendMode: 'NORMAL',
              color: {
                b: 1,
                g: 1,
                r: 1,
              },
              opacity: 0.33,
              type: 'SOLID',
              visible: true,
            },
          ],
          remove: __noop,
        },
      ];

      figma.getLocalPaintStyles.mockReturnValue(styles);

      synchronizeFigmaTokens('AtlassianDark', {
        foo: {
          value: '#ffffff',
          attributes: {
            group: 'paint',
            state: 'deprecated',
            description: 'token description',
            introduced: '0.1.0',
            deprecated: '0.2.0',
          },
        },
      });

      expect(styles[0].description).toEqual(
        expect.stringContaining('DEPRECATED do not use. '),
      );
    });

    it('should supply replacement options in the description of deprecated tokens', () => {
      const styles: FigmaPaintStyle[] = [
        {
          name: 'foo',
          description: 'token description',
          paints: [
            {
              blendMode: 'NORMAL',
              color: {
                b: 1,
                g: 1,
                r: 1,
              },
              opacity: 0.33,
              type: 'SOLID',
              visible: true,
            },
          ],
          remove: __noop,
        },
        {
          name: 'bar',
          description: 'token description',
          paints: [
            {
              blendMode: 'NORMAL',
              color: {
                b: 1,
                g: 1,
                r: 1,
              },
              opacity: 0.33,
              type: 'SOLID',
              visible: true,
            },
          ],
          remove: __noop,
        },
      ];

      figma.getLocalPaintStyles.mockReturnValue(styles);

      synchronizeFigmaTokens('AtlassianDark', {
        foo: {
          value: '#FF0000',
          attributes: {
            group: 'paint',
            state: 'deprecated',
            introduced: '0.1.0',
            deprecated: '0.2.0',
            replacement: 'color.text.brand',
            description: 'Primary text color',
          },
        },
        bar: {
          value: '#FF0000',
          attributes: {
            group: 'paint',
            state: 'deprecated',
            introduced: '0.1.0',
            deprecated: '0.2.0',
            replacement: ['color.text.brand', 'color.text.danger'],
            description: 'Primary text color',
          },
        },
      });

      // Single replacement option
      expect(styles[0].description).toBe(
        'DEPRECATED use color.text.brand instead. \nPrimary text color',
      );

      // Multiple replacement options
      expect(styles[1].description).toBe(
        'DEPRECATED use color.text.brand | color.text.danger instead. \nPrimary text color',
      );
    });
  });

  describe('when renaming tokens', () => {
    it('should rename a paint token from foo to bar', () => {
      const styles: FigmaPaintStyle[] = [
        {
          name: 'foo',
          description: 'token description',
          paints: [
            {
              blendMode: 'NORMAL',
              color: {
                b: 1,
                g: 1,
                r: 1,
              },
              opacity: 0.33,
              type: 'SOLID',
              visible: true,
            },
          ],
          remove: __noop,
        },
      ];

      figma.getLocalPaintStyles.mockReturnValue(styles);
      figma.createPaintStyle.mockImplementationOnce(() => {
        throw new Error('This method should not be called');
      });

      synchronizeFigmaTokens(
        'AtlassianDark',
        {
          bar: {
            value: '#ffffff',
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.1.0',
              description: 'token description',
            },
          },
        },
        {
          foo: 'bar',
        },
      );

      expect(styles[0].name).toEqual('bar');
    });

    it('should rename a paint token with a deep path', () => {
      const styles: FigmaPaintStyle[] = [
        {
          name: 'Foo/Bar/Baz',
          description: 'token description',
          paints: [
            {
              blendMode: 'NORMAL',
              color: {
                b: 1,
                g: 1,
                r: 1,
              },
              opacity: 0.33,
              type: 'SOLID',
              visible: true,
            },
          ],
          remove: __noop,
        },
      ];

      figma.getLocalPaintStyles.mockReturnValue(styles);
      figma.createPaintStyle.mockImplementationOnce(() => {
        throw new Error('This method should not be called');
      });

      synchronizeFigmaTokens(
        'AtlassianDark',
        {
          'Foo/Bar/Bozzz': {
            value: '#ffffff',
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.1.0',
              description: 'token description',
            },
          },
        },
        {
          'Foo/Bar/Baz': 'Foo/Bar/Bozzz',
        },
      );

      expect(styles[0].name).toEqual('Foo/Bar/Bozzz');
    });

    it('should rename a paint token with interaction state', () => {
      const styles: FigmaPaintStyle[] = [
        {
          name: 'Foo Hover',
          description: 'token description',
          paints: [
            {
              blendMode: 'NORMAL',
              color: {
                b: 1,
                g: 1,
                r: 1,
              },
              opacity: 0.33,
              type: 'SOLID',
              visible: true,
            },
          ],
          remove: __noop,
        },
      ];

      figma.getLocalPaintStyles.mockReturnValue(styles);
      figma.createPaintStyle.mockImplementationOnce(() => {
        throw new Error('This method should not be called');
      });

      synchronizeFigmaTokens(
        'AtlassianDark',
        {
          'Bar Pressed': {
            value: '#ffffff',
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.1.0',
              description: 'token description',
            },
          },
        },
        {
          'Foo Hover': 'Bar Pressed',
        },
      );

      expect(styles[0].name).toEqual('Bar Pressed');
    });

    it('should rename an effect token', () => {
      const styles: FigmaEffectStyle[] = [
        {
          name: 'foo',
          description: 'token description',
          effects: [],
          remove: __noop,
        },
      ];

      figma.getLocalEffectStyles.mockReturnValue(styles);

      synchronizeFigmaTokens(
        'AtlassianDark',
        {
          bar: {
            value: [],
            attributes: {
              group: 'shadow',
              state: 'active',
              introduced: '0.1.0',
              description: 'token description',
            },
          },
        },
        {
          foo: 'bar',
        },
      );

      expect(styles[0].name).toEqual('bar');
    });

    it('should rename a paint style that has a modified value', () => {
      const styles: FigmaPaintStyle[] = [
        {
          name: 'foo',
          description: 'token description',
          paints: [
            {
              blendMode: 'NORMAL',
              color: {
                b: 1,
                g: 1,
                r: 1,
              },
              opacity: 1,
              type: 'SOLID',
              visible: true,
            },
          ],
          remove: __noop,
        },
      ];

      figma.getLocalPaintStyles.mockReturnValue(styles);
      figma.createPaintStyle.mockImplementation(() => {
        throw new Error('This method should not be called');
      });

      synchronizeFigmaTokens(
        'AtlassianDark',
        {
          bar: {
            value: '#000000',
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.1.0',
              description: 'token description',
            },
          },
        },
        {
          foo: 'bar',
        },
      );

      expect(styles[0].name).toEqual('bar');
      expect(styles[0].paints[0].color).toEqual({ b: 0, g: 0, r: 0 });
    });

    it('should rename an effect style that has a modified value', () => {
      const styles: FigmaEffectStyle[] = [
        {
          name: 'foo',
          description: 'token description',
          effects: [
            {
              blendMode: 'NORMAL',
              color: { a: 1, b: 1, g: 1, r: 1 },
              offset: { x: 0, y: 0 },
              radius: 1,
              type: 'DROP_SHADOW',
              visible: true,
            },
          ],
          remove: __noop,
        },
      ];

      figma.getLocalEffectStyles.mockReturnValue(styles);
      figma.createEffectStyle.mockImplementation(() => {
        throw new Error('This method should not be called');
      });
      figma.createPaintStyle.mockImplementation(() => {
        throw new Error('This method should not be called');
      });

      synchronizeFigmaTokens(
        'AtlassianDark',
        {
          bar: {
            value: [
              {
                radius: 1,
                offset: { x: 0, y: 0 },
                color: '#000000',
                opacity: 0.5,
              },
            ],
            attributes: {
              group: 'shadow',
              state: 'active',
              introduced: '0.1.0',
              description: 'token description',
            },
          },
        },
        {
          foo: 'bar',
        },
      );

      expect(styles[0].name).toEqual('bar');
      expect(styles[0].effects[0].color).toEqual({ a: 0.5, b: 0, g: 0, r: 0 });
    });
  });
});
