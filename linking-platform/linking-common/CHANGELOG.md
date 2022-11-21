# @atlaskit/linking-common

## 1.12.0

### Minor Changes

- [`6533e448c53`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6533e448c53) - [ux] Embed: Update unauthorised view text messages and use provider image if available

## 1.11.0

### Minor Changes

- [`c64e78c6e45`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c64e78c6e45) - Updates LinkingPlatformFeatureFlags type with disableLinkPickerPopupPositioningFix ff

## 1.10.1

### Patch Changes

- [`5066a68a6f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5066a68a6f5) - [ux] fix promiseDebounce to ensure usage of the latest debounced value

## 1.10.0

### Minor Changes

- [`99035cb130b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99035cb130b) - introduce useLinkPickerScrollingTabs feature flag

## 1.9.2

### Patch Changes

- [`6af519d2a17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6af519d2a17) - Upgrade json-ld-types from 3.0.2 to 3.1.0

## 1.9.1

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 1.9.0

### Minor Changes

- [`86c47a3f711`](https://bitbucket.org/atlassian/atlassian-frontend/commits/86c47a3f711) - Added search ratelimit error

## 1.8.0

### Minor Changes

- [`61acd5bc2d0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61acd5bc2d0) - Added more search errors

## 1.7.0

### Minor Changes

- [`826112611c2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/826112611c2) - Update embed preview feature flag type to generic string

## 1.6.0

### Minor Changes

- [`d2439a3c65d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2439a3c65d) - [ux] Embed Preview Modal: Add experiment modal with new UX and resize functionality (behind feature flag)

## 1.5.2

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 1.5.1

### Patch Changes

- [`9b79278f983`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b79278f983) - Fix promise debounce to support rejects

## 1.5.0

### Minor Changes

- [`3b5e61f9b3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b5e61f9b3b) - [ux] Adds in TAB UI support for Link Picker

## 1.4.0

### Minor Changes

- [`e15410365b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e15410365b2) - - export types/functions in linking common to be used in smart card

  - add flag to card action to override re-using previous 'resolved' state

  - add prop to cardState which reflects the metadata state, can be pending, resolved or errored

  - modified reducer and dispatchers to handle these new props

## 1.3.0

### Minor Changes

- [`0fa3ac70ed0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0fa3ac70ed0) - Restores backwards compatibility that was broken in 1.2.x

## 1.2.1

### Patch Changes

- [`5db7cbdb520`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5db7cbdb520) - XPC3P-23 Add types for search dialog

## 1.2.0

### Minor Changes

- [`cd5e63258cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd5e63258cd) - Moved extractors to linking-common/extractors

## 1.1.3

### Patch Changes

- [`b2032a5f6e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2032a5f6e3) - Add FF support to <LinkProvider />

  ```
  import { SmartCardProvider, useFeatureFlag } from '@atlaskit/link-provider';

  const MyComponent = () => {
    const showHoverPreview = useFeatureFlag('showHoverPreview')

    return (
      <>
        {showHoverPreview}
      </>
    )
  }

  <SmartCardProvider featureFlags={{showHoverPreview: true}}>
    <MyComponent />
  </SmartCardProvider>
  ```

## 1.1.2

### Patch Changes

- [`f538640e3a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f538640e3a5) - fix: Previously the .reload() action would not propagate changes through to the smart-card state in some scenarios. This has been amended by making it an explicit Redux action.

## 1.1.1

### Patch Changes

- [`50b81e07a35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50b81e07a35) - Version of package 'json-ld-types' was upgraded to 2.4.2

## 1.1.0

### Minor Changes

- [`f69424339b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f69424339b2) - Expose common types and helpers from linking-common rather than from link-picker

## 1.0.2

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 1.0.1

### Patch Changes

- [`84d7a6b11a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/84d7a6b11a4) - Create @atlaskit/linking-common
