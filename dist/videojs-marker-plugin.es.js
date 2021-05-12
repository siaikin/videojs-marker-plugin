/*! @name videojs-marker-plugin @version 0.0.12 @license MIT */
import videojs from 'video.js';

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

var Component = videojs.getComponent('Component');
var TimeTooltip = videojs.getComponent('TimeTooltip');
/**
 * use by {@link MarkerPoint}, defined content when mouse over {@link MarkerPoint}.
 */

var MarkerPointTip = /*#__PURE__*/function (_Component) {
  _inheritsLoose(MarkerPointTip, _Component);

  /**
   * generate a {@link MarkerPoint} instance
   *
   * @param {Player} player videojs instance
   * @param {Object} options options
   * @param {number} options.offset offset form zero of video. unit(second)
   * @param {Object} options.data content of `options.type`
   */
  function MarkerPointTip(player, options) {
    var _this;

    _this = _Component.call(this, player, options) || this;
    _this.options = options;
    _this.timeToltip = new TimeTooltip(player);

    _this.timeToltip.hide();

    _this.addChild(_this.timeToltip);

    _this.addClass('vjs-marker-point-tip');

    _this.timeToltip.el_.innerHTML = "\n      <p class=\"vjs-marker-point-tip-time\">" + videojs.formatTime(_this.options.offset, 600) + "</p>\n      <p class=\"vjs-marker-point-tip-content\">" + _this.options.data.content + "</p>\n    ";
    return _this;
  }
  /**
   * refresh tip position
   * call this when init or window resize.
   */


  var _proto = MarkerPointTip.prototype;

  _proto.updatePosition = function updatePosition() {
    this.timeToltip.el_.style.left = "-" + this.timeToltip.el_.getBoundingClientRect().width / 2 + "px";
  };

  return MarkerPointTip;
}(Component);
/**
 * {@link MarkerPoint} is point displayed in the {@link MarkerBar}
 */


var MarkerPoint = /*#__PURE__*/function (_Component2) {
  _inheritsLoose(MarkerPoint, _Component2);

  /**
   * generate a {@link MarkerPoint} instance
   *
   * @param {Player} player videojs player instance
   * @param {Object} options options
   * @param {number} options.offset offset form zero of video. unit(second)
   * @param {string} options.type when mouse hover the {@link MarkerPoint}, the type of information displayed
   * @param {Object} options.data content of `options.type`
   */
  function MarkerPoint(player, options) {
    var _this2;

    _this2 = _Component2.call(this, player, options) || this;
    _this2.offset = options.offset;
    _this2.type = options.type;
    _this2.data = options.data;
    _this2.tip = new MarkerPointTip(player, {
      data: _this2.data,
      offset: _this2.offset
    });
    _this2.mouseDisplay = player.getDescendant(['ControlBar', 'ProgressControl', 'SeekBar', 'MouseTimeDisplay']);

    _this2.addChild(_this2.tip);

    _this2.enableTouchActivity();

    _this2.on('mouseenter', function (ev) {
      _this2.mouseDisplay.hide();

      _this2.tip.timeToltip.show();

      _this2.tip.updatePosition();
    });

    _this2.on('mouseleave', function (ev) {
      _this2.mouseDisplay.show();

      _this2.tip.timeToltip.hide();
    });

    return _this2;
  }
  /**
   * create dom element
   *
   * @return {*} dom
   */


  var _proto2 = MarkerPoint.prototype;

  _proto2.createEl = function createEl() {
    return videojs.dom.createEl('div', {
      className: 'vjs-marker-point'
    });
  }
  /**
   * refresh tip position
   * call this when init or window resize.
   *
   * @param {number} duration current video duration
   */
  ;

  _proto2.updatePosition = function updatePosition(duration) {
    console.log(this.offset, duration);
    this.el_.style.left = this.offset / duration * 100 + '%';
  };

  return MarkerPoint;
}(Component);

var Component$1 = videojs.getComponent('Component');
/**
 * Only the slider of the marker is displayed
 */

var MarkerBar = /*#__PURE__*/function (_Component) {
  _inheritsLoose(MarkerBar, _Component);

  /**
   * generate a {@link MarkerBar} instance
   *
   * @param {Player} player videojs player instance
   * @param {Object} options
   *                 options.markers
   * @return {MarkerBar} return a {@link MarkerBar} instance
   */
  MarkerBar.build = function build(player, options) {
    if (!(options.markers instanceof Array)) {
      options.markers = [];
    }

    var markers = [];

    for (var i = options.markers.length; i--;) {
      markers.push(new MarkerPoint(player, options.markers[i]));
    }

    return new MarkerBar(player, {
      markers: markers,
      barName: 'markerPoint'
    });
  }
  /**
   * same as {@link MarkerBar.build}, but not have options check.
   *
   * @param {Player} player {@link MarkerBar.build}
   * @param {Object} options {@link MarkerBar.build}
   */
  ;

  function MarkerBar(player, options) {
    var _this;

    _this = _Component.call(this, player, options) || this;
    options.markers.forEach(function (marker) {
      return _this.addChild(marker);
    });

    var onLoadedMetaData = function onLoadedMetaData() {
      var duration = player.duration();
      options.markers.forEach(function (marker) {
        marker.updatePosition(duration);
      });
      player.off('loadedmetadata', onLoadedMetaData);
    };

    player.on('loadedmetadata', onLoadedMetaData);
    return _this;
  }
  /**
   * create dom element
   *
   * @return {*} dom
   */


  var _proto = MarkerBar.prototype;

  _proto.createEl = function createEl() {
    return videojs.dom.createEl('div', {
      className: 'vjs-marker-bar'
    });
  };

  return MarkerBar;
}(Component$1);

