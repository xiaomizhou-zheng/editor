export {};
it.skip('TODO: restore unit', () => {});

// import React from 'react';

// import { EditorView } from 'prosemirror-view';

// import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// import {
//   doc,
//   p,
//   table,
//   tdCursor,
//   tdEmpty,
//   th,
//   tr,
// } from '@atlaskit/editor-test-helpers/doc-builder';

// import DropdownMenuWrapper from '../../../../../ui/DropdownMenu';
// import { ContextualMenu } from '../ContextualMenu';

// import { shallow } from 'enzyme';
// import { createIntl } from 'react-intl-next';

// describe('ContextualMenu', () => {
//   const getEditorContainerWidth = () => ({ width: 500 });
//   const createEditor = createEditorFactory();
//   describe('with right table cell position in plugin state', () => {
//     let editorView: EditorView;
//     beforeEach(() => {
//       ({ editorView } = createEditor({
//         doc: doc(table()(tr(th()(p('')), th()(p(''))), tr(tdCursor, tdEmpty))),
//         editorProps: {
//           allowTables: {
//             advanced: true,
//           },
//         },
//       }));
//     });

//     it('should render contextual menu when no tableCellPosition is passed but exist on editor state ', () => {
//       const intl = createIntl({ locale: 'en' });
//       const wrapper = shallow(
//         <ContextualMenu
//           intl={intl}
//           editorView={editorView}
//           selectionRect={{ bottom: 0, left: 0, right: 0, top: 0 }}
//           isOpen
//           getEditorContainerWidth={getEditorContainerWidth}
//         />,
//       );

//       expect(wrapper.find(DropdownMenuWrapper).length).toEqual(1);
//     });
//   });
// });
