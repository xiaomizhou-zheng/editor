# @atlaskit/editor-cq-transformer

## 8.1.31

### Patch Changes

- Updated dependencies

## 8.1.30

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 8.1.29

### Patch Changes

- Updated dependencies

## 8.1.28

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 8.1.27

### Patch Changes

- Updated dependencies

## 8.1.26

### Patch Changes

- Updated dependencies

## 8.1.25

### Patch Changes

- Updated dependencies

## 8.1.24

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 8.1.23

### Patch Changes

- [`b29ce16dad8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b29ce16dad8) - [ED-14606] Move bitbucket schema, confluence schema, jira schema, and default schema from @atlaskit/adf-schema to their own entry points. These new entry points are as follows

  @atlaskit/adf-schema/schema-bitbucket for:

  - bitbucketSchema

  @atlaskit/adf-schema/schema-confluence for:

  - confluenceSchema
  - confluenceSchemaWithMediaSingle

  @atlaskit/adf-schema/schema-jira for:

  - default as createJIRASchema
  - isSchemaWithLists
  - isSchemaWithMentions
  - isSchemaWithEmojis
  - isSchemaWithLinks
  - isSchemaWithAdvancedTextFormattingMarks
  - isSchemaWithCodeBlock
  - isSchemaWithBlockQuotes
  - isSchemaWithMedia
  - isSchemaWithSubSupMark
  - isSchemaWithTextColor
  - isSchemaWithTables

  @atlaskit/adf-schema/schema-default for:

  - defaultSchema
  - getSchemaBasedOnStage
  - defaultSchemaConfig

  This change also includes codemods in @atlaskit/adf-schema to update these entry points. It also introduces a new util function "changeImportEntryPoint" to @atlaskit/codemod-utils to handle this scenario.

- Updated dependencies

## 8.1.22

### Patch Changes

- Updated dependencies

## 8.1.21

### Patch Changes

- Updated dependencies

## 8.1.20

### Patch Changes

- Updated dependencies

## 8.1.19

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - ED-13753 Updated editor-common import entries.
- Updated dependencies

## 8.1.18

### Patch Changes

- Updated dependencies

## 8.1.17

### Patch Changes

- [`c6feed82071`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6feed82071) - ED-11632: Bump prosemirror packages;

  - prosmirror-commands 1.1.4 -> 1.1.11,
  - prosemirror-model 1.11.0 -> 1.14.3,
  - prosemirror-state 1.3.3 -> 1.3.4,
  - prosemirror-transform 1.2.8 -> 1.3.2,
  - prosemirror-view 1.15.4 + 1.18.8 -> 1.20.2.

- Updated dependencies

## 8.1.16

### Patch Changes

- Updated dependencies

## 8.1.15

### Patch Changes

- Updated dependencies

## 8.1.14

### Patch Changes

- Updated dependencies

## 8.1.13

### Patch Changes

- Updated dependencies

## 8.1.12

### Patch Changes

- Updated dependencies

## 8.1.11

### Patch Changes

- Updated dependencies

## 8.1.10

### Patch Changes

- Updated dependencies

## 8.1.9

### Patch Changes

- Updated dependencies

## 8.1.8

### Patch Changes

- Updated dependencies

## 8.1.7

### Patch Changes

- Updated dependencies

## 8.1.6

### Patch Changes

- Updated dependencies

## 8.1.5

### Patch Changes

- Updated dependencies

## 8.1.4

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 8.1.3

### Patch Changes

- [`0175a00afc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0175a00afc) - [ED-10670] Update prosemirror-model type to use posAtIndex methods
- Updated dependencies

## 8.1.2

### Patch Changes

