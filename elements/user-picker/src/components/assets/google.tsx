import React from 'react';
import { token } from '@atlaskit/tokens';

export function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.32062 3.21332L10.014 1.55999C8.97396 0.593331 7.62063 0 6.00062 0C3.65396 0 1.62729 1.34666 0.640625 3.30665L2.58062 4.81331C3.06729 3.36665 4.41396 2.31999 6.00062 2.31999C7.12729 2.31999 7.88729 2.80665 8.32062 3.21332Z"
        fill={token('color.text.inverse', 'white')}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.76 6.13291C11.76 5.63958 11.72 5.27958 11.6333 4.90625H6V7.13291H9.30667C9.24 7.68624 8.88 8.51957 8.08 9.07957L9.97333 10.5462C11.1067 9.49956 11.76 7.95957 11.76 6.13291V6.13291V6.13291Z"
        fill={token('color.text.inverse', 'white')}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.58667 7.18662C2.46 6.81329 2.38667 6.41329 2.38667 5.99996C2.38667 5.58663 2.46 5.18663 2.58 4.8133L0.64 3.30664C0.233333 4.11997 0 5.0333 0 5.99996C0 6.96662 0.233333 7.87995 0.64 8.69328L2.58667 7.18662V7.18662Z"
        fill={token('color.text.inverse', 'white')}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.00079 12.0008C7.62079 12.0008 8.98079 11.4675 9.97413 10.5475L8.08079 9.08083C7.57413 9.43416 6.89413 9.68082 6.00079 9.68082C4.41413 9.68082 3.06746 8.63416 2.58746 7.1875L0.647461 8.69416C1.63413 10.6542 3.65413 12.0008 6.00079 12.0008V12.0008V12.0008Z"
        fill={token('color.text.inverse', 'white')}
      />
    </svg>
  );
}
