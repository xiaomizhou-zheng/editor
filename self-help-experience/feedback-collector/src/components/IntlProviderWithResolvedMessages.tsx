import React, { FunctionComponent, useEffect, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import { getMessagesForLocale } from '../utils/i18n-get-messages-for-locale';

export const IntlProviderWithResolvedMessages: FunctionComponent<{
  locale?: string;
}> = ({ children, locale }) => {
  const [resolvedMessagesForLocale, setResolvedMessagesForLocale] = useState();
  useEffect(() => {
    const fetchMessageLocale = async () => {
      if (locale) {
        const messages = await getMessagesForLocale(locale);
        setResolvedMessagesForLocale(messages);
      }
    };
    fetchMessageLocale();
  }, [locale]);
  return (
    <IntlProvider
      locale={locale || 'en'}
      defaultLocale="en"
      messages={resolvedMessagesForLocale}
    >
      {children}
    </IntlProvider>
  );
};