- [`703752d487`](https://bitbucket.org/atlassian/atlassian-frontend/commits/703752d487) - ED-10647 Remove caret from prosemirror-model, prosemirror-keymap, prosemirror-state, prosemirror-transform to lock them down to an explicit version
- Updated dependencies

## 8.1.1

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 8.1.0

### Minor Changes

- [`9a39500244`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a39500244) - Bump ProseMirror packages

  Read more: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1671956531/2020-08

### Patch Changes

- [`78b192acc9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78b192acc9) - ED-10169 Update imports for style constants from @atlaskit/editor-common to @atlaskit/editor-shared-styles
- Updated dependencies

## 8.0.5

### Patch Changes

- Updated dependencies

## 8.0.4

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 8.0.3

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 8.0.2

### Patch Changes

- Updated dependencies

## 8.0.1

### Patch Changes

- Updated dependencies

## 8.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 7.4.0

### Minor Changes

- [`0ae829a4ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ae829a4ea) - EDM-648: Adds resizing and alignment to embed cards

### Patch Changes

- Updated dependencies

## 7.3.20

### Patch Changes

- Updated dependencies

## 7.3.19

### Patch Changes

- Updated dependencies

## 7.3.18

### Patch Changes

- Updated dependencies [7e4d4a7ed4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e4d4a7ed4):
- Updated dependencies [999fbf849e](https://bitbucket.org/atlassian/atlassian-frontend/commits/999fbf849e):
- Updated dependencies [b202858f6c](https://bitbucket.org/atlassian/atlassian-frontend/commits/b202858f6c):
- Updated dependencies [9cee2b03e8](https://bitbucket.org/atlassian/atlassian-frontend/commits/9cee2b03e8):
- Updated dependencies [26de083801](https://bitbucket.org/atlassian/atlassian-frontend/commits/26de083801):
- Updated dependencies [d3cc97a424](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3cc97a424):
- Updated dependencies [00f64f4eb8](https://bitbucket.org/atlassian/atlassian-frontend/commits/00f64f4eb8):
- Updated dependencies [4f70380793](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f70380793):
- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [92d04b5c28](https://bitbucket.org/atlassian/atlassian-frontend/commits/92d04b5c28):
- Updated dependencies [5b301bcdf6](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b301bcdf6):
- Updated dependencies [729a4e4960](https://bitbucket.org/atlassian/atlassian-frontend/commits/729a4e4960):
- Updated dependencies [22704db5a3](https://bitbucket.org/atlassian/atlassian-frontend/commits/22704db5a3):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [c8d0ce5b94](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8d0ce5b94):
- Updated dependencies [384791fb2b](https://bitbucket.org/atlassian/atlassian-frontend/commits/384791fb2b):
- Updated dependencies [c6b145978b](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6b145978b):
- Updated dependencies [736507f8e0](https://bitbucket.org/atlassian/atlassian-frontend/commits/736507f8e0):
- Updated dependencies [cf41823165](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf41823165):
- Updated dependencies [9e3646b59e](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e3646b59e):
- Updated dependencies [aec7fbadcc](https://bitbucket.org/atlassian/atlassian-frontend/commits/aec7fbadcc):
- Updated dependencies [e477132440](https://bitbucket.org/atlassian/atlassian-frontend/commits/e477132440):
  - @atlaskit/editor-core@122.0.0
  - @atlaskit/editor-common@45.1.0
  - @atlaskit/button@13.3.11
  - @atlaskit/adf-schema@9.0.1
  - @atlaskit/editor-test-helpers@11.1.1

## 7.3.17

### Patch Changes

- Updated dependencies [2a87a3bbc5](https://bitbucket.org/atlassian/atlassian-frontend/commits/2a87a3bbc5):
- Updated dependencies [04e54bf405](https://bitbucket.org/atlassian/atlassian-frontend/commits/04e54bf405):
- Updated dependencies [cf7a2d7506](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf7a2d7506):
- Updated dependencies [759f0a5ca7](https://bitbucket.org/atlassian/atlassian-frontend/commits/759f0a5ca7):
- Updated dependencies [9f43b9f0ca](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f43b9f0ca):
- Updated dependencies [c74cc954d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/c74cc954d8):
- Updated dependencies [b4326a7eba](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4326a7eba):
- Updated dependencies [e4076915c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4076915c8):
- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies [bdb4da1fc0](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdb4da1fc0):
- Updated dependencies [c51f0b4c70](https://bitbucket.org/atlassian/atlassian-frontend/commits/c51f0b4c70):
- Updated dependencies [7ec160c0e2](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ec160c0e2):
- Updated dependencies [5d430f7d37](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d430f7d37):
- Updated dependencies [7e26fba915](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e26fba915):
- Updated dependencies [5167f09a83](https://bitbucket.org/atlassian/atlassian-frontend/commits/5167f09a83):
- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [91ff8d36f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/91ff8d36f0):
- Updated dependencies [05539b052e](https://bitbucket.org/atlassian/atlassian-frontend/commits/05539b052e):
- Updated dependencies [a1ee397cbc](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1ee397cbc):
- Updated dependencies [dc84dfa3bc](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc84dfa3bc):
- Updated dependencies [318a1a0f2f](https://bitbucket.org/atlassian/atlassian-frontend/commits/318a1a0f2f):
- Updated dependencies [550c4b5018](https://bitbucket.org/atlassian/atlassian-frontend/commits/550c4b5018):
- Updated dependencies [03a83cb954](https://bitbucket.org/atlassian/atlassian-frontend/commits/03a83cb954):
- Updated dependencies [e21800fd1c](https://bitbucket.org/atlassian/atlassian-frontend/commits/e21800fd1c):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [205b05851a](https://bitbucket.org/atlassian/atlassian-frontend/commits/205b05851a):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies [823d80f31c](https://bitbucket.org/atlassian/atlassian-frontend/commits/823d80f31c):
- Updated dependencies [41917f4c16](https://bitbucket.org/atlassian/atlassian-frontend/commits/41917f4c16):
- Updated dependencies [0b22d3b9ea](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b22d3b9ea):
- Updated dependencies [91304da441](https://bitbucket.org/atlassian/atlassian-frontend/commits/91304da441):
- Updated dependencies [b4ef7fe214](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4ef7fe214):
- Updated dependencies [3644fc1afe](https://bitbucket.org/atlassian/atlassian-frontend/commits/3644fc1afe):
- Updated dependencies [971df84f45](https://bitbucket.org/atlassian/atlassian-frontend/commits/971df84f45):
- Updated dependencies [0ab75c545b](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ab75c545b):
- Updated dependencies [62f1f218d9](https://bitbucket.org/atlassian/atlassian-frontend/commits/62f1f218d9):
- Updated dependencies [67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):
- Updated dependencies [6eb8c0799f](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eb8c0799f):
- Updated dependencies [5f75dd27c9](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f75dd27c9):
- Updated dependencies [f3587bae11](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3587bae11):
- Updated dependencies [287be84065](https://bitbucket.org/atlassian/atlassian-frontend/commits/287be84065):
- Updated dependencies [fb8725beac](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb8725beac):
  - @atlaskit/editor-core@121.0.0
  - @atlaskit/adf-schema@9.0.0
  - @atlaskit/editor-common@45.0.0
  - @atlaskit/docs@8.5.1
  - @atlaskit/editor-test-helpers@11.1.0
  - @atlaskit/theme@9.5.3
  - @atlaskit/button@13.3.10

## 7.3.16

### Patch Changes

- Updated dependencies [9fd8ba7707](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fd8ba7707):
- Updated dependencies [bc29fbc030](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc29fbc030):
- Updated dependencies [7d80e44c09](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d80e44c09):
- Updated dependencies [4c691c3b5f](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c691c3b5f):
- Updated dependencies [d63513575b](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63513575b):
- Updated dependencies [1386afaecc](https://bitbucket.org/atlassian/atlassian-frontend/commits/1386afaecc):
- Updated dependencies [48f0ecf23e](https://bitbucket.org/atlassian/atlassian-frontend/commits/48f0ecf23e):
- Updated dependencies [130b83ccba](https://bitbucket.org/atlassian/atlassian-frontend/commits/130b83ccba):
- Updated dependencies [5180a51c0d](https://bitbucket.org/atlassian/atlassian-frontend/commits/5180a51c0d):
- Updated dependencies [584279e2ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/584279e2ae):
- Updated dependencies [067febb0a7](https://bitbucket.org/atlassian/atlassian-frontend/commits/067febb0a7):
- Updated dependencies [66cf61863f](https://bitbucket.org/atlassian/atlassian-frontend/commits/66cf61863f):
- Updated dependencies [f83b67a761](https://bitbucket.org/atlassian/atlassian-frontend/commits/f83b67a761):
- Updated dependencies [22d9c96ed2](https://bitbucket.org/atlassian/atlassian-frontend/commits/22d9c96ed2):
- Updated dependencies [a9e9604c8e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a9e9604c8e):
- Updated dependencies [8126e7648c](https://bitbucket.org/atlassian/atlassian-frontend/commits/8126e7648c):
- Updated dependencies [b41beace3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/b41beace3f):
- Updated dependencies [02425bf2d7](https://bitbucket.org/atlassian/atlassian-frontend/commits/02425bf2d7):
- Updated dependencies [6b4fe5d0e0](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b4fe5d0e0):
- Updated dependencies [953cfadbe3](https://bitbucket.org/atlassian/atlassian-frontend/commits/953cfadbe3):
- Updated dependencies [29b0315dcb](https://bitbucket.org/atlassian/atlassian-frontend/commits/29b0315dcb):
- Updated dependencies [4bec09aa74](https://bitbucket.org/atlassian/atlassian-frontend/commits/4bec09aa74):
- Updated dependencies [aa4dc7f5d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa4dc7f5d6):
- Updated dependencies [d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):
- Updated dependencies [13a0e50f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/13a0e50f38):
- Updated dependencies [0a0a54cb47](https://bitbucket.org/atlassian/atlassian-frontend/commits/0a0a54cb47):
- Updated dependencies [6dcad31e41](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dcad31e41):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies [bdf25b1c4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdf25b1c4c):
- Updated dependencies [6242ec17a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/6242ec17a2):
- Updated dependencies [6b65ae4f04](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b65ae4f04):
- Updated dependencies [645918eda6](https://bitbucket.org/atlassian/atlassian-frontend/commits/645918eda6):
- Updated dependencies [fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):
- Updated dependencies [715572f9e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/715572f9e5):
- Updated dependencies [cc54ca2490](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc54ca2490):
  - @atlaskit/editor-core@120.0.0
  - @atlaskit/adf-schema@8.0.0
  - @atlaskit/editor-common@44.1.0
  - @atlaskit/editor-test-helpers@11.0.0
  - @atlaskit/docs@8.5.0

## 7.3.15

### Patch Changes

- Updated dependencies [bc380c30ce](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc380c30ce):
- Updated dependencies [cc0d9f6ede](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc0d9f6ede):
- Updated dependencies [6384746272](https://bitbucket.org/atlassian/atlassian-frontend/commits/6384746272):
- Updated dependencies [7602615cd4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7602615cd4):
- Updated dependencies [956a70b918](https://bitbucket.org/atlassian/atlassian-frontend/commits/956a70b918):
- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [3494940acd](https://bitbucket.org/atlassian/atlassian-frontend/commits/3494940acd):
- Updated dependencies [5bb23adac3](https://bitbucket.org/atlassian/atlassian-frontend/commits/5bb23adac3):
- Updated dependencies [ebee5c7429](https://bitbucket.org/atlassian/atlassian-frontend/commits/ebee5c7429):
- Updated dependencies [680a61dc5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/680a61dc5a):
- Updated dependencies [57096fc043](https://bitbucket.org/atlassian/atlassian-frontend/commits/57096fc043):
- Updated dependencies [b17120e768](https://bitbucket.org/atlassian/atlassian-frontend/commits/b17120e768):
- Updated dependencies [92e0b393f5](https://bitbucket.org/atlassian/atlassian-frontend/commits/92e0b393f5):
- Updated dependencies [ac8639dfd8](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac8639dfd8):
- Updated dependencies [2f0df19890](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f0df19890):
- Updated dependencies [0732eedea7](https://bitbucket.org/atlassian/atlassian-frontend/commits/0732eedea7):
- Updated dependencies [113d075684](https://bitbucket.org/atlassian/atlassian-frontend/commits/113d075684):
- Updated dependencies [af8a3763dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/af8a3763dd):
- Updated dependencies [21a1faf014](https://bitbucket.org/atlassian/atlassian-frontend/commits/21a1faf014):
- Updated dependencies [c171660346](https://bitbucket.org/atlassian/atlassian-frontend/commits/c171660346):
- Updated dependencies [94116c6018](https://bitbucket.org/atlassian/atlassian-frontend/commits/94116c6018):
- Updated dependencies [9fadef064b](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fadef064b):
- Updated dependencies [27fde59914](https://bitbucket.org/atlassian/atlassian-frontend/commits/27fde59914):
- Updated dependencies [f8ffc8320f](https://bitbucket.org/atlassian/atlassian-frontend/commits/f8ffc8320f):
- Updated dependencies [b18fc8a1b6](https://bitbucket.org/atlassian/atlassian-frontend/commits/b18fc8a1b6):
- Updated dependencies [469e9a2302](https://bitbucket.org/atlassian/atlassian-frontend/commits/469e9a2302):
- Updated dependencies [a41d2345eb](https://bitbucket.org/atlassian/atlassian-frontend/commits/a41d2345eb):
- Updated dependencies [4ef23b6a15](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ef23b6a15):
- Updated dependencies [7baff84f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/7baff84f38):
- Updated dependencies [8cc5cc0603](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc5cc0603):
- Updated dependencies [5d8a0d4f5f](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d8a0d4f5f):
- Updated dependencies [faa96cee2a](https://bitbucket.org/atlassian/atlassian-frontend/commits/faa96cee2a):
- Updated dependencies [535286e8c4](https://bitbucket.org/atlassian/atlassian-frontend/commits/535286e8c4):
- Updated dependencies [025842de1a](https://bitbucket.org/atlassian/atlassian-frontend/commits/025842de1a):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [de64f9373c](https://bitbucket.org/atlassian/atlassian-frontend/commits/de64f9373c):
- Updated dependencies [93ac94a762](https://bitbucket.org/atlassian/atlassian-frontend/commits/93ac94a762):
- Updated dependencies [172a864d19](https://bitbucket.org/atlassian/atlassian-frontend/commits/172a864d19):
- Updated dependencies [a5d0019a5e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5d0019a5e):
- Updated dependencies [6a417f2e52](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a417f2e52):
- Updated dependencies [5e3aab8e77](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e3aab8e77):
- Updated dependencies [fdf6c939e8](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdf6c939e8):
- Updated dependencies [395739b5ef](https://bitbucket.org/atlassian/atlassian-frontend/commits/395739b5ef):
  - @atlaskit/editor-common@44.0.2
  - @atlaskit/editor-core@119.0.0
  - @atlaskit/adf-schema@7.0.0
  - @atlaskit/docs@8.4.0
  - @atlaskit/util-data-test@13.1.2
  - @atlaskit/editor-test-helpers@10.6.1
  - @atlaskit/button@13.3.9
  - @atlaskit/spinner@12.1.6

## 7.3.14

### Patch Changes

- [patch][8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):

  Remove Karma tests - based on AFP-960- Updated dependencies [6403a54812](https://bitbucket.org/atlassian/atlassian-frontend/commits/6403a54812):

- Updated dependencies [9e90cb4336](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e90cb4336):
- Updated dependencies [e8a31c2714](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8a31c2714):
- Updated dependencies [f46330c0ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/f46330c0ab):
- Updated dependencies [d6f207a598](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f207a598):
- Updated dependencies [40359da294](https://bitbucket.org/atlassian/atlassian-frontend/commits/40359da294):
- Updated dependencies [151240fce9](https://bitbucket.org/atlassian/atlassian-frontend/commits/151240fce9):
- Updated dependencies [8d09cd0408](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d09cd0408):
- Updated dependencies [088f4f7d1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/088f4f7d1e):
- Updated dependencies [9d6b02c04f](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d6b02c04f):
- Updated dependencies [8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):
- Updated dependencies [7aad7888b4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7aad7888b4):
- Updated dependencies [a5c3717d0b](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5c3717d0b):
- Updated dependencies [b924951169](https://bitbucket.org/atlassian/atlassian-frontend/commits/b924951169):
- Updated dependencies [37a79cb1bc](https://bitbucket.org/atlassian/atlassian-frontend/commits/37a79cb1bc):
- Updated dependencies [47d7b34f75](https://bitbucket.org/atlassian/atlassian-frontend/commits/47d7b34f75):
- Updated dependencies [79cabaee0c](https://bitbucket.org/atlassian/atlassian-frontend/commits/79cabaee0c):
- Updated dependencies [5a0167db78](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a0167db78):
- Updated dependencies [ded54f7b9f](https://bitbucket.org/atlassian/atlassian-frontend/commits/ded54f7b9f):
- Updated dependencies [b3b2f413c1](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3b2f413c1):
- Updated dependencies [8f41931365](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f41931365):
- Updated dependencies [d59113061a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d59113061a):
- Updated dependencies [cedfb7766c](https://bitbucket.org/atlassian/atlassian-frontend/commits/cedfb7766c):
- Updated dependencies [2361b8d044](https://bitbucket.org/atlassian/atlassian-frontend/commits/2361b8d044):
- Updated dependencies [1028ab4db3](https://bitbucket.org/atlassian/atlassian-frontend/commits/1028ab4db3):
- Updated dependencies [57ea6ea77a](https://bitbucket.org/atlassian/atlassian-frontend/commits/57ea6ea77a):
- Updated dependencies [ff6e928368](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff6e928368):
- Updated dependencies [4b3ced1d9f](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b3ced1d9f):
- Updated dependencies [fdc0861682](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdc0861682):
- Updated dependencies [00ddcd52df](https://bitbucket.org/atlassian/atlassian-frontend/commits/00ddcd52df):
- Updated dependencies [e3a8052151](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3a8052151):
- Updated dependencies [198639cd06](https://bitbucket.org/atlassian/atlassian-frontend/commits/198639cd06):
- Updated dependencies [13f0bbc125](https://bitbucket.org/atlassian/atlassian-frontend/commits/13f0bbc125):
- Updated dependencies [d7749cb6ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7749cb6ab):
- Updated dependencies [c9842c9ada](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9842c9ada):
- Updated dependencies [02b2a2079c](https://bitbucket.org/atlassian/atlassian-frontend/commits/02b2a2079c):
  - @atlaskit/editor-core@118.0.0
  - @atlaskit/editor-common@44.0.0
  - @atlaskit/adf-schema@6.2.0
  - @atlaskit/editor-test-helpers@10.6.0

## 7.3.13

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/adf-schema@6.1.1
  - @atlaskit/editor-common@43.4.1
  - @atlaskit/editor-core@117.0.2
  - @atlaskit/editor-test-helpers@10.5.1
  - @atlaskit/util-data-test@13.1.1

## 7.3.12

### Patch Changes

- Updated dependencies [06cd97123e](https://bitbucket.org/atlassian/atlassian-frontend/commits/06cd97123e):
- Updated dependencies [07b5311cb9](https://bitbucket.org/atlassian/atlassian-frontend/commits/07b5311cb9):
- Updated dependencies [a4ded5368c](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4ded5368c):
- Updated dependencies [3b19e30129](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b19e30129):
- Updated dependencies [6f16f46632](https://bitbucket.org/atlassian/atlassian-frontend/commits/6f16f46632):
- Updated dependencies [a1f50e6a54](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1f50e6a54):
- Updated dependencies [31558e1872](https://bitbucket.org/atlassian/atlassian-frontend/commits/31558e1872):
- Updated dependencies [6ca6aaa1d7](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ca6aaa1d7):
- Updated dependencies [fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):
- Updated dependencies [43e03f1c58](https://bitbucket.org/atlassian/atlassian-frontend/commits/43e03f1c58):
- Updated dependencies [63fe41d5c2](https://bitbucket.org/atlassian/atlassian-frontend/commits/63fe41d5c2):
- Updated dependencies [b01fc0ceef](https://bitbucket.org/atlassian/atlassian-frontend/commits/b01fc0ceef):
- Updated dependencies [d085ab4419](https://bitbucket.org/atlassian/atlassian-frontend/commits/d085ab4419):
- Updated dependencies [64752f2827](https://bitbucket.org/atlassian/atlassian-frontend/commits/64752f2827):
- Updated dependencies [f67dc5ae22](https://bitbucket.org/atlassian/atlassian-frontend/commits/f67dc5ae22):
- Updated dependencies [e40acffdfc](https://bitbucket.org/atlassian/atlassian-frontend/commits/e40acffdfc):
- Updated dependencies [0709d95a8a](https://bitbucket.org/atlassian/atlassian-frontend/commits/0709d95a8a):
- Updated dependencies [28dcebde63](https://bitbucket.org/atlassian/atlassian-frontend/commits/28dcebde63):
- Updated dependencies [710897f340](https://bitbucket.org/atlassian/atlassian-frontend/commits/710897f340):
- Updated dependencies [b8da779506](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8da779506):
- Updated dependencies [bbbe360b71](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbbe360b71):
- Updated dependencies [3b37ec4c28](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b37ec4c28):
- Updated dependencies [655599414e](https://bitbucket.org/atlassian/atlassian-frontend/commits/655599414e):
  - @atlaskit/editor-core@117.0.0
  - @atlaskit/editor-test-helpers@10.5.0
  - @atlaskit/editor-common@43.4.0
  - @atlaskit/adf-schema@6.1.0
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6

## 7.3.11

### Patch Changes

- Updated dependencies [06f4f74d88](https://bitbucket.org/atlassian/atlassian-frontend/commits/06f4f74d88):
- Updated dependencies [80c1eaa275](https://bitbucket.org/atlassian/atlassian-frontend/commits/80c1eaa275):
- Updated dependencies [2b4ebaf2ed](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b4ebaf2ed):
- Updated dependencies [c64c471564](https://bitbucket.org/atlassian/atlassian-frontend/commits/c64c471564):
- Updated dependencies [5b8daf1843](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b8daf1843):
- Updated dependencies [c55f8e0284](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55f8e0284):
- Updated dependencies [b4ad0a502a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4ad0a502a):
- Updated dependencies [7d2c702223](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d2c702223):
- Updated dependencies [6421a97672](https://bitbucket.org/atlassian/atlassian-frontend/commits/6421a97672):
- Updated dependencies [0eb8c5ff5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/0eb8c5ff5a):
- Updated dependencies [3e87f5596a](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e87f5596a):
- Updated dependencies [3160e15523](https://bitbucket.org/atlassian/atlassian-frontend/commits/3160e15523):
- Updated dependencies [3f1d129a79](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f1d129a79):
- Updated dependencies [baa887053d](https://bitbucket.org/atlassian/atlassian-frontend/commits/baa887053d):
- Updated dependencies [2108ee74db](https://bitbucket.org/atlassian/atlassian-frontend/commits/2108ee74db):
- Updated dependencies [f3727d3830](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3727d3830):
- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
- Updated dependencies [dc48763970](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc48763970):
- Updated dependencies [909676b9de](https://bitbucket.org/atlassian/atlassian-frontend/commits/909676b9de):
- Updated dependencies [312feb4a6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/312feb4a6a):
- Updated dependencies [cf9858fa09](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf9858fa09):
- Updated dependencies [26dbe7be6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/26dbe7be6d):
- Updated dependencies [cfcd27b2e4](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfcd27b2e4):
- Updated dependencies [ec929ab10e](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec929ab10e):
  - @atlaskit/editor-core@116.2.0
  - @atlaskit/adf-schema@6.0.0
  - @atlaskit/editor-common@43.3.1
  - @atlaskit/docs@8.3.0
  - @atlaskit/editor-test-helpers@10.4.3

## 7.3.10

### Patch Changes

- Updated dependencies [761dcd6d19](https://bitbucket.org/atlassian/atlassian-frontend/commits/761dcd6d19):
- Updated dependencies [5816cb91e0](https://bitbucket.org/atlassian/atlassian-frontend/commits/5816cb91e0):
- Updated dependencies [faccb537d0](https://bitbucket.org/atlassian/atlassian-frontend/commits/faccb537d0):
- Updated dependencies [642b2f93ea](https://bitbucket.org/atlassian/atlassian-frontend/commits/642b2f93ea):
- Updated dependencies [4898d64f46](https://bitbucket.org/atlassian/atlassian-frontend/commits/4898d64f46):
- Updated dependencies [8cf20f37ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cf20f37ae):
- Updated dependencies [a23aa4e4a8](https://bitbucket.org/atlassian/atlassian-frontend/commits/a23aa4e4a8):
- Updated dependencies [a753b0d6da](https://bitbucket.org/atlassian/atlassian-frontend/commits/a753b0d6da):
- Updated dependencies [b1ce12dffb](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1ce12dffb):
- Updated dependencies [4c4ae93de7](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c4ae93de7):
- Updated dependencies [edc4a4a7ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/edc4a4a7ae):
- Updated dependencies [e4f0ab434f](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4f0ab434f):
- Updated dependencies [3da54e6146](https://bitbucket.org/atlassian/atlassian-frontend/commits/3da54e6146):
- Updated dependencies [94ea01d1d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/94ea01d1d6):
- Updated dependencies [01dc5ed14b](https://bitbucket.org/atlassian/atlassian-frontend/commits/01dc5ed14b):
- Updated dependencies [fdaac966f4](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdaac966f4):
- Updated dependencies [54a499fb7b](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a499fb7b):
  - @atlaskit/adf-schema@5.0.0
  - @atlaskit/editor-core@116.1.0
  - @atlaskit/editor-common@43.3.0
  - @atlaskit/editor-test-helpers@10.4.1

## 7.3.9

### Patch Changes

- Updated dependencies [6042417190](https://bitbucket.org/atlassian/atlassian-frontend/commits/6042417190):
- Updated dependencies [26942487d1](https://bitbucket.org/atlassian/atlassian-frontend/commits/26942487d1):
- Updated dependencies [d1055e0e50](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1055e0e50):
- Updated dependencies [8db35852ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/8db35852ab):
- Updated dependencies [2ffdeb5a48](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ffdeb5a48):
- Updated dependencies [97d1245875](https://bitbucket.org/atlassian/atlassian-frontend/commits/97d1245875):
- Updated dependencies [4eefd368a8](https://bitbucket.org/atlassian/atlassian-frontend/commits/4eefd368a8):
- Updated dependencies [9219b332cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/9219b332cb):
- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies [99fc6250f9](https://bitbucket.org/atlassian/atlassian-frontend/commits/99fc6250f9):
- Updated dependencies [46e6693eb3](https://bitbucket.org/atlassian/atlassian-frontend/commits/46e6693eb3):
- Updated dependencies [4cd37dd052](https://bitbucket.org/atlassian/atlassian-frontend/commits/4cd37dd052):
- Updated dependencies [1f84cf7583](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f84cf7583):
- Updated dependencies [218fe01736](https://bitbucket.org/atlassian/atlassian-frontend/commits/218fe01736):
- Updated dependencies [985db883ac](https://bitbucket.org/atlassian/atlassian-frontend/commits/985db883ac):
- Updated dependencies [bed9c11960](https://bitbucket.org/atlassian/atlassian-frontend/commits/bed9c11960):
- Updated dependencies [a30fe6c66e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a30fe6c66e):
- Updated dependencies [fdf30da2db](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdf30da2db):
- Updated dependencies [83300f0b6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/83300f0b6d):
- Updated dependencies [d1c470507c](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1c470507c):
- Updated dependencies [fc1678c70d](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc1678c70d):
- Updated dependencies [2edd170a68](https://bitbucket.org/atlassian/atlassian-frontend/commits/2edd170a68):
- Updated dependencies [e5dd37f7a4](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5dd37f7a4):
- Updated dependencies [5abcab3f7e](https://bitbucket.org/atlassian/atlassian-frontend/commits/5abcab3f7e):
- Updated dependencies [5d13d33a60](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d13d33a60):
- Updated dependencies [81897eb2e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/81897eb2e6):
- Updated dependencies [1d421446bc](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d421446bc):
- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/editor-core@116.0.0
  - @atlaskit/editor-common@43.2.0
  - @atlaskit/adf-schema@4.4.0
  - @atlaskit/theme@9.5.0
  - @atlaskit/editor-test-helpers@10.4.0
  - @atlaskit/util-data-test@13.1.0
  - @atlaskit/button@13.3.5
  - @atlaskit/spinner@12.1.3

## 7.3.8

### Patch Changes

- Updated dependencies [271945fd08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/271945fd08):
- Updated dependencies [a6663b9325](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6663b9325):
- Updated dependencies [5e4d1feec3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e4d1feec3):
- Updated dependencies [0f8d5df4cf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f8d5df4cf):
- Updated dependencies [161a30be16](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/161a30be16):
- Updated dependencies [ecfbe83dfb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecfbe83dfb):
- Updated dependencies [ea0e619cc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea0e619cc7):
- Updated dependencies [93b445dcdc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93b445dcdc):
- Updated dependencies [ded174361e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ded174361e):
- Updated dependencies [80eb127904](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80eb127904):
- Updated dependencies [ef2ba36d5c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef2ba36d5c):
- Updated dependencies [8c84ed470e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c84ed470e):
- Updated dependencies [6e4b678428](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e4b678428):
- Updated dependencies [bb164fbd1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb164fbd1e):
- Updated dependencies [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies [b3fd0964f2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3fd0964f2):
- Updated dependencies [40bec82851](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40bec82851):
- Updated dependencies [8b652147a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b652147a5):
- Updated dependencies [0603c2fbf7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0603c2fbf7):
- Updated dependencies [72d4c3298d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d4c3298d):
- Updated dependencies [10425b84b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10425b84b4):
- Updated dependencies [5ef337766c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ef337766c):
- Updated dependencies [dc0999afc2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc0999afc2):
- Updated dependencies [6764e83801](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6764e83801):
- Updated dependencies [553915553f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/553915553f):
- Updated dependencies [4700477bbe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4700477bbe):
- Updated dependencies [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
- Updated dependencies [9a261337b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a261337b5):
- Updated dependencies [3a7c0bfa32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a7c0bfa32):
- Updated dependencies [5455e35bc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5455e35bc0):
- Updated dependencies [cc1b89d310](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc1b89d310):
- Updated dependencies [2bb3af2382](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2bb3af2382):
- Updated dependencies [611dbe68ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/611dbe68ff):
- Updated dependencies [0ea0587ac5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ea0587ac5):
- Updated dependencies [938f1c2902](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/938f1c2902):
- Updated dependencies [926798632e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926798632e):
  - @atlaskit/editor-common@43.0.0
  - @atlaskit/editor-core@115.0.0
  - @atlaskit/adf-schema@4.3.1
  - @atlaskit/theme@9.3.0
  - @atlaskit/editor-test-helpers@10.3.0

## 7.3.7

### Patch Changes

- [patch][6d9c8a9073](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d9c8a9073):

  Provide standard empty adf when provided with empty wikimarkup/markdown/jira/cxhtml/prosemirror

- Updated dependencies [70e1055b8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70e1055b8f):
  - @atlaskit/editor-core@114.1.0
  - @atlaskit/editor-test-helpers@10.2.0
  - @atlaskit/editor-common@42.0.0

## 7.3.6

### Patch Changes

- [patch][e47220a6b2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e47220a6b2):

  ED-5450: remove most of ts-ignores from editor packages

- Updated dependencies [f28c191f4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f28c191f4a):
- Updated dependencies [24b8ea2667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24b8ea2667):
  - @atlaskit/editor-test-helpers@10.1.3
  - @atlaskit/editor-core@114.0.0
  - @atlaskit/editor-common@41.2.1

## 7.3.5

### Patch Changes

- [patch][cc28419139](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc28419139):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.- [patch][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

**FABDODGEM-13 Editor Damask Release** - [Internal post](http://go.atlassian.com/damask-release)

**BREAKING CHANGES**

- **Media:** Removed deprecated "context" property from media components in favor of "mediaClientConfig". This affects all public media UI components.
  - https://product-fabric.atlassian.net/browse/MS-2038
- **Tasks & Decisions:** Removed containerAri for task-decisions components.
  - https://product-fabric.atlassian.net/browse/ED-7631
- **Renderer:** Adapts to task-decision changes.
- **Editor Mobile Bridge:** Adapts to task-decision changes.
- **Util Data Test:** Adapts to task-decision changes.

---

**Affected Editor Components:**

tables, media, mobile, emoji, tasks & decisions, analytics

**Editor**

- Support nested actions in stage-0 schema; Change DOM representation of actions
  - https://product-fabric.atlassian.net/browse/ED-7674
- Updated i18n translations
  - https://product-fabric.atlassian.net/browse/ED-7750
- Improved analytics & crash reporting (via a new error boundary)
  - https://product-fabric.atlassian.net/browse/ED-7766
  - https://product-fabric.atlassian.net/browse/ED-7806
- Improvements to heading anchor links.
  - https://product-fabric.atlassian.net/browse/ED-7849
  - https://product-fabric.atlassian.net/browse/ED-7860
- Copy/Paste improvements
  - https://product-fabric.atlassian.net/browse/ED-7840
  - https://product-fabric.atlassian.net/browse/ED-7849
- Fixes for the selection state of Smart links.
  - https://product-fabric.atlassian.net/browse/ED-7602?src=confmacro
- Improvements for table resizing & column creation.
  - https://product-fabric.atlassian.net/browse/ED-7698
  - https://product-fabric.atlassian.net/browse/ED-7319
  - https://product-fabric.atlassian.net/browse/ED-7799

**Mobile**

- GASv3 Analytics Events are now relayed from the web to the native context, ready for dispatching.
  - https://product-fabric.atlassian.net/browse/FM-2502
- Hybrid Renderer Recycler view now handles invalid ADF nodes gracefully.
  - https://product-fabric.atlassian.net/browse/FM-2370

**Media**

- Improved analytics
  - https://product-fabric.atlassian.net/browse/MS-2036
  - https://product-fabric.atlassian.net/browse/MS-2145
  - https://product-fabric.atlassian.net/browse/MS-2416
  - https://product-fabric.atlassian.net/browse/MS-2487
- Added shouldOpenMediaViewer property to renderer
  - https://product-fabric.atlassian.net/browse/MS-2393
- Implemented analytics for file copy
  - https://product-fabric.atlassian.net/browse/MS-2036
- New `media-viewed` event dispatched when media is interacted with via the media card or viewer.
  - https://product-fabric.atlassian.net/browse/MS-2284
- Support for `alt` text attribute on media image elements.
  - https://product-fabric.atlassian.net/browse/ED-7776

**i18n-tools**

Bumped dependencies.

- Updated dependencies [bd94b1d552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd94b1d552):
  - @atlaskit/editor-core@113.2.0
  - @atlaskit/editor-common@41.2.0
  - @atlaskit/util-data-test@13.0.0

## 7.3.4

- Updated dependencies [1194ad5eb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1194ad5eb3):
- Updated dependencies [166eb02474](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/166eb02474):
- Updated dependencies [80adfefba2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80adfefba2):
  - @atlaskit/editor-common@41.0.0
  - @atlaskit/editor-core@113.0.0
  - @atlaskit/editor-test-helpers@10.0.0
  - @atlaskit/adf-schema@4.0.0

## 7.3.3

- Updated dependencies [08ec269915](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08ec269915):
  - @atlaskit/editor-core@112.44.2
  - @atlaskit/editor-test-helpers@9.11.13
  - @atlaskit/editor-common@40.0.0

## 7.3.2

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 7.3.1

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 7.3.0

### Minor Changes

- [minor][66c5c88f4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66c5c88f4a):

  Refactor emoji to use typeahead plugin

## 7.2.5

### Patch Changes

- [patch][6164bc2629](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6164bc2629):

  ED-6806 Move 'calcTableColumnWidths' from adf-schema into editor-common

  BREAKING CHANGE

  We move 'calcTableColumnWidths' helper from adf-schema into our helper library editor-common, you can use it from editor-common in the same way:

  Before:

  ```javascript
  import { calcTableColumnWidths } from '@atlaskit/adf-schema';
  ```

  Now:

  ```javascript
  import { calcTableColumnWidths } from '@atlaskit/editor-common';
  ```

## 7.2.4

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 7.2.3

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 7.2.2

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 7.2.1

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
  - @atlaskit/button@13.0.4
  - @atlaskit/editor-core@112.11.0
  - @atlaskit/spinner@12.0.0

## 7.2.0

- [minor][79f0ef0601](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79f0ef0601):

  - Use strict tsconfig to compile editor packages

## 7.1.2

- Updated dependencies [5e4ff01e4c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e4ff01e4c):
  - @atlaskit/editor-test-helpers@9.1.4
  - @atlaskit/editor-core@112.0.0

## 7.1.1

- Updated dependencies [154372926b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/154372926b):
  - @atlaskit/editor-test-helpers@9.1.2
  - @atlaskit/editor-core@111.0.0

## 7.1.0

- [minor][5a49043dac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a49043dac):

  - Enable strictPropertyInitialization in tsconfig.base

## 7.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 6.0.7

- Updated dependencies [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/editor-common@38.0.0
  - @atlaskit/editor-core@109.0.0
  - @atlaskit/editor-test-helpers@8.0.8
  - @atlaskit/util-data-test@11.1.9

## 6.0.6

- Updated dependencies [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/editor-common@37.0.0
  - @atlaskit/editor-core@108.0.0
  - @atlaskit/editor-test-helpers@8.0.7
  - @atlaskit/util-data-test@11.1.8

## 6.0.5

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/spinner@10.0.7
  - @atlaskit/editor-common@36.1.12
  - @atlaskit/editor-core@107.13.4
  - @atlaskit/theme@8.1.7

## 6.0.4

- [patch][6695367885](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6695367885):

  - Revert emoji refactor

## 6.0.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/editor-core@107.12.5
  - @atlaskit/button@12.0.0

## 6.0.2

- Updated dependencies [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/editor-common@36.0.0
  - @atlaskit/editor-core@107.0.0
  - @atlaskit/editor-test-helpers@8.0.3
  - @atlaskit/util-data-test@11.1.5

## 6.0.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 6.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 5.2.5

- Updated dependencies [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/editor-common@34.0.0
  - @atlaskit/editor-core@105.0.0
  - @atlaskit/editor-test-helpers@7.0.6
  - @atlaskit/util-data-test@10.2.5

## 5.2.4

- Updated dependencies [4d17df92f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d17df92f8):
  - @atlaskit/editor-test-helpers@7.0.5
  - @atlaskit/editor-core@104.0.0

## 5.2.3

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/editor-core@103.0.3
  - @atlaskit/util-data-test@10.2.3
  - @atlaskit/editor-common@33.0.3
  - @atlaskit/docs@7.0.0
  - @atlaskit/spinner@10.0.0
  - @atlaskit/theme@8.0.0

## 5.2.2

- Updated dependencies [60f0ad9a7e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60f0ad9a7e):
  - @atlaskit/editor-core@103.0.0
  - @atlaskit/editor-test-helpers@7.0.4

## 5.2.1

- Updated dependencies [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/editor-common@33.0.0
  - @atlaskit/editor-core@102.0.0
  - @atlaskit/editor-test-helpers@7.0.2
  - @atlaskit/util-data-test@10.2.2

## 5.2.0

- [minor][1eb20bca95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1eb20bca95):

  - ED-6368: No implicit any for editor-\*-transformer packages

## 5.1.13

- Updated dependencies [4a84fc40e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a84fc40e0):
  - @atlaskit/editor-test-helpers@7.0.1
  - @atlaskit/editor-core@101.0.0

## 5.1.12

- Updated dependencies [4af5bd2a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4af5bd2a58):
  - @atlaskit/adf-schema@1.5.4
  - @atlaskit/editor-common@32.0.2
  - @atlaskit/editor-core@100.0.0
  - @atlaskit/editor-test-helpers@7.0.0

## 5.1.11

- Updated dependencies [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
  - @atlaskit/editor-common@32.0.0
  - @atlaskit/editor-core@99.0.0
  - @atlaskit/editor-test-helpers@6.3.22
  - @atlaskit/util-data-test@10.2.1

## 5.1.10

- [patch][557a2b5734](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a2b5734):

  - ED-5788: bump prosemirror-view and prosemirror-model

## 5.1.9

- Updated dependencies [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/editor-common@31.0.0
  - @atlaskit/editor-core@98.0.0
  - @atlaskit/editor-test-helpers@6.3.17
  - @atlaskit/util-data-test@10.0.36

## 5.1.8

- [patch][adff2caed7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/adff2caed7):

  - Improve typings

## 5.1.7

- Updated dependencies [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/editor-common@30.0.0
  - @atlaskit/editor-core@97.0.0
  - @atlaskit/editor-test-helpers@6.3.12
  - @atlaskit/util-data-test@10.0.34

## 5.1.6

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
  - @atlaskit/editor-common@29.0.0
  - @atlaskit/editor-core@96.0.0
  - @atlaskit/editor-test-helpers@6.3.11
  - @atlaskit/util-data-test@10.0.33

## 5.1.5

- Updated dependencies [0c116d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c116d6):
  - @atlaskit/editor-test-helpers@6.3.8
  - @atlaskit/editor-common@28.0.2
  - @atlaskit/util-data-test@10.0.32
  - @atlaskit/editor-core@95.0.0

## 5.1.4

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/editor-common@28.0.0
  - @atlaskit/editor-core@94.0.0
  - @atlaskit/editor-test-helpers@6.3.7
  - @atlaskit/util-data-test@10.0.31

## 5.1.3

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
  - @atlaskit/editor-common@27.0.0
  - @atlaskit/editor-core@93.0.0
  - @atlaskit/editor-test-helpers@6.3.6
  - @atlaskit/util-data-test@10.0.30

## 5.1.2

- Updated dependencies [e858305](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e858305):
  - @atlaskit/editor-test-helpers@6.3.5
  - @atlaskit/editor-common@26.0.0
  - @atlaskit/editor-core@92.0.19

## 5.1.1

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
  - @atlaskit/editor-common@25.0.0
  - @atlaskit/editor-core@92.0.0
  - @atlaskit/editor-test-helpers@6.3.4
  - @atlaskit/util-data-test@10.0.28

## 5.1.0

- [minor][1205725](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1205725):

  - Move schema to its own package

## 5.0.23

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/editor-common@23.0.0
  - @atlaskit/editor-core@91.0.0
  - @atlaskit/editor-test-helpers@6.3.2
  - @atlaskit/util-data-test@10.0.26

## 5.0.22

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/editor-core@90.3.15
  - @atlaskit/util-data-test@10.0.25
  - @atlaskit/docs@6.0.0

## 5.0.21

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/spinner@9.0.12
  - @atlaskit/editor-common@22.2.3
  - @atlaskit/editor-core@90.2.1
  - @atlaskit/theme@7.0.0

## 5.0.20

- Updated dependencies [3a7224a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a7224a):
  - @atlaskit/editor-test-helpers@6.2.23
  - @atlaskit/editor-core@90.0.0

## 5.0.19

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/spinner@9.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/editor-core@89.0.4
  - @atlaskit/button@10.0.0

## 5.0.18

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/editor-common@22.0.0
  - @atlaskit/editor-core@89.0.0
  - @atlaskit/editor-test-helpers@6.2.19
  - @atlaskit/util-data-test@10.0.21

## 5.0.17

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/editor-common@21.0.0
  - @atlaskit/editor-core@88.0.0
  - @atlaskit/editor-test-helpers@6.2.16
  - @atlaskit/util-data-test@10.0.20

## 5.0.16

- [patch] Updated dependencies [052ce89](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/052ce89)
  - @atlaskit/editor-test-helpers@6.2.8
  - @atlaskit/editor-core@87.0.0
  - @atlaskit/editor-common@20.1.2

## 5.0.15

- [patch] Updated dependencies [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/editor-common@20.0.0
  - @atlaskit/editor-core@86.0.0
  - @atlaskit/editor-test-helpers@6.2.7
  - @atlaskit/util-data-test@10.0.16

## 5.0.14

- [patch] Updated dependencies [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/editor-common@19.0.0
  - @atlaskit/editor-core@85.0.0
  - @atlaskit/editor-test-helpers@6.2.6
  - @atlaskit/util-data-test@10.0.14

## 5.0.13

- [patch] Updated dependencies [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [patch] Updated dependencies [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
  - @atlaskit/editor-common@18.0.0
  - @atlaskit/editor-core@84.0.0
  - @atlaskit/editor-test-helpers@6.2.5
  - @atlaskit/util-data-test@10.0.12

## 5.0.12

- [patch] Updated dependencies [23c7eca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23c7eca)
  - @atlaskit/editor-test-helpers@6.2.4
  - @atlaskit/util-data-test@10.0.11
  - @atlaskit/editor-core@83.0.0

## 5.0.11

- [patch] Updated dependencies [ef76f1f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef76f1f)
  - @atlaskit/editor-common@17.0.1
  - @atlaskit/editor-core@82.0.0
  - @atlaskit/editor-test-helpers@6.1.3

## 5.0.10

- [patch] Updated dependencies [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
  - @atlaskit/editor-common@17.0.0
  - @atlaskit/editor-core@81.0.0
  - @atlaskit/util-data-test@10.0.10
  - @atlaskit/editor-test-helpers@6.1.2

## 5.0.9

- [patch] Updated dependencies [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/editor-common@16.0.0
  - @atlaskit/editor-core@80.0.0
  - @atlaskit/editor-test-helpers@6.0.9
  - @atlaskit/util-data-test@10.0.9

## 5.0.8

- [patch] Updated dependencies [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/editor-common@15.0.0
  - @atlaskit/editor-core@79.0.0
  - @atlaskit/editor-test-helpers@6.0.6
  - @atlaskit/util-data-test@10.0.8

## 5.0.7

- [patch] Updated dependencies [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
  - @atlaskit/editor-test-helpers@6.0.5
  - @atlaskit/editor-core@78.0.0

## 5.0.6

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/util-data-test@10.0.7
  - @atlaskit/editor-common@14.0.11
  - @atlaskit/editor-test-helpers@6.0.3
  - @atlaskit/editor-core@77.1.4

## 5.0.5

- [none] Updated dependencies [597e0bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/597e0bd)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/editor-core@77.0.0
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/editor-common@14.0.0
- [none] Updated dependencies [61df453](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61df453)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/editor-common@14.0.0
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/editor-core@77.0.0
- [none] Updated dependencies [812a39c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/812a39c)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/editor-core@77.0.0
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/editor-common@14.0.0
- [none] Updated dependencies [c8eb097](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8eb097)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/editor-common@14.0.0
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/editor-core@77.0.0
- [patch] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/editor-common@14.0.0
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/editor-core@77.0.0

## 5.0.4

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/util-data-test@10.0.2
  - @atlaskit/editor-common@13.2.7
  - @atlaskit/editor-test-helpers@5.1.2
  - @atlaskit/editor-core@76.4.5
  - @atlaskit/button@9.0.4
  - @atlaskit/spinner@9.0.4
  - @atlaskit/docs@5.0.2

## 5.0.3

- [patch] Bump prosemirror-model to 1.6 in order to use toDebugString on Text node spec [fdd5c5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd5c5d)
- [none] Updated dependencies [fdd5c5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd5c5d)
  - @atlaskit/editor-common@13.2.6
  - @atlaskit/editor-test-helpers@5.1.1
  - @atlaskit/editor-core@76.4.2

## 5.0.2

- [patch] Improves type coverage by removing casts to any [8928280](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8928280)
- [none] Updated dependencies [8928280](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8928280)
  - @atlaskit/editor-core@76.0.3
  - @atlaskit/editor-common@13.0.3

## 5.0.1

- [none] Updated dependencies [25353c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25353c3)
  - @atlaskit/editor-core@76.0.0
  - @atlaskit/editor-test-helpers@5.0.1
- [patch] Updated dependencies [38c0543](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38c0543)
  - @atlaskit/editor-core@76.0.0
  - @atlaskit/editor-test-helpers@5.0.1

## 5.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/editor-common@13.0.0
  - @atlaskit/editor-test-helpers@5.0.0
  - @atlaskit/editor-core@75.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/editor-core@75.0.0
  - @atlaskit/editor-test-helpers@5.0.0
  - @atlaskit/editor-common@13.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0

## 4.1.10

- [none] Updated dependencies [5f6ec84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f6ec84)
  - @atlaskit/editor-core@74.0.17
  - @atlaskit/editor-test-helpers@4.2.4
  - @atlaskit/editor-common@12.0.0
- [patch] Updated dependencies [5958588](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5958588)
  - @atlaskit/editor-core@74.0.17
  - @atlaskit/editor-test-helpers@4.2.4
  - @atlaskit/editor-common@12.0.0

## 4.1.9

- [patch] Updated dependencies [af0cde6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af0cde6)
  - @atlaskit/editor-core@74.0.0
  - @atlaskit/editor-test-helpers@4.2.2

## 4.1.8

- [patch] Ensure nodes created by transformers are valid, otherwise throws an error. ED-3824 [b45fa8b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b45fa8b)

## 4.1.7

- [patch] Add missing dependencies to packages to get the website to build [99446e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/99446e3)

- [none] Updated dependencies [99446e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/99446e3)
  - @atlaskit/docs@4.2.2
- [none] Updated dependencies [9bac948](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9bac948)
  - @atlaskit/docs@4.2.2

## 4.1.6

- [patch] Updated dependencies [8d5053e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d5053e)
  - @atlaskit/util-data-test@9.1.15
  - @atlaskit/editor-common@11.3.8
  - @atlaskit/editor-test-helpers@4.1.9
  - @atlaskit/editor-core@73.9.5

## 4.1.5

- [patch] Updated dependencies [0cf2f52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0cf2f52)
  - @atlaskit/util-data-test@9.1.14
  - @atlaskit/editor-core@73.9.2
  - @atlaskit/editor-test-helpers@4.1.8
  - @atlaskit/editor-common@11.3.7

## 4.1.4

- [patch] ED-4520, date renderer should render UTC value of date. [28e3c31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/28e3c31)
- [none] Updated dependencies [28e3c31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/28e3c31)
  - @atlaskit/editor-core@73.8.10
  - @atlaskit/editor-common@11.3.2

## 4.1.3

- [patch] Remove pinned prosemirror-model@1.4.0 and move back to caret ranges for prosemirror-model@^1.5.0 [4faccc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4faccc0)
- [patch] Updated dependencies [4faccc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4faccc0)
  - @atlaskit/editor-common@11.3.0
  - @atlaskit/editor-test-helpers@4.1.5
  - @atlaskit/editor-core@73.8.6

## 4.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/util-data-test@9.1.13
  - @atlaskit/editor-core@73.7.5
  - @atlaskit/editor-test-helpers@4.1.2
  - @atlaskit/editor-common@11.2.1

## 4.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/util-data-test@9.1.12
  - @atlaskit/editor-core@73.7.1
  - @atlaskit/editor-test-helpers@4.1.1
  - @atlaskit/editor-common@11.1.2
  - @atlaskit/docs@4.1.1

## 4.1.0

- [none] Updated dependencies [7217164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7217164)
  - @atlaskit/editor-core@73.5.0
  - @atlaskit/editor-test-helpers@4.1.0
  - @atlaskit/util-data-test@9.1.11
  - @atlaskit/editor-common@11.1.0

## 4.0.13

- [patch] Update and lock prosemirror-model version to 1.4.0 [febf753](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febf753)
- [none] Updated dependencies [febf753](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febf753)
  - @atlaskit/editor-common@11.0.6
  - @atlaskit/editor-test-helpers@4.0.7
  - @atlaskit/editor-core@73.4.4

## 4.0.12

- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/util-data-test@9.1.10
  - @atlaskit/editor-core@73.0.0
  - @atlaskit/editor-test-helpers@4.0.3
  - @atlaskit/editor-common@11.0.0
  - @atlaskit/docs@4.0.0

## 4.0.11

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/util-data-test@9.1.9
  - @atlaskit/editor-core@72.2.2
  - @atlaskit/editor-test-helpers@4.0.2
  - @atlaskit/editor-common@10.1.9

## 4.0.10

- [patch] ED-4689 add \_\_confluenceMetadata to link mark schema [e76e4b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e76e4b4)
- [patch] Updated dependencies [e76e4b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e76e4b4)
  - @atlaskit/editor-common@10.1.6

## 4.0.9

- [none] Updated dependencies [febc44d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febc44d)
  - @atlaskit/editor-core@72.0.0
  - @atlaskit/editor-test-helpers@4.0.0
  - @atlaskit/util-data-test@9.1.4
  - @atlaskit/editor-common@10.0.0

## 4.0.8

- [none] Updated dependencies [8fd4dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fd4dd1)
  - @atlaskit/editor-test-helpers@3.1.8
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/editor-core@71.4.0
  - @atlaskit/editor-common@9.3.9

## 4.0.7

- [patch] Adding a safe check for macro params [193c7fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/193c7fa)

## 4.0.6

- [patch] ED-4336 support loading dynamic/"auto" tables from confluence to fixed-width tables [0c2f72a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c2f72a)

## 4.0.4

- [patch] ED-4334 fix column size calculation bug; don't emit default col/rowspan attrs [eb8f140](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eb8f140)

## 4.0.1

- [patch] Added missing dependencies and added lint rule to catch them all [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 4.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 3.0.1

- [patch] change table node builder constructor for tests, remove tableWithAttrs [cf43535](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf43535)

## 3.0.0

- [major] CFE-1004: Rename anything "macro" to "extension" (i.e: MacroProvider to ExtensionProvider) [453aa52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/453aa52)

## 2.10.9

- [patch] support table colwidth in renderer, fix other table properties in email renderer [f78bef4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f78bef4)

## 2.10.8

- [patch] ED-4214 fix Confluence table styling and number column handling [22c4af6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22c4af6)

## 2.10.6

- [patch] Upgrading ProseMirror Libs [35d14d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d14d5)

## 2.10.5

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 2.10.4

- [patch] table cell/header attributes in the Confluence transformer [9415aaa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9415aaa)

## 2.10.3

- [patch] Use fab:adf to convert Macros and fallback [ece6c43](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ece6c43)

## 2.10.0

- [minor] Add full width and wide layout support for single image [ae72acf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae72acf)

## 2.9.8

- [patch] ED-4029: ignore divs wrapping table cells content [6e5361f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e5361f)

## 2.9.2

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 2.9.0

- [minor] add support for <fab:adf> and confluence decision list transforms [e08eccc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e08eccc)
- [minor] add support for <fab:adf> and confluence decision list transforms [f43f928](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f43f928)

## 2.8.0

- [minor] Support parse/encode of the <ac:placeholder /> node [79e0a2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79e0a2a)

## 2.7.10

- [patch] Encode and decode for Extension schemaVersion [0335988](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0335988)

## 2.7.9

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 2.7.8

- [patch] Remove Confluence Macro resrouce identifier code [944c827](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/944c827)

## 2.7.7

- [patch] Allow width/height for placeholder and polish rendering [6d9f809](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d9f809)

## 2.7.5

- [patch] bump editor-common to 6.1.2 [bb7802e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb7802e)

## 2.7.4

- [patch] Convert specific params to resource identifiers on encode and decode [778e2bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/778e2bf)

## 2.7.3

- [patch] remove mention name from encoder [130f15c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/130f15c)

## 2.7.2

- [patch] Allow macro provider to handle auto conversion during paste [b2c83f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b2c83f8)

## 2.7.0

- [minor] added new panelType [9f693b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f693b9)

## 2.6.0

- [minor] added date plugin [f7b8a33](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f7b8a33)

## 2.5.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 2.4.1

- [patch] Minor bump of editor-confluence transformer to update editor-core [01a4a8b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/01a4a8b)

## 2.4.0

- [minor] added tasks/actions to full-page editor [49d3343](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d3343)

## 2.2.4

- [patch] Add support for single image wrap left/right layout [59d9a74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59d9a74)

## 2.2.3

- [patch] Fix dependencies in CI [35c5914](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35c5914)

## 2.2.0

- [minor] Add Serializer for Single image [03405bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/03405bf)

## 2.1.1

- [patch] split extension node [4303d49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4303d49)

## 2.0.1

- [patch] Fix of the build scripts for editor-\*-transformer packages [59b4ea5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59b4ea5)

## 2.0.0

- [major] Adding separate transformer packages. [f734c01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f734c01)
