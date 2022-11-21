"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Story16Icon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#36B37E" fill-rule="evenodd" d="M2 0h12a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2zm6 11l-2.863 1.822c-.42.38-1.137.111-1.137-.427v-8.19C4 3.54 4.596 3 5.333 3h5.334C11.403 3 12 3.539 12 4.206v8.19c0 .537-.719.806-1.139.426L8 11zm0-2.371l2 1.274V5H6v4.902L8 8.63z"/></svg>`
}, props, {
  size: "small"
}));

Story16Icon.displayName = 'Story16Icon';
var _default = Story16Icon;
exports.default = _default;