<!-- API Report Version: 2.3 -->

## API Report File for "@atlaskit/outbound-auth-flow-client"

> Do not edit this file. This report is auto-generated using [API Extractor](https://api-extractor.com/).
> [Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

### Table of contents

- [Main Entry Types](#main-entry-types)

### Main Entry Types

<!--SECTION START: Main Entry Types-->

```ts
// @public (undocumented)
export function auth(startUrl: string, windowFeatures?: string): Promise<void>;

// @public (undocumented)
export class AuthError extends Error {
  constructor(message: string, type?: AuthErrorType | undefined);
  // (undocumented)
  readonly message: string;
  // (undocumented)
  readonly type?: AuthErrorType | undefined;
}

// @public (undocumented)
type AuthErrorType =
  | 'access_denied'
  | 'auth_window_closed'
  | 'authclientoauth2.autherror'
  | 'invalid_request'
  | 'invalid_scope'
  | 'server_error'
  | 'temporarily_unavailable'
  | 'unauthorized_client'
  | 'unsupported_response_type';

// (No @packageDocumentation comment for this package)
```

<!--SECTION END: Main Entry Types-->