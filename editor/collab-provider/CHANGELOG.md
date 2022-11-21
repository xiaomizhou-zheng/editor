# @atlaskit/collab-provider

## 7.6.3

### Patch Changes

- [`1a64a3e3e53`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a64a3e3e53) - ESS-2591 Reduce initial re-connection delay and increase randomization factor for socket io connections.
- [`ee8ac15d730`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee8ac15d730) - ESS-1363 add packageVersion to analytic events
- [`29292da81d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/29292da81d7) - Increased the limits for the collab sync on returning the document to the consumer
- [`e06f8ba062f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e06f8ba062f) - Disable collab provider transport closing on the beforeunload event.
- Updated dependencies

## 7.6.2

### Patch Changes

- Updated dependencies

## 7.6.1

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`
- Updated dependencies

## 7.6.0

### Minor Changes

- [`5bd58e91664`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5bd58e91664) - [ESS-2513] Add tracking for number of participants in analytics

### Patch Changes

- Updated dependencies

## 7.5.1

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.
- Updated dependencies

## 7.5.0

### Minor Changes

- [`1c555e79e56`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1c555e79e56) - Added the capability to pass product information (product & sub-product) to the collab service
- [`247420a48f7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/247420a48f7) - [ESS-1050] Return ADF document from getFinalAcknowledgedState
- [`17f1b0b87cc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17f1b0b87cc) - ESS-1019 changes the reconnectionDelayMax to 128s to reduce the reconnection storm.

### Patch Changes

- [`bf848f39cb1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf848f39cb1) - ESS-2419 Emit the reason of permission errors to the consumers of collab-provider
- [`680dc155ebc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/680dc155ebc) - Raise errors in the collab provider when the server fails loading initilisation data
- Updated dependencies

## 7.4.4

### Patch Changes

- Updated dependencies

## 7.4.3

### Patch Changes

- [`ec2f2d0b804`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec2f2d0b804) - ED-14734: Add analytics to track time to connect to collab service, as well as tracking document initial load time.

## 7.4.2

### Patch Changes

- Updated dependencies

## 7.4.1

### Patch Changes

- Updated dependencies

## 7.4.0

### Minor Changes

- [`de9e3c28026`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de9e3c28026) - [ED-14689] Refactor getFinalAcknowledgedState to only wait for the unconfirmed steps at the time of calling it to be confirmed. It will no longer wait for there to be no unconfirmed steps at all.

### Patch Changes

- Updated dependencies

## 7.3.1

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4
- Updated dependencies

## 7.3.0

### Minor Changes

- [`617085788ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/617085788ed) - Allow collab provider to opt-in for 404 responses from NCS backend

## 7.2.0

### Minor Changes

