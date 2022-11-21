import React, { Fragment } from 'react';
import Form, { Field, ErrorMessage, HelperMessage } from '@atlaskit/form';
import { cities } from '../common/data';
import Select from '../../src';

const validate = (value: any) => (!value ? 'EMPTY' : undefined);

interface FormData {
  'fail-city': string;
  'success-city': string;
}

const ValidationExample = () => (
  <Form onSubmit={(data: FormData) => console.log(data)}>
    {({ formProps }: any) => (
      <form {...formProps}>
        <Field label="City" name="fail-city" validate={validate}>
          {({ fieldProps: { isInvalid, ...props }, error }: any) => (
            <Fragment>
              <Select
                {...props}
                options={cities}
                placeholder="Choose a City"
                isInvalid={isInvalid}
              />
              <HelperMessage>
                Trigger a validation error by focusing on this field and
                pressing tab.
              </HelperMessage>
              {error === 'EMPTY' && (
                <ErrorMessage>This field is required.</ErrorMessage>
              )}
            </Fragment>
          )}
        </Field>
        <hr style={{ border: 0, margin: '1em 0' }} />
        <Field
          label="City"
          id="success"
          name="success-city"
          defaultValue={cities[0]}
          validate={validate}
        >
          {({ fieldProps: { isInvalid, ...props } }: any) => (
            <Select
              {...props}
              options={cities}
              placeholder="Choose a City"
              isInvalid={isInvalid}
            />
          )}
        </Field>
      </form>
    )}
  </Form>
);

export default ValidationExample;