videojs.registerComponent('MarkerBar', MarkerBar);

var version = "0.0.12";

var Component$2 = videojs.getComponent('Component');
/**
 * a marker point list displayed on right of video DOM.
 */

var MarkerPanel = /*#__PURE__*/function (_Component) {
  _inheritsLoose(MarkerPanel, _Component);

  /**
   * generate a {@link MarkerPanel} instance
   *
   * @param {Player} player videojs player instance
   * @param {Object} options
   *                 options.markers
   * @return {MarkerPanel} return a {@link MarkerPanel} instance
   */
  MarkerPanel.build = function build(player, options) {
    if (!(options.markers instanceof Array)) {
      options.markers = [];
    }

    return new MarkerPanel(player, {
      markers: options.markers
    });
  }
  /**
   * same as {@link MarkerPanel.build}, but not have options check.
   *
   * @param {Player} player {@link MarkerBar.build}
   * @param {Object} options {@link MarkerBar.build}
   */
  ;

  function MarkerPanel(player, options) {
    var _this;

    _this = _Component.call(this, player, options) || this;
    var markerItemList = [];
    var len = options.markers.length;

    for (var i = 0; i < len; i++) {
      var markerOption = options.markers[i];
      markerItemList.push(_this.createMarkerItem(markerOption.offset, markerOption.data));
    }

    _this.markerList = videojs.dom.createEl('div', {
      className: 'vjs-markers-panel-list'
    }, {}, markerItemList);

    _this.el_.appendChild(videojs.dom.createEl('div', {
      className: 'vjs-markers-panel-title'
    }, {}, '打点记录'));

    _this.el_.appendChild(videojs.dom.createEl('div', {
      className: 'vjs-markers-panel-subtitle'
    }, {}, '点击快速跳转至视频打点处'));

    _this.el_.appendChild(_this.markerList);

    return _this;
  }
  /**
   * create dom element
   *
   * @return {*} dom
   */


  var _proto = MarkerPanel.prototype;

  _proto.createEl = function createEl() {
    return videojs.dom.createEl('div', {
      className: 'vjs-markers-panel'
    });
  }
  /**
   * create marker point list item
   *
   * @param {number} offset offset form zero of video. unit(second)
   * @param {Object} data content of `options.type`
   * @return {HTMLDivElement} return lsit item DOM
   */
  ;

  _proto.createMarkerItem = function createMarkerItem(offset, data) {
    var _this2 = this;

    var timeDOM = videojs.dom.createEl('div', {
      className: 'vjs-markers-panel-item-time'
    }, {
      'data-offset': offset
    }, videojs.formatTime(offset, 600));
    var contentDOM = videojs.dom.createEl('div', {
      className: 'vjs-markers-panel-item-content'
    }, {
      'data-offset': offset
    }, data.content);
    var itemDOM = videojs.dom.createEl('div', {
      className: 'vjs-markers-panel-list-item'
    }, {
      'data-offset': offset
    }, [timeDOM, contentDOM]);
    itemDOM.addEventListener('click', function (ev) {
      var dom = ev.target;

      _this2.player_.currentTime(dom.dataset.offset);
    }, false);
    return itemDOM;
  };

  return MarkerPanel;
}(Component$2);

var Plugin = videojs.getPlugin('plugin'); // Default options for the plugin.

var defaults = {};
/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */

var MarkerPlugin = /*#__PURE__*/function (_Plugin) {
  _inheritsLoose(MarkerPlugin, _Plugin);

  /**
   * Create a MarkerPlugin plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  function MarkerPlugin(player, options) {
    var _this;

    // the parent class will add player under this.player
    _this = _Plugin.call(this, player) || this;
    _this.options = videojs.mergeOptions(defaults, options);

    _this.player.addClass('vjs-marker-plugin');

    _this.updateOptions();

    return _this;
  }
  /**
   * create {@link MarkerBar} instance
   *
   * @return {MarkerBar} return a {@link MarkerBar} instance
   */


  var _proto = MarkerPlugin.prototype;

  _proto.createMarkerBar = function createMarkerBar() {
    this.markerBar = MarkerBar.build(this.player, {
      markers: this.options.markers
    });
    return this.markerBar;
  }
  /**
   * create {@link MarkerPanel} instance
   *
   * @return {MarkerPanel} return a {@link MarkerPanel} instance
   */
  ;

  _proto.createMarkersPanel = function createMarkersPanel() {
    this.markerPanel = MarkerPanel.build(this.player, {
      markers: this.options.markers
    });
    return this.markerPanel;
  };

  _proto.updateOptions = function updateOptions(options) {
    this.options = videojs.mergeOptions(this.options, options);
    if (this.markerBar) this.markerBar.dispose();
    if (this.markerPanel) this.markerPanel.dispose();

    if (!(this.options.panel === false)) {
      this.player.addChild(this.createMarkersPanel());
    }

    var container = this.player.getDescendant(['ControlBar', 'ProgressControl', 'SeekBar']);
    this.createMarkerBar();
    container.addChild(this.markerBar);
  };

  return MarkerPlugin;
}(Plugin); // Define default values for the plugin's `state` object here.


MarkerPlugin.defaultState = {}; // Include the version number.

MarkerPlugin.VERSION = version; // Register the plugin with video.js.

videojs.registerPlugin('markerPlugin', MarkerPlugin);

export default MarkerPlugin;
