"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _tippy = require("tippy.js");

var _tippy2 = _interopRequireDefault(_tippy);

var _Header = require("./components/Header");

var _Header2 = _interopRequireDefault(_Header);

var _Footer = require("./components/Footer");

var _Footer2 = _interopRequireDefault(_Footer);

var _DefinitionSection = require("./components/DefinitionSection");

var _DefinitionSection2 = _interopRequireDefault(_DefinitionSection);

var _ExampleSection = require("./components/ExampleSection");

var _ExampleSection2 = _interopRequireDefault(_ExampleSection);

var _ImageSection = require("./components/ImageSection");

var _ImageSection2 = _interopRequireDefault(_ImageSection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * aweza-popup
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2018  FastAcademy
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * This program is free software: you can redistribute it and/or modify
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * it under the terms of the GNU General Public License as published by
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * the Free Software Foundation, either version 3 of the License, or
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * (at your option) any later version.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * This program is distributed in the hope that it will be useful,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * but WITHOUT ANY WARRANTY; without even the implied warranty of
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * GNU General Public License for more details.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * You should have received a copy of the GNU General Public License
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * along with this program.  If not, see <https://www.gnu.org/licenses/>.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/** @jsx h */

var dataUrl = "https://tms2.aweza.co.za/api/term";
var headers = {};
var preferLang = null;
var tippyInstance = null;

function fetchTerm(id) {
  return fetch(dataUrl + "/" + id, {
    method: "GET",
    mode: "cors",
    headers: headers
  }).then(function (response) {
    if (response.status === 404) {
      throw "Error: Term not found";
    } else if (response.status === 401) {
      throw "Error: Unauthorized. Check your credentials.";
    }
    return response.json();
  });
}

function createTemplate() {
  var appTemplate = document.createElement("div");
  appTemplate.setAttribute("id", "aweza-popup-app");
  appTemplate.style.display = "none";
  document.body.appendChild(appTemplate);
}

function AwezaPopup(options) {
  if (options.headers) {
    headers = options.headers;
  }
  if (options.dataUrl) {
    dataUrl = options.dataUrl;
  }

  if (options.preferLang) {
    preferLang = options.preferLang;
  }

  createTemplate();

  tippyInstance = (0, _tippy2.default)(document.querySelectorAll("[data-aweza]"), {
    placement: "right",
    trigger: "click",
    interactive: true,
    animation: "fade",
    multiple: false,
    arrow: true,
    theme: "aweza",
    maxWidth: "320px",
    duration: [50, 50],
    html: "#aweza-popup-app",
    onShown: function onShown() {
      var tooltipContents = Array.from(this.children[0].children).find(function (child) {
        return child.className === "tippy-content";
      });
      // fetch term here instead and remount react component each time?
      if (tooltipContents.innerHTML == "") {
        (0, _preact.render)((0, _preact.h)(PopupContents, { termID: this._reference.dataset.aweza }), tooltipContents);
      }
    }
  });
}

var PopupContents = function (_Component) {
  _inherits(PopupContents, _Component);

  function PopupContents(props) {
    _classCallCheck(this, PopupContents);

    var _this = _possibleConstructorReturn(this, (PopupContents.__proto__ || Object.getPrototypeOf(PopupContents)).call(this, props));

    _this.state = {
      termID: props.termID,
      currentTranslationId: null,
      loading: true,
      term: {}
    };
    return _this;
  }

  _createClass(PopupContents, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      fetchTerm(this.state.termID).then(function (data) {
        return _this2.setCurrentTerm(data);
      }).catch(function (e) {
        console.error(e);
        var tooltip = tippyInstance.tooltips.find(function (tt) {
          return tt.reference.dataset.aweza == _this2.state.termID;
        });
        var tippyContent = Array.from(tooltip.popper.firstChild.children).find(function (child) {
          return child.className === "tippy-content";
        });
        _this2.setState({
          error: "Whoops! Aweza data could not be loaded."
        }, function () {
          setTimeout(function () {
            tippyContent.innerHTML = "";
            tooltip.hide();
          }, 2000);
        });
      });
    }
  }, {
    key: "setCurrentTerm",
    value: function setCurrentTerm(data) {
      var _this3 = this;

      var currentTranslationId = null;
      if (data.translations && data.translations.length > 0) {
        // Default to the first translation
        currentTranslationId = data.translations[0].id;

        // If there is a preferred language set in options
        if (preferLang) {

          // Try to get this translation
          var translation = data.translations.find(function (translation) {
            return translation.language.code === preferLang;
          });

          if (translation) {
            currentTranslationId = translation.id;
          }
        }
      }

      this.setState({
        term: data,
        currentTranslationId: currentTranslationId
      }, function () {
        return _this3.setState({ loading: false });
      });
    }
  }, {
    key: "onSelectLanguage",
    value: function onSelectLanguage(e) {
      this.setState({
        currentTranslationId: parseInt(e.target.value)
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      if (this.state.error) {
        return (0, _preact.h)(
          "div",
          null,
          this.state.error
        );
      }

      if (this.state.loading) {
        return (0, _preact.h)(
          "div",
          null,
          "Loading..."
        );
      }

      // Get the current translation to show
      var translationTerm = this.state.term.translations && this.state.term.translations.length > 0 ? this.state.term.translations.find(function (translation) {
        return _this4.state.currentTranslationId === translation.id;
      }) : null;

      var categoryTitle = this.state.term.categories ? this.state.term.categories.reduce(function (a, c) {
        return a + " | " + c.name;
      }, "").substr(2) : "";

      return (0, _preact.h)(
        "div",
        { "class": "aweza-popup-content", style: "display: flex; flex-direction: column;" },
        (0, _preact.h)(_Header2.default, { title: categoryTitle }),
        (0, _preact.h)(_DefinitionSection2.default, { term: this.state.term, translationTerm: translationTerm }),
        this.state.term.example && (0, _preact.h)(_ExampleSection2.default, { term: this.state.term, translationTerm: translationTerm }),
        this.state.term.image && (0, _preact.h)(_ImageSection2.default, this.state.term),
        (0, _preact.h)(_Footer2.default, _extends({ currentTranslationId: this.state.currentTranslationId,
          onSelectLanguage: function onSelectLanguage(e) {
            return _this4.onSelectLanguage(e);
          } }, this.state.term))
      );
    }
  }]);

  return PopupContents;
}(_preact.Component);

window.AwezaPopup = AwezaPopup;
exports.default = AwezaPopup;