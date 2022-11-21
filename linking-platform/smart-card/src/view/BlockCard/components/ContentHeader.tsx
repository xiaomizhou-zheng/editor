/** @jsx jsx */
import { jsx } from '@emotion/react';

export interface ContentHeaderProps {
  onClick: React.MouseEventHandler;
  link: string;
  children: React.ReactNode;
}

export const blockCardContentHeaderClassName = 'block-card-content-header';

export const ContentHeader = ({
  onClick,
  link,
  children,
}: ContentHeaderProps) => (
  <a
    onClick={onClick}
    href={link}
    target="_blank"
    css={{
      display: 'flex',
      alignItems: 'flex-start',
      // EDM-713: fixes copy-paste from renderer to editor for Firefox
      // due to HTML its unwrapping behaviour on paste.
      MozUserSelect: 'none',
    }}
    data-trello-do-not-use-override="block-card-content-header"
    className={blockCardContentHeaderClassName}
  >
    {children}
  </a>
);