- [`502a39af839`](https://bitbucket.org/atlassian/atlassian-frontend/commits/502a39af839) - Allow collab provider to opt-in for 404 responses from NCS backend

## 7.1.8

### Patch Changes

- Updated dependencies

## 7.1.7

### Patch Changes

- Updated dependencies

## 7.1.6

### Patch Changes

- [`5d5d6468ba9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d5d6468ba9) - Remove url-parse from collab-provider

  Url-parse can be replaced with the built-in URL constructor

## 7.1.5

### Patch Changes

- [`f82fb6c48f7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f82fb6c48f7) - [ED-13911] Fix cycle dependencies
- [`97412280671`](https://bitbucket.org/atlassian/atlassian-frontend/commits/97412280671) - [ED-13939] Add analytics event to track "can't syncup with collab service" error
- [`88ada10af2c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/88ada10af2c) - [ED-14097] Moved getFinalAcknowledgedState control to editor and made the API public
- [`85648c038a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/85648c038a4) - ED-13939 Rename newCollabSyncUpError analytics event to newCollabSyncUpErrorNoSteps
- [`e292f108d4b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e292f108d4b) - Ensure metadata is persisted when it is updated by another participant during an editing session
- Updated dependencies

## 7.1.4

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - ED-13912 refactor editor collab-provider and make sure that initializeChannel is only called once
- Updated dependencies

## 7.1.3

### Patch Changes

- [`c55c736ecea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55c736ecea) - Patch VULN AFP-3486 AFP-3487 AFP-3488 AFP-3489

## 7.1.2

### Patch Changes

- Updated dependencies

## 7.1.1

### Patch Changes

- [`c6feed82071`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6feed82071) - ED-11632: Bump prosemirror packages;

  - prosmirror-commands 1.1.4 -> 1.1.11,
  - prosemirror-model 1.11.0 -> 1.14.3,
  - prosemirror-state 1.3.3 -> 1.3.4,
  - prosemirror-transform 1.2.8 -> 1.3.2,
  - prosemirror-view 1.15.4 + 1.18.8 -> 1.20.2.

- [`b670f0469c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b670f0469c4) - COLLAB-990: fixing duplciated avatar
- Updated dependencies

## 7.1.0

### Minor Changes

- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - COLLAB-411-change-to-metadata: 'setTitle' and 'setEditorWidth' are deprecated, going to be removed in the next release, use 'setMetadata' instead.
- [`10d7bc384aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/10d7bc384aa) - COLLAB-933: add disconnected event

### Patch Changes

- Updated dependencies

## 7.0.1

### Patch Changes

- [`2f5b81920af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f5b81920af) - Refactor the provider class in collab provider
- [`0ec1c930f96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ec1c930f96) - NONE: tuning catchup trigger
- Updated dependencies

## 7.0.0

### Major Changes

- [`6090cc1cf57`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6090cc1cf57) - COLLAB-820: use `permissionTokenRefresh` for custom JWT token

### Patch Changes

- [`66404f5a168`](https://bitbucket.org/atlassian/atlassian-frontend/commits/66404f5a168) - NONE: only proactively catchup after offline enough
- Updated dependencies

## 6.5.0

### Minor Changes

- [`91a481d1b7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/91a481d1b7d) - Add analytics for catchup

### Patch Changes

- [`ae79161f6dc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae79161f6dc) - COLLAB-808: fix error handle
- [`bea14ccfb27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bea14ccfb27) - NONE: fix throttledCommit and error counter
- Updated dependencies

## 6.4.2

### Patch Changes

- [`ae910a43cf9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae910a43cf9) - COLLAB-537: fix reconnect fail to trigger
- Updated dependencies

## 6.4.1

### Patch Changes

- [`a87567a24b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a87567a24b3) - fix catchup
- Updated dependencies

## 6.4.0

### Minor Changes

- [`8efef26a27e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8efef26a27e) - [COLLAB-683] Removed debounce and throttle from Collab Provider due to sync delay on Confluence

## 6.3.1

### Patch Changes

- Updated dependencies

## 6.3.0

### Minor Changes

- [`8734a8b70a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8734a8b70a8) - allow consumers to circumvent hard editor coupling

### Patch Changes

- Updated dependencies

## 6.2.0

### Minor Changes

- [`e6cc5277203`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6cc5277203) - COLLAB-388: emit 404 error event when document not found in Collab Service

### Patch Changes

- [`a2d14a3865e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2d14a3865e) - VULN-304542: bump socket.io client to V4, it's major but no breaking change.
- [`6f0c71a2a95`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6f0c71a2a95) - put collab-provider logger under flag, set `window.COLLAB_PROVIDER_LOGGER` to true to see the logs.
- Updated dependencies

## 6.1.0

### Minor Changes

- [`15d11ecc623`](https://bitbucket.org/atlassian/atlassian-frontend/commits/15d11ecc623) - COLLAB-482: change no permission error code to 403

## 6.0.0

### Major Changes

- [`b010a665e13`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b010a665e13) - Bump socket IO to version 3 for collab provider

### Minor Changes

- [`29746d1123e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/29746d1123e) - Emit errors to consumers

### Patch Changes

- [`b74caaa43e9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b74caaa43e9) - add reserveCursor option to init event
- [`c54aacca521`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c54aacca521) - getFinalAcknowledgedState ensure unconfirmed steps confirmed
- [`cff5c406985`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cff5c406985) - Fix issue with socket io client v3 not attaching cookies into request
- [`226fce80d0d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/226fce80d0d) - Fix: potential race condition for catchup
- [`09040efc1a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/09040efc1a4) - pauseQueue should always reset
- Updated dependencies

## 5.2.0

### Minor Changes

- [`360a14b1d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/360a14b1d2) - fix issue with empty string for title and editor width
- [`2ef9970ee2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ef9970ee2) - add analytics for collab provider
- [`1c0473e050`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1c0473e050) - Collab provider to support custom share token for embedded confluence page

## 5.1.0

### Minor Changes

- [`3f6006306a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f6006306a) - add stepVersion into getFinalAcknowledgedState

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- [`f9cd884b7e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f9cd884b7e) - Fix issue with emitting noisy empty presence events.
- Updated dependencies

## 5.0.0

### Major Changes

- [`da77198e43`](https://bitbucket.org/atlassian/atlassian-frontend/commits/da77198e43) - Rename title:changed to metadata:changed in collab provider, editor common and mobile bridge

### Patch Changes

- Updated dependencies

## 4.1.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 4.1.0

### Minor Changes

- [`c3ce422cd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3ce422cd4) - COLLAB-11-trigger-catchup-5s
- [`474b09e4c0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/474b09e4c0) - COLLAB-11 steps rejected error handler

### Patch Changes

- Updated dependencies

## 4.0.0

### Major Changes

- [`e3b2251f29`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3b2251f29) - Breaking change for collab provider as userId has been removed from constructor. Mobile bridge and editor demo app require an upgrade too

### Patch Changes

- [`19a4732268`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19a4732268) - use reconnect to trigger catchup
- [`703752d487`](https://bitbucket.org/atlassian/atlassian-frontend/commits/703752d487) - ED-10647 Remove caret from prosemirror-model, prosemirror-keymap, prosemirror-state, prosemirror-transform to lock them down to an explicit version
- Updated dependencies

## 3.3.2

### Patch Changes

- [`ac54a7870c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac54a7870c) - Remove extraneous dependencies rule suppression

## 3.3.1

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 3.3.0

### Minor Changes

- [`9a39500244`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a39500244) - Bump ProseMirror packages

  Read more: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1671956531/2020-08

- [`4ea3c66256`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ea3c66256) - optimize-title-sync

### Patch Changes

- [`3e9f1f6b57`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e9f1f6b57) - CS-3100: Fix for fast keystrokes issue on collab-provider
- Updated dependencies

## 3.2.3

### Patch Changes

- Updated dependencies

## 3.2.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 3.2.1

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 3.2.0

### Minor Changes

- [`4809ed1b20`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4809ed1b20) - fix many infinite heartbeats

### Patch Changes

- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages
- Updated dependencies

## 3.1.0

### Minor Changes

- [`90a0d166b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/90a0d166b3) - fix: pass the correct path to resolve the conflict with http
- [`372494e25b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/372494e25b) - add path to collab provider

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [`3eb98cd820`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3eb98cd820) - ED-9367 Add required config argument to `createSocket`

### Minor Changes

- [`f90d5a351e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f90d5a351e) - ED-9367 Create entry point with a collab provider factory pre-configured with SocketIO
- [`f80f07b072`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f80f07b072) - ED-9451 Support lifecycle emitter on configuration
- [`8814c0a119`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8814c0a119) - ED-9451 Support for custom storage interface

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [`473504379b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/473504379b) - ED-9367 Use collab entry point on editor-common
- [`0d43df75cb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d43df75cb) - Add unit tests for channel.ts
- Updated dependencies

## 1.0.1

### Patch Changes

- [`56a7357c81`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56a7357c81) - ED-9197: upgrade prosemirror-transform to prevent cut and paste type errors

  It's important to make sure that there isn't any `prosemirror-transform` packages with version less than 1.2.5 in `yarn.lock`.- Updated dependencies

## 1.0.0

### Major Changes

- [major][c0b8c92b2e](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0b8c92b2e):

  catchup if behind the server

### Patch Changes

- Updated dependencies [c74cc954d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/c74cc954d8):
- Updated dependencies [b4326a7eba](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4326a7eba):
- Updated dependencies [e4076915c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4076915c8):
- Updated dependencies [05539b052e](https://bitbucket.org/atlassian/atlassian-frontend/commits/05539b052e):
- Updated dependencies [205b05851a](https://bitbucket.org/atlassian/atlassian-frontend/commits/205b05851a):
- Updated dependencies [0b22d3b9ea](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b22d3b9ea):
- Updated dependencies [b4ef7fe214](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4ef7fe214):
- Updated dependencies [67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):
- Updated dependencies [6eb8c0799f](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eb8c0799f):
  - @atlaskit/editor-common@45.0.0

## 0.1.1

### Patch Changes

- [patch][cf86087ae2](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf86087ae2):

  ED-8751 Remove 'export \*' from collab-provider- [patch][4955ff3d36](https://bitbucket.org/atlassian/atlassian-frontend/commits/4955ff3d36):

  Minor package.json config compliance updates- Updated dependencies [bc29fbc030](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc29fbc030):

- Updated dependencies [7d80e44c09](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d80e44c09):
- Updated dependencies [d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):
- Updated dependencies [0a0a54cb47](https://bitbucket.org/atlassian/atlassian-frontend/commits/0a0a54cb47):
- Updated dependencies [fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):
- Updated dependencies [cc54ca2490](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc54ca2490):
  - @atlaskit/editor-common@44.1.0

## 0.1.0

### Minor Changes

- [minor][bc380c30ce](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc380c30ce):

  New collab provider

### Patch Changes

- Updated dependencies [bc380c30ce](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc380c30ce):
- Updated dependencies [5bb23adac3](https://bitbucket.org/atlassian/atlassian-frontend/commits/5bb23adac3):
- Updated dependencies [025842de1a](https://bitbucket.org/atlassian/atlassian-frontend/commits/025842de1a):
- Updated dependencies [395739b5ef](https://bitbucket.org/atlassian/atlassian-frontend/commits/395739b5ef):
  - @atlaskit/editor-common@44.0.2
