import videojs from 'video.js';

const Component = videojs.getComponent('Component');
const TimeTooltip = videojs.getComponent('TimeTooltip');

/**
 * use by {@link MarkerPoint}, defined content when mouse over {@link MarkerPoint}.
 */
class MarkerPointTip extends Component {

  /**
   * generate a {@link MarkerPoint} instance
   *
   * @param {Player} player videojs instance
   * @param {Object} options options
   * @param {number} options.offset offset form zero of video. unit(second)
   * @param {Object} options.data content of `options.type`
   */
  constructor(player, options) {
    super(player, options);

    this.options = options;

    this.timeToltip = new TimeTooltip(player);
    this.timeToltip.hide();

    this.addChild(this.timeToltip);
    this.addClass('vjs-marker-point-tip');

    this.timeToltip.el_.innerHTML = `
      <p class="vjs-marker-point-tip-time">${videojs.formatTime(this.options.offset, 600)}</p>
      <p class="vjs-marker-point-tip-content">${this.options.data.content}</p>
    `;
  }

  /**
   * refresh tip position
   * call this when init or window resize.
   */
  updatePosition() {
    this.timeToltip.el_.style.left = `-${this.timeToltip.el_.getBoundingClientRect().width / 2}px`;
  }
}

/**
 * {@link MarkerPoint} is point displayed in the {@link MarkerBar}
 */
class MarkerPoint extends Component {

  /**
   * generate a {@link MarkerPoint} instance
   *
   * @param {Player} player videojs player instance
   * @param {Object} options options
   * @param {number} options.offset offset form zero of video. unit(second)
   * @param {string} options.type when mouse hover the {@link MarkerPoint}, the type of information displayed
   * @param {Object} options.data content of `options.type`
   */
  constructor(player, options) {
    super(player, options);

    this.offset = options.offset;
    this.type = options.type;
    this.data = options.data;

    this.tip = new MarkerPointTip(player, {
      data: this.data,
      offset: this.offset
    });
    this.mouseDisplay = player.getDescendant(['ControlBar', 'ProgressControl', 'SeekBar', 'MouseTimeDisplay']);

    this.addChild(this.tip);
    this.enableTouchActivity();
    this.on('mouseenter', (ev) => {
      this.mouseDisplay.hide();
      this.tip.timeToltip.show();
      this.tip.updatePosition();
    });
    this.on('mouseleave', (ev) => {
      this.mouseDisplay.show();
      this.tip.timeToltip.hide();
    });
  }

  /**
   * create dom element
   *
   * @return {*} dom
   */
  createEl() {
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
  updatePosition(duration) {
    this.el_.style.left = (this.offset / duration * 100) + '%';
  }
}

export {
  MarkerPoint,
  MarkerPointTip
};
