/** @jsx jsx */
import { memo, useCallback, useMemo } from 'react';

import { css, jsx } from '@emotion/react';
import { PrismAsync as SyntaxHighlighter } from 'react-syntax-highlighter';

import { useGlobalTheme } from '@atlaskit/theme/components';

import { useHighlightLines } from './internal/hooks/use-highlight';
import { getCodeBlockStyles, getCodeBlockTheme } from './internal/theme/styles';
import type { CodeBlockProps } from './internal/types';
import { normalizeLanguage } from './internal/utils/get-normalized-language';
import { createBidiWarningRenderer } from './react-syntax-highlighter-bidi-warning-renderer';

/**
 * __Code block__
 *
 * A code block highlights an entire block of code and keeps the formatting.
 *
 * - [Examples](https://atlassian.design/components/code/code-block/examples)
 * - [Code](https://atlassian.design/components/code/code-block/code)
 * - [Usage](https://atlassian.design/components/code/code-block/usage)
 */
const CodeBlock = memo<CodeBlockProps>(function CodeBlock({
  showLineNumbers = true,
  language: providedLanguage = 'text',
  highlight = '',
  highlightedStartText = 'Highlight start',
  highlightedEndText = 'Highlight end',
  testId,
  text,
  codeBidiWarnings = true,
  codeBidiWarningLabel,
  codeBidiWarningTooltipEnabled = true,
}) {
  const numLines = (text || '').split('\n').length;
  const globalTheme = useGlobalTheme();
  const theme = useMemo(() => getCodeBlockTheme(globalTheme, numLines), [
    globalTheme,
    numLines,
  ]);

  const getStyles = useMemo(() => getCodeBlockStyles(theme), [theme]);
  const styles = useMemo(
    () =>
      css(getStyles(highlightedStartText, highlightedEndText, showLineNumbers)),
    [highlightedStartText, highlightedEndText, showLineNumbers, getStyles],
  );

  const { getHighlightStyles, highlightedLines } = useHighlightLines({
    highlight,
    testId,
  });

  const getLineProps = useCallback(
    (line: number) => getHighlightStyles(line, highlightedLines),
    [getHighlightStyles, highlightedLines],
  );

  const language = useMemo(() => normalizeLanguage(providedLanguage), [
    providedLanguage,
  ]);

  // https://product-fabric.atlassian.net/browse/DST-2472
  const languageToUse = text ? language : 'text';

  const renderer = codeBidiWarnings
    ? createBidiWarningRenderer({
        codeBidiWarningLabel,
        codeBidiWarningTooltipEnabled,
      })
    : undefined;

  return (
    <SyntaxHighlighter
      data-testid={testId}
      data-code-lang={language}
      data-ds--code--code-block=""
      css={styles}
      language={languageToUse}
      PreTag="span"
      showLineNumbers={showLineNumbers}
      // Wrap lines is needed to set styles on the line when highlighting.
      wrapLines={highlight.length > 0 || !!testId}
      lineProps={getLineProps}
      useInlineStyles={false}
      renderer={renderer}
    >
      {text}
    </SyntaxHighlighter>
  );
});

CodeBlock.displayName = 'CodeBlock';

export default CodeBlock;
