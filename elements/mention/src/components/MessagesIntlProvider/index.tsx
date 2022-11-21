import React from 'react';
import { IntlProvider, useIntl } from 'react-intl-next';
import { getMessagesForLocale } from '../../util/i18n';

const EMPTY: Record<string, string> = {};

const useI18n = (locale: string): Record<string, string> => {
  const [messages, setMessages] = React.useState<Record<string, string>>(EMPTY);

  React.useEffect(() => {
    let aborted = false;
    setMessages(EMPTY);
    getMessagesForLocale(locale)
      .then((messages) => {
        if (!aborted) {
          setMessages(messages);
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });

    return () => {
      aborted = true;
    };
  }, [locale]);

  return messages;
};

const MessagesIntlProvider: React.FC = (props) => {
  const { children } = props;
  const intl = useIntl();
  const messages = useI18n(intl.locale);

  return (
    <IntlProvider {...intl} messages={messages}>
      {children}
    </IntlProvider>
  );
};

export default MessagesIntlProvider;
