import React from 'react';
import { IntlProvider } from 'react-intl-next';
import enMessages from '../src/i18n/en';
import languages from '../src/i18n/languages';
import WithEditorActions from '../src/ui/WithEditorActions';
import {
  default as FullPageExample,
  SaveAndCancelButtons,
} from './5-full-page';
import LanguagePicker from '../example-helpers/LanguagePicker';
import { MediaOptions } from '../src';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import adf from '../example-helpers/templates/media-with-caption.adf.json';
import { getTranslations } from '../example-helpers/get-translations';

export type Props = {};
export type State = { locale: string; messages: { [key: string]: string } };

export default class ExampleEditor extends React.Component<Props, State> {
  state: State = { locale: 'en', messages: enMessages };

  render() {
    const { locale, messages } = this.state;
    const mediaFeatureFlags: MediaFeatureFlags = {
      captions: true,
    };
    const mediaOptions: MediaOptions = {
      allowMediaSingle: true,
      featureFlags: mediaFeatureFlags,
    };

    return (
      <IntlProvider
        locale={this.getProperLanguageKey(locale)}
        messages={messages}
      >
        <FullPageExample
          editorProps={{
            defaultValue: adf,
            allowHelpDialog: true,
            media: mediaOptions,
            primaryToolbarComponents: (
              <WithEditorActions
                render={(actions) => (
                  <React.Fragment>
                    <LanguagePicker
                      languages={languages}
                      locale={locale}
                      onChange={this.loadLocale}
                    />
                    <SaveAndCancelButtons editorActions={actions} />
                  </React.Fragment>
                )}
              />
            ),
          }}
        />
      </IntlProvider>
    );
  }

  private loadLocale = async (locale: string) => {
    const messages = await getTranslations(locale);
    this.setState({ locale, messages });
  };

  private getProperLanguageKey = (locale: string) => locale.replace('_', '-');
}
