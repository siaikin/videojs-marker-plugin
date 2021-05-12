import videojs from 'video.js';
import {MarkerPoint} from './markerPoint';

const Component = videojs.getComponent('Component');

/**
 * Only the slider of the marker is displayed
 */
class MarkerBar extends Component {

  /**
   * generate a {@link MarkerBar} instance
   *
   * @param {Player} player videojs player instance
   * @param {Object} options
   *                 options.markers
   * @return {MarkerBar} return a {@link MarkerBar} instance
   */
  static build(player, options) {
    if (!(options.markers instanceof Array)) {
      options.markers = [];
    }

    const markers = [];

    for (let i = options.markers.length; i--;) {
      markers.push(new MarkerPoint(player, options.markers[i]));
    }

    return new MarkerBar(player, {markers, barName: 'markerPoint'});
  }

  /**
   * same as {@link MarkerBar.build}, but not have options check.
   *
   * @param {Player} player {@link MarkerBar.build}
   * @param {Object} options {@link MarkerBar.build}
   */
  constructor(player, options) {
    super(player, options);

    options.markers.forEach((marker) => this.addChild(marker));

    const onLoadedMetaData = () => {
      const duration = player.duration();

      options.markers.forEach((marker) => {
        marker.updatePosition(duration);
      });
      player.off('loadedmetadata', onLoadedMetaData);
    };

    player.on('loadedmetadata', onLoadedMetaData);
  }

  /**
   * create dom element
   *
   * @return {*} dom
   */
  createEl() {
    return videojs.dom.createEl('div', {
      className: 'vjs-marker-bar'
    });
  }
}

videojs.registerComponent('MarkerBar', MarkerBar);

export {
  MarkerBar
};
