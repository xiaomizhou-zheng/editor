"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorCollapseIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M8.062 11L6.5 9.914A1 1 0 017.914 8.5l2.616 2.616c.28.167.47.5.47.884s-.19.717-.47.884L7.914 15.5A1 1 0 116.5 14.086L8.062 13h-3.68c-.487 0-.882-.448-.882-1s.395-1 .882-1h3.68zm5.408 1.884c-.28-.167-.47-.5-.47-.884s.19-.717.47-.884L16.086 8.5A1 1 0 0117.5 9.914L15.938 11h3.68c.487 0 .882.448.882 1s-.395 1-.882 1h-3.68l1.562 1.086a1 1 0 01-1.414 1.414l-2.616-2.616z" fill="currentColor"/></svg>`
}, props));

EditorCollapseIcon.displayName = 'EditorCollapseIcon';
var _default = EditorCollapseIcon;
exports.default = _default;