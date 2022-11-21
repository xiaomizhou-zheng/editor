# @atlaskit/progress-bar

## 0.5.12

### Patch Changes

- [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op change to introduce spacing tokens to design system components.

## 0.5.11

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 0.5.10

### Patch Changes

- [`8eb92195540`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8eb92195540) - Updates `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.
- Updated dependencies

## 0.5.9

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 0.5.8

### Patch Changes

- [`7d4fbb433e7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d4fbb433e7) - Internal styles refactor after turning on the static styles tech stack.
- [`247bf9bb0e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/247bf9bb0e4) - Introduces `testId` prop for use for automated tests.
- [`54deac49754`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54deac49754) - [ux] Appearance prop now available for default, success, and inverse appearances.
- [`c960c028450`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c960c028450) - Adds jsdoc descriptions to exported components.
- Updated dependencies

## 0.5.7

### Patch Changes

- Updated dependencies

## 0.5.6

### Patch Changes

- Updated dependencies

## 0.5.5

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 0.5.4

### Patch Changes

- Updated dependencies

## 0.5.3

### Patch Changes

- [`e928aca1693`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e928aca1693) - Using latest color.background.inverse.subtle token

## 0.5.2

### Patch Changes

- Updated dependencies

## 0.5.1

### Patch Changes

- [`cc9f9e1d294`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc9f9e1d294) - Adds warning in developer console for `theme` prop, which is going to be deprecated after 13 May 2022.

## 0.5.0

### Minor Changes

- [`53060e14621`](https://bitbucket.org/atlassian/atlassian-frontend/commits/53060e14621) - [ux] Instrumented `progress-bar` with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).
  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- Updated dependencies

## 0.4.0

### Minor Changes

- [`9d0e0a31638`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d0e0a31638) - Adds ariaLabel prop to progress bar for accessibility

## 0.3.9

### Patch Changes

- Updated dependencies

## 0.3.8

### Patch Changes

- [`c5785203506`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c5785203506) - Updated homepage in package.json

## 0.3.7

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 0.3.6

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 0.3.5

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 0.3.4

### Patch Changes

- Updated dependencies

## 0.3.3

### Patch Changes

- [`b284fba3d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b284fba3d1) - Components that had missing names are now fixed - this helps when looking for them using the React Dev Tools.

## 0.3.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 0.3.1

### Patch Changes

- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable

## 0.3.0

### Minor Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 0.2.9

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 0.2.8

### Patch Changes

- [`974d594a23`](https://bitbucket.org/atlassian/atlassian-frontend/commits/974d594a23) - Change imports to comply with Atlassian conventions

## 0.2.7

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/theme@9.5.1

## 0.2.6

### Patch Changes

- [patch][557a8e2451](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a8e2451):

  Rebuilds package to fix typescript typing error.

## 0.2.5

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 0.2.4

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 0.2.3

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

  bugfix, fixes missing version.json file

## 0.2.2

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 0.2.1

### Patch Changes

- [patch][7fd8d40029](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7fd8d40029):

  Fix invalid "module" field. The package should expose _.js file instead of _.ts

## 0.2.0

- [minor][06e6dd5731](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06e6dd5731):

  - Initial release of Progress Bar component.

## 0.1.0

- [minor][b2eb85b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b2eb85b):

  - Initial release of Progress Bar component.
