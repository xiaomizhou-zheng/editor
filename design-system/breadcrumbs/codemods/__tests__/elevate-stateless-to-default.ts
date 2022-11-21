// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
jest.autoMockOff();

import { elevateStatelessToDefault } from '../migrates/elevate-stateless-to-default';
import { createTransformer } from '../utils';

const transformer = createTransformer('@atlaskit/breadcrumbs', [
  elevateStatelessToDefault,
]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Elevate BreadcrumbsStateless', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Breadcrumbs from '@atlaskit/breadcrumbs';

    export default () => (
      <Breadcrumbs testId="BreadcrumbsTestId" />
    );
    `,
    `
    import React from 'react';
    import Breadcrumbs from '@atlaskit/breadcrumbs';

    export default () => (
      <Breadcrumbs testId="BreadcrumbsTestId" />
    );
    `,
    'nothing would change if Breadcrumbs is used',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { BreadcrumbsStateless, BreadcrumbsItem} from '@atlaskit/breadcrumbs';

    export default () => (
      <BreadcrumbsStateless testId="BreadcrumbsTestId" />
    );
    `,
    `
    import React from 'react';
    import BreadcrumbsStateless, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';

    export default () => (
      <BreadcrumbsStateless testId="BreadcrumbsTestId" />
    );
    `,
    'elevate  BreadcrumbsStateless to default import and do not change other named imports',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { BreadcrumbsStateless as BCStateless, BreadcrumbsItem as Item} from '@atlaskit/breadcrumbs';
    `,
    `
    import React from 'react';
    import BCStateless, { BreadcrumbsItem as Item } from '@atlaskit/breadcrumbs';
    `,
    'elevate to new BCStateless default import when BreadcrumbsStateless has alias',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { BreadcrumbsStateless as Breadcrumbs } from '@atlaskit/breadcrumbs';

    export default () => (
      <Breadcrumbs testId="BreadcrumbsTestId" />
    );
    `,
    `
    import React from 'react';
    import Breadcrumbs from '@atlaskit/breadcrumbs';

    export default () => (
      <Breadcrumbs testId="BreadcrumbsTestId" />
    );
    `,
    'change to new Breadcrumbs when BreadcrumbsStateless is used with alias',
  );
});
