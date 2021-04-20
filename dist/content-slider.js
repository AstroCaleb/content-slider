(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ContentSlider = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _readOnlyError(name) {
    throw new TypeError("\"" + name + "\" is read-only");
  }

  /*!
   * content-slider.js v1.0.0
   * https://github.com/AstroCaleb/content-slider
   *
   * Copyright 2021-Present Caleb Dudley
   * Released under the MIT license
   */
  var ContentSlider = /*#__PURE__*/function () {
    /**
     * Create a new ContentSlider instance.
     * @param {String} wrapper - Selector string for the content slider wrapper.
     * @param {Object} [options={}] - The configuration options.
     */
    function ContentSlider() {
      var _this = this;

      var wrapper = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-content-slider]';
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, ContentSlider);

      this.sliderTransitioning = false;
      this.wrapper = wrapper;
      this.options = options;

      this.callback = options.callback || function () {};

      this.motion = options.motion !== undefined ? options.motion : true;
      this.injectCSS = options.injectCSS !== undefined ? options.injectCSS : true;
      this.startingIndex = options.startingIndex !== undefined ? options.startingIndex : 0;
      this.breadcrumbsEnabled = options.breadcrumbsEnabled !== undefined ? options.breadcrumbsEnabled : true;
      this.automaticBreadcrumbs = options.automaticBreadcrumbs !== undefined ? options.automaticBreadcrumbs : true;
      this.progressiveBreadcrumbs = options.progressiveBreadcrumbs !== undefined ? options.progressiveBreadcrumbs : false;
      this.css = options.css !== undefined ? options.css : {};
      this.cssDefaults = {
        linkHue: '204',
        linkSaturation: '82%',
        linkLightness: '36%',
        link: 'hsl(var(--cs-link-hue), var(--cs-link-saturation), var(--cs-link-lightness))',
        linkHover: 'hsl(var(--cs-link-hue), var(--cs-link-saturation), calc(var(--cs-link-lightness) + 10%))',
        background: '#FFF',
        separator: '\\276F',
        transitionSpeed: 0.35
      };

      if (!document.querySelector(this.wrapper)) {
        throw new Error('A content slider instance needs to accessible in the DOM');
      }

      if (document.querySelectorAll(this.wrapper).length > 1) {
        throw new Error("For multiple content slider instances you will need to instantiate `ContentSlider` per content slider wrapper and specify the `wrapper` selector. \n\n--> Example: `const slider = new ContentSlider('.my-content-slider');`\n");
      }

      if (typeof this.callback !== 'function') {
        throw new Error('`callback` needs to be a function');
      }

      if (this.injectCSS !== undefined && typeof this.injectCSS !== 'boolean') {
        throw new Error('`injectCSS` needs to be a boolean');
      }

      if (this.startingIndex !== undefined && typeof this.startingIndex !== 'number') {
        throw new Error('`startingIndex` needs to be a number');
      }

      if (this.breadcrumbsEnabled !== undefined && typeof this.breadcrumbsEnabled !== 'boolean') {
        throw new Error('`breadcrumbsEnabled` needs to be a boolean');
      }

      if (this.automaticBreadcrumbs !== undefined && typeof this.automaticBreadcrumbs !== 'boolean') {
        throw new Error('`automaticBreadcrumbs` needs to be a boolean');
      }

      if (this.progressiveBreadcrumbs !== undefined && typeof this.progressiveBreadcrumbs !== 'boolean') {
        throw new Error('`progressiveBreadcrumbs` needs to be a booleans');
      }

      if (this.css !== undefined && _typeof(this.css) !== 'object') {
        throw new Error('`options.css` needs to be an object');
      }

      this.css = _objectSpread2(_objectSpread2({}, this.cssDefaults), this.css);

      if (this.injectCSS) {
        var existingStyleTag = document.querySelector('style[data-content-slider-style]');
        var customStyleTagExists = !!existingStyleTag;
        var contentSliderCSS = "html{--cs-background:".concat(this.css.background, ";--cs-separator:\"").concat(this.css.separator, "\";--cs-link-hue:").concat(this.css.linkHue, ";--cs-link-saturation:").concat(this.css.linkSaturation, ";--cs-link-lightness:").concat(this.css.linkLightness, ";--cs-link:").concat(this.css.link, ";--cs-link-hover:").concat(this.css.linkHover, "}[data-content-slider]{height:auto;width:100%}[data-cs-breadcrumbs]{margin-bottom:20px}[data-cs-breadcrumbs] [data-cs-breadcrumb]{color:var(--cs-link);padding:5px}[data-cs-breadcrumbs] [data-cs-breadcrumb]:first-child{padding-left:0}[data-cs-breadcrumbs] [data-cs-breadcrumb]:hover{color:var(--cs-link-hover);cursor:pointer}[data-cs-breadcrumbs] [data-cs-breadcrumb]:not(:last-child):after{color:#222;content:var(--cs-separator);margin:0 0 0 12px}[data-cs-breadcrumbs] [data-cs-breadcrumb][data-slider-active],[data-cs-breadcrumbs] [data-cs-breadcrumb][data-slider-active]:focus,[data-cs-breadcrumbs] [data-cs-breadcrumb][data-slider-active]:hover{color:#222;cursor:default!important;outline:0!important;box-shadow:none!important}[data-cs-panes]{height:auto;overflow:hidden;position:static;transition:").concat(this.css.transitionSpeed, "s height ease;width:100%;z-index:1}[data-cs-panes]>[data-cs-pane]{background:var(--cs-background);box-sizing:border-box;display:inline-block;outline:0;padding:0 2px;transition:").concat(this.css.transitionSpeed, "s all ease;width:calc(100% - 4px)}[data-cs-panes].sliding{position:relative}[data-cs-panes].sliding>[data-cs-pane]{position:absolute!important}[data-cs-panes]>[data-cs-pane]:not(:first-child){position:absolute;-webkit-transform:translate(100.5%,0);-ms-transform:translate(100.5%,0);transform:translate(100.5%,0);top:0;z-index:3}[data-cs-panes]>[data-cs-pane].pane-in-view{opacity:1;position:relative;-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0);z-index:2}[data-cs-panes]>[data-cs-pane].pane-in-view.pane-behind{opacity:0;position:absolute!important;-webkit-transform:translate(-10%,0);-ms-transform:translate(-10%,0);transform:translate(-10%,0);z-index:1}[data-cs-no-motion] [data-cs-panes]>[data-cs-pane]:not(:first-child),[data-cs-no-motion] [data-cs-panes]>[data-cs-pane].pane-in-view.pane-behind {-webkit-transform: translate(0, 0) !important;-ms-transform: translate(0, 0) !important;transform: translate(0, 0) !important;}[data-cs-no-motion] [data-cs-panes]>[data-cs-pane]:not(:first-child) {opacity: 0 !important;}[data-cs-no-motion] [data-cs-panes]>[data-cs-pane].pane-in-view {opacity: 1 !important;}");

        if (customStyleTagExists) {
          // if options.css are defined, update existing styles (impacts all slider instances)
          if (this.css) {
            existingStyleTag.innerText = contentSliderCSS;
          }
        } else {
          var documentHead = document.head || document.getElementsByTagName('head')[0];
          var styleTag = document.createElement('style');
          styleTag.setAttribute('data-content-slider-style', 'content-slider');
          styleTag.appendChild(document.createTextNode(contentSliderCSS));
          documentHead.appendChild(styleTag);
        }
      } // Make sure we have the correct data attribute set based on the motion setting


      if (this.motion) {
        document.querySelector(this.wrapper).removeAttribute('data-cs-no-motion');
      } else {
        document.querySelector(this.wrapper).setAttribute('data-cs-no-motion', '');
      }

      var $panesWrapper = document.querySelector(this.wrapper).querySelector('[data-cs-panes]');
      var $panes = $panesWrapper.children;

      if (this.automaticBreadcrumbs && this.breadcrumbsEnabled) {
        if (this.progressiveBreadcrumbs) {
          var firstPaneID = $panes[0].id;
          var firstPaneBreadcrumbText = $panes[0].dataset.breadcrumbText;

          if (firstPaneID === '') {
            firstPaneID = this.randomString();
          }

          for (var i = 0; i < $panes.length; i++) {
            // Only inject breadcrumbs into other panes, not the first one
            if (i !== 0) {
              var currentPaneID = $panes[i].id;
              var currentPaneBreadcrumbText = $panes[i].dataset.breadcrumbText;

              if (currentPaneID === '') {
                currentPaneID = this.randomString();
              }

              var breadcrumbUnit = "<div data-cs-breadcrumbs aria-label=\"Breadcrumb\">\n                            <span tabindex=\"0\" data-cs-breadcrumb data-slider=\"#".concat(firstPaneID, "\">").concat(firstPaneBreadcrumbText, "</span>\n                            <span tabindex=\"-1\" data-cs-breadcrumb data-slider=\"#").concat(currentPaneID, "\" data-slider-active=\"active\" aria-current=\"page\">").concat(currentPaneBreadcrumbText, "</span>\n                        </div>");
              document.querySelector("#".concat(currentPaneID)).insertAdjacentHTML('afterbegin', breadcrumbUnit);
            }
          }
        } else {
          var breadcrumbs = '';

          for (var _i = 0; _i < $panes.length; _i++) {
            var paneID = $panes[_i].id;
            var breadcrumbText = $panes[_i].dataset.breadcrumbText;

            if (paneID === '') {
              paneID = this.randomString();
            }

            if (_i === this.startingIndex) {
              breadcrumbs += "<span tabindex=\"-1\" data-cs-breadcrumb data-slider=\"#".concat(paneID, "\" data-slider-active=\"active\" aria-current=\"page\">").concat(breadcrumbText, "</span>");
            } else {
              breadcrumbs += "<span tabindex=\"0\" data-cs-breadcrumb data-slider=\"#".concat(paneID, "\">").concat(breadcrumbText, "</span>");
            }
          }

          var _breadcrumbUnit = "<div data-cs-breadcrumbs aria-label=\"Breadcrumb\">".concat(breadcrumbs, "</div>");

          document.querySelector(this.wrapper).insertAdjacentHTML('afterbegin', _breadcrumbUnit);
        }
      } else {
        // otherwise update existing ones to match starting index, in case markup was incorrect
        var existingBreadcrumbs = [];

        try {
          existingBreadcrumbs = document.querySelector(this.wrapper).querySelector('[data-cs-breadcrumbs]').children;
        } catch (e) {}

        for (var _i2 = 0; _i2 < existingBreadcrumbs.length; _i2++) {
          var crumb = existingBreadcrumbs[_i2];

          if (_i2 === this.startingIndex) {
            crumb.dataset.sliderActive = 'active';
            crumb.ariaCurrent = 'page';
            crumb.tabIndex = '-1';
          } else {
            delete crumb.dataset.sliderActive;
            crumb.removeAttribute('aria-current');
            crumb.tabIndex = '0';
          }
        }
      }

      $panesWrapper.setAttribute('aria-live', 'polite');

      for (var _i3 = 0; _i3 < $panes.length; _i3++) {
        if (this.startingIndex > 0) {
          if (_i3 !== this.startingIndex) {
            $panes[_i3].tabIndex = '-1';
            $panes[_i3].style = 'visibility: hidden; display: none;';
            $panes[_i3].ariaHidden = 'true';

            if (_i3 < this.startingIndex) {
              $panes[_i3].classList.add('pane-in-view');

              $panes[_i3].classList.add('pane-behind');
            }
          } else {
            $panes[_i3].tabIndex = '0';
            $panes[_i3].style = 'visibility: visible;';
            $panes[_i3].ariaHidden = 'false';

            $panes[_i3].classList.add('pane-in-view');
          }
        } else {
          if (_i3 === 0) {
            $panes[_i3].tabIndex = '0';
            $panes[_i3].style = 'visibility: visible;';
            $panes[_i3].ariaHidden = 'false';
          } else {
            $panes[_i3].tabIndex = '-1';
            $panes[_i3].style = 'visibility: hidden; display: none;';
            $panes[_i3].ariaHidden = 'true';
          }
        }

        if ($panes[_i3].id === '') {
          if (this.breadcrumbsEnabled) {
            if (this.automaticBreadcrumbs) {
              $panes[_i3].id = document.querySelector(this.wrapper).querySelector('[data-cs-breadcrumbs]').children[_i3].dataset.slider.substring(1);
            } else {
              var newID = this.randomString();
              $panes[_i3].id = newID;
              document.querySelector(this.wrapper).querySelector('[data-cs-breadcrumbs]').children[_i3].dataset.slider = "#".concat(newID);
            }
          } else {
            $panes[_i3].id = this.randomString();
          }
        }
      }

      var passiveSupported = false;

      try {
        window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
          get: function get() {
            passiveSupported = (_readOnlyError("passiveSupported"), true);
          }
        }));
      } catch (err) {}

      document.querySelector(this.wrapper).addEventListener('keydown', function (e) {
        try {
          if (e.key === 'Enter' && e.target && e.target.dataset['csBreadcrumb'] !== undefined && e.target.dataset['sliderActive'] === undefined) {
            e.target.click();
          }
        } catch (e) {}
      }, passiveSupported ? {
        passive: true
      } : false);
      document.querySelector(this.wrapper).addEventListener('click', function (e) {
        try {
          if (e.target && e.target.dataset['csBreadcrumb'] !== undefined && e.target.dataset['sliderActive'] === undefined) {
            _this.showContentSliderPane(e.target.dataset['slider'], _this.options);
          }
        } catch (e) {}
      }, passiveSupported ? {
        passive: true
      } : false);
    }

    _createClass(ContentSlider, [{
      key: "randomString",
      value: function randomString() {
        var letterPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var randomString = '';

        for (var L = 16; L > 0; --L) {
          randomString += letterPool[Math.floor(Math.random() * letterPool.length)];
        }

        return randomString;
      }
    }, {
      key: "updateBreadcrumbs",
      value: function updateBreadcrumbs(paneSelector) {
        var currentBreadcrumb = document.querySelector("[data-cs-breadcrumb][data-slider=\"".concat(paneSelector, "\"]"));
        var existingBreadcrumbs = [];

        try {
          existingBreadcrumbs = document.querySelector("[data-cs-breadcrumb][data-slider=\"".concat(paneSelector, "\"]")).parentNode.children;
        } catch (e) {}

        for (var i = 0; i < existingBreadcrumbs.length; i++) {
          // reset all breadcrumbs
          delete existingBreadcrumbs[i].dataset.sliderActive;
          existingBreadcrumbs[i].removeAttribute('aria-current');
          existingBreadcrumbs[i].tabIndex = '0';
        }

        if (currentBreadcrumb) {
          currentBreadcrumb.dataset.sliderActive = 'active';
          currentBreadcrumb.ariaCurrent = 'page';
          currentBreadcrumb.tabIndex = '-1';
        }
      }
      /**
       * Manually trigger showing a content slider pane.
       * @param {String} paneSelector - The specific pane to make visible.
       * @param {Function} callback - Optional callback triggered after a content pane is shown. This inherits from the constructor if nothing is provided.
       */

    }, {
      key: "showContentSliderPane",
      value: function showContentSliderPane(paneSelector, callback) {
        var _this2 = this;

        if (document.querySelectorAll(paneSelector).length > 1) {
          console.error("Multiple panes found with the selector provided: ".concat(paneSelector));
          return;
        }

        var sliderCallback = callback || this.callback;
        var $pane = document.querySelector(paneSelector) || document.querySelector("".concat(this.wrapper, " [data-cs-panes]")).children[0];
        var $paneWrapper = $pane.parentNode;
        var paneIndex = Array.prototype.indexOf.call($paneWrapper.children, $pane);

        if ($pane.classList.contains('pane-in-view') && !$pane.classList.contains('pane-behind')) {
          return;
        }

        if (this.sliderTransitioning) {
          return;
        }

        this.sliderTransitioning = true;
        $paneWrapper.setAttribute('style', 'height:' + $paneWrapper.clientHeight + 'px;');
        $paneWrapper.classList.add('sliding'); // During sliding transitions, prevent a user from tabbing around
        // the UI as this may cause some unwanted UI shifting.

        var tabKeyHandler = function tabKeyHandler(e) {
          if (e.key === 'Tab') {
            e.preventDefault();
          }
        };

        document.addEventListener('keydown', tabKeyHandler);

        if ($pane.previousElementSibling) {
          for (var i = 0; i < paneIndex; i++) {
            var $paneEl = $paneWrapper.children[i];
            $paneEl.classList.add('pane-in-view'); // in the case it's the first pane

            $paneEl.classList.add('pane-behind');
            $paneEl.setAttribute('aria-hidden', 'true');
            $paneEl.setAttribute('tabindex', '-1');
          }

          setTimeout(function () {
            for (var _i4 = 0; _i4 < paneIndex; _i4++) {
              $paneWrapper.children[_i4].style.visibility = 'hidden';
              $paneWrapper.children[_i4].style.display = 'none';
            }
          }, this.css.transitionSpeed * 1000 + 50);
        }

        if ($pane.nextElementSibling) {
          for (var _i5 = paneIndex + 1; _i5 < $paneWrapper.children.length; _i5++) {
            var _$paneEl = $paneWrapper.children[_i5];

            _$paneEl.classList.remove('pane-in-view');

            _$paneEl.classList.remove('pane-behind');

            _$paneEl.setAttribute('aria-hidden', 'true');

            _$paneEl.setAttribute('tabindex', '-1');
          }

          setTimeout(function () {
            for (var _i6 = paneIndex + 1; _i6 < $paneWrapper.children.length; _i6++) {
              $paneWrapper.children[_i6].style.visibility = 'hidden';
              $paneWrapper.children[_i6].style.display = 'none';
            }
          }, this.css.transitionSpeed * 1000 + 50);
        } // setting specified pane to be in view and not behind any other panes


        $pane.style.removeProperty('display'); // To fix a display issue, wait 10 milliseconds to continue changing styles

        setTimeout(function () {
          $pane.classList.remove('pane-behind');
          $pane.classList.add('pane-in-view');
          $pane.setAttribute('aria-hidden', 'false');
          $pane.setAttribute('tabindex', '0');
          $pane.style.visibility = 'visible';
          $paneWrapper.setAttribute('style', 'height:' + $pane.clientHeight + 'px;');

          _this2.updateBreadcrumbs(paneSelector);
          /**
           * When making the pane visible, check if it's the first child element.
           * Remove the `pane-in-view` class to avoid position related style
           * issues for absolutely positioned elements on the page.
           */


          if ($pane.previousElementSibling === null) {
            $pane.classList.remove('pane-in-view');
          }
        }, 10);
        setTimeout(function () {
          window.document.removeEventListener('keydown', tabKeyHandler);
          $paneWrapper.setAttribute('style', 'height:auto;');
          $paneWrapper.classList.remove('sliding');
          _this2.sliderTransitioning = false;

          if (sliderCallback && typeof sliderCallback === 'function') {
            sliderCallback();
          }
        }, this.css.transitionSpeed * 1000 + 50);
      }
    }]);

    return ContentSlider;
  }();

  return ContentSlider;

})));
