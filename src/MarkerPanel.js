import videojs from 'video.js';

const Component = videojs.getComponent('Component');

/**
 * a marker point list displayed on right of video DOM.
 */
class MarkerPanel extends Component {

  /**
   * generate a {@link MarkerPanel} instance
   *
   * @param {Player} player videojs player instance
   * @param {Object} options
   *                 options.markers
   * @return {MarkerPanel} return a {@link MarkerPanel} instance
   */
  static build(player, options) {
    if (!(options.markers instanceof Array)) {
      options.markers = [];
    }

    return new MarkerPanel(player, {markers: options.markers});
  }

  /**
   * same as {@link MarkerPanel.build}, but not have options check.
   *
   * @param {Player} player {@link MarkerBar.build}
   * @param {Object} options {@link MarkerBar.build}
   */
  constructor(player, options) {
    super(player, options);

    const markerItemList = [];
    const len = options.markers.length;

    for (let i = 0; i < len; i++) {
      const markerOption = options.markers[i];

      markerItemList.push(this.createMarkerItem(markerOption.offset, markerOption.data));
    }

    this.markerList = videojs.dom.createEl('div', {className: 'vjs-markers-panel-list'}, {}, markerItemList);

    this.el_.appendChild(videojs.dom.createEl('div', {className: 'vjs-markers-panel-title'}, {}, '打点记录'));
    this.el_.appendChild(videojs.dom.createEl('div', {className: 'vjs-markers-panel-subtitle'}, {}, '点击快速跳转至视频打点处'));
    this.el_.appendChild(this.markerList);
  }

  /**
   * create dom element
   *
   * @return {*} dom
   */
  createEl() {
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
  createMarkerItem(offset, data) {
    const timeDOM = videojs.dom.createEl('div', {className: 'vjs-markers-panel-item-time'}, {'data-offset': offset}, videojs.formatTime(offset, 600));
    const contentDOM = videojs.dom.createEl('div', {className: 'vjs-markers-panel-item-content'}, {'data-offset': offset}, data.content);
    const itemDOM = videojs.dom.createEl(
      'div',
      {className: 'vjs-markers-panel-list-item'},
      {'data-offset': offset},
      [timeDOM, contentDOM]
    );

    itemDOM.addEventListener('click', (ev) => {
      const dom = ev.target;

      this.player_.currentTime(dom.dataset.offset);
    }, false);

    return itemDOM;
  }
}

export {
  MarkerPanel
};
