import videojs from 'video.js';
import {MarkerBar} from './markerBar';
import {version as VERSION} from '../package.json';
import {MarkerPanel} from './MarkerPanel';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {};

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class MarkerPlugin extends Plugin {

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
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player);

    this.options = videojs.mergeOptions(defaults, options);

    this.player.addClass('vjs-marker-plugin');

    if (!(this.options.panel === false)) {
      this.player.addChild(this.createMarkersPanel());
    }

    const container = player.getDescendant(['ControlBar', 'ProgressControl', 'SeekBar']);
    const markerBar = this.createMarkerBar();

    container.addChild(markerBar);
  }

  /**
   * create {@link MarkerBar} instance
   *
   * @return {MarkerBar} return a {@link MarkerBar} instance
   */
  createMarkerBar() {
    return MarkerBar.build(this.player, {
      markers: this.options.markers
    });
  }

  /**
   * create {@link MarkerPanel} instance
   *
   * @return {MarkerPanel} return a {@link MarkerPanel} instance
   */
  createMarkersPanel() {
    return MarkerPanel.build(this.player, {
      markers: this.options.markers
    });
  }
}

// Define default values for the plugin's `state` object here.
MarkerPlugin.defaultState = {};

// Include the version number.
MarkerPlugin.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('markerPlugin', MarkerPlugin);

export default MarkerPlugin;
