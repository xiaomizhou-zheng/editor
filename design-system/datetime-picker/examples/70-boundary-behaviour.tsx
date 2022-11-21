import React, { Component } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';
import { Label } from '@atlaskit/form';
import Modal, { ModalBody, ModalTransition } from '@atlaskit/modal-dialog';
import Range from '@atlaskit/range';

import { DateTimePicker } from '../src';

interface State {
  datePickerValue: string;
  timePickerValue: string;
  dateTimePickerValue: string;
  isModalOpen: boolean;
  textAbove: number;
  textBelow: number;
}

export default class MyComponent extends Component<{}, State> {
  state = {
    datePickerValue: '2018-01-02',
    timePickerValue: '14:30',
    dateTimePickerValue: '2018-01-02T14:30+11:00',
    isModalOpen: false,
    textAbove: 1,
    textBelow: 1,
  };

  onDatePickerChange = (e: any) => {
    this.setState({
      datePickerValue: e.target.value,
    });
  };

  onTimePickerChange = (e: any) => {
    this.setState({
      timePickerValue: e.target.value,
    });
  };

  onDateTimePickerChange = (e: any) => {
    this.setState({
      dateTimePickerValue: e.target.value,
    });
  };

  openModal = () => {
    this.setState({
      isModalOpen: true,
    });
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  onTextAboveChange = (value: number) => {
    this.setState({
      textAbove: value,
    });
  };

  onTextBelowChange = (value: number) => {
    this.setState({
      textBelow: value,
    });
  };

  render() {
    const {
      dateTimePickerValue,
      isModalOpen,
      textAbove,
      textBelow,
    } = this.state;
    return (
      <div>
        <p style={{ paddingBottom: 10 }}>
          This demonstrates displaying the date time picker display behaviour
          within a modal. In particular, what happens when it overflows the
          modal body and what happens when it renders near the bottom of the
          viewport.
        </p>

        <Button onClick={this.openModal}>Open modal</Button>

        <ModalTransition>
          {isModalOpen && (
            <Modal onClose={this.closeModal}>
              <ModalBody>
                <Label htmlFor="paragraphs-above">
                  Paragraphs above: {textAbove}
                </Label>
                <Range
                  id="paragraphs-above"
                  value={textAbove}
                  min={0}
                  max={10}
                  step={1}
                  onChange={this.onTextAboveChange}
                />
                {textAbove > 0 ? <Lorem count={textAbove} /> : null}
                <Label htmlFor="react-select-above--input">Date</Label>
                <DateTimePicker id="above" defaultValue={dateTimePickerValue} />
                <Label htmlFor="paragraphs-below">
                  Paragraphs below: {textBelow}
                </Label>
                <Range
                  id="paragraphs-below"
                  value={textBelow}
                  min={0}
                  max={10}
                  step={1}
                  onChange={this.onTextBelowChange}
                />
                {textBelow > 0 ? <Lorem count={textBelow} /> : null}
              </ModalBody>
            </Modal>
          )}
        </ModalTransition>
      </div>
    );
  }
}
