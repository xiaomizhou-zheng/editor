"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const HomeIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M10 19v-4.5a2 2 0 114 0V19h4a1 1 0 001-1v-7.831l-6.293-6.296a1 1 0 00-1.414 0L5 10.169V18a1 1 0 001 1h4zm11-6.83V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-5.83l-.04.04c-.39.39-1.03.39-1.42 0-.39-.39-.39-1.03 0-1.42l8.339-8.331a3 3 0 014.242 0l8.339 8.331c.39.39.39 1.03 0 1.42-.39.39-1.03.39-1.42 0l-.04-.04z" fill="currentColor"/></svg>`
}, props));

HomeIcon.displayName = 'HomeIcon';
var _default = HomeIcon;
exports.default = _default;