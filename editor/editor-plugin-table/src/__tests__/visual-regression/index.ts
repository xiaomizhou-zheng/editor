export {};

// import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
// import {
//   snapshot,
//   initFullPageEditorWithAdf,
// } from '../../../../__tests__/visual-regression/_utils';
// import tableWith100ListItemsADF from './__fixtures__/table-with-100-numbered-list-items.json';
// import {
//   scrollToBottom,
//   scrollToElement,
// } from '../../../../__tests__/__helpers/page-objects/_editor';

// async function initEditor(page: PuppeteerPage, adf: Object) {
//   await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI, undefined, {});
// }

it.skip('TODO: restore vr `packages/editor/editor-plugin-table/src/plugins/table/__tests__/visual-regression/index.ts`', () => {});

// describe('Snapshot Test: Table', () => {
//   let page: PuppeteerPage;

//   beforeEach(() => {
//     page = global.page;
//   });

//   describe('numbered list', () => {
//     it('should not overflow table cell, when there are more than 100 ordered list items', async () => {
//       await initEditor(page, tableWith100ListItemsADF);

//       // initial elements
//       await snapshot(page);

//       // 100th elements
//       await scrollToElement(page, 'ol > li:nth-of-type(120)');
//       await snapshot(page);

//       // 1000th elements
//       await scrollToBottom(page);
//       await snapshot(page);
//     });
//   });
// });
