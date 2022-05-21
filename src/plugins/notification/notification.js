import { Component, createPortal, html, renderWithElement } from '../../utils/csr';
import { VedaStore } from '../../utils/store';

const store = new VedaStore({
  logger: false,
});

export const STATE_NAME = '$coreNotification';
export const MARGIN_Y = 10;

store.create(STATE_NAME, {
  initialState: {
    'top-left': [],
    'top-right': [],
    'bottom-left': [],
    'bottom-right': [],
  },
});

class VedaNotificationItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: 0,
      y: 0,
      hover: false,
      closed: false,
      durationState: 0,
    };
    this.removeId = -1;
    this.removedId = -1;
    this.effectId = -1;
    this.containerRef = undefined;
  }

  componentDidMount() {
    if (!this.containerRef) {
      return;
    }
    const { onShow, duration } = this.props.data;
    const y = (this.containerRef.offsetHeight + MARGIN_Y) * -1;
    onShow();
    this.setState({
      y,
    });
    this.effectId = setTimeout(() => {
      this.setState({
        opacity: 1,
        y: 0,
        durationState: duration,
      });
    }, 0);
    this.removing();
  }

  componentDidUpdate(_, prevState) {
    const { hover, closed } = this.state;
    if (prevState.hover !== hover) {
      if (hover) {
        if (!closed) {
          this.cancelRemoving();
        }
      } else {
        this.removing();
      }
    }
    if (closed && prevState.closed !== closed) {
      this.removing(0);
    }
  }

  componentWillUnmount() {
    this.cleanup();
  }

  cancelRemoving = () => {
    clearTimeout(this.removeId);
    clearTimeout(this.removedId);
  };

  cleanup = () => {
    this.cancelRemoving();
    clearTimeout(this.effectId);
  };

  removeInStore = () => {
    const { id, placement, onHide } = this.props.data;
    store.set(STATE_NAME, state => {
      return {
        ...state,
        [placement]: state[placement].filter(item => {
          return item.id !== id;
        }),
      };
    });
    onHide();
  };

  removing = _delay => {
    if (!this.containerRef) {
      return;
    }
    const { delay, duration } = this.props.data;
    const y = (this.containerRef.offsetHeight + MARGIN_Y) * -1;
    this.removeId = setTimeout(
      () => {
        this.setState({
          opacity: 0,
          y,
        });
        this.removedId = setTimeout(() => {
          this.removeInStore();
        }, duration);
      },
      _delay !== undefined ? _delay : delay,
    );
  };

  handleMouseEnter = () => {
    this.setState({ hover: true });
  };

  handleMouseLeave = () => {
    this.setState({ hover: false });
  };

  handleClose = event => {
    event.preventDefault();
    this.setState({ closed: true });
  };

  renderClose = () => {
    const { closeButton } = this.props.data;

    if (!closeButton) {
      return html`<div class="veda-notification__close" onClick=${this.handleClose}>
        <i class="fal fa-times" />
      </div>`;
    }

    if (typeof closeButton === 'string') {
      return html` <div class="veda-notification__close" dangerouslySetInnerHTML=${{ __html: closeButton }} onClick=${this.handleClose}></div> `;
    }
    return html`<div class="veda-notification__close" onClick=${this.handleClose}>${closeButton}</div>`;
  };

  renderContent = () => {
    const { data } = this.props;
    if (typeof data.content === 'string') {
      return html`<div dangerouslySetInnerHTML=${{ __html: data.content }} />`;
    }
    return data.content;
  };

  render() {
    const { data } = this.props;
    const { y, opacity, hover, durationState } = this.state;
    return html`<div
      ref=${c => (this.containerRef = c)}
      class="veda-notification${!!data.className ? ` ${data.className}` : ``}"
      style=${{
        transition: `${durationState}ms`,
        opacity: opacity,
        maxWidth: '400px',
        ...(data.placement.includes('top-') ? { marginTop: y, marginBottom: MARGIN_Y } : { marginBottom: y, marginTop: MARGIN_Y }),
        ...data.style,
        zIndex: hover ? 9 : 1,
      }}
      onMouseEnter=${this.handleMouseEnter}
      onMouseLeave=${this.handleMouseLeave}
    >
      ${this.renderClose()} ${this.renderContent()}
    </div> `;
  }
}

class VedaNotificationView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: {
        'top-left': [],
        'top-right': [],
        'bottom-left': [],
        'bottom-right': [],
      },
    };
    store.subscribe(STATE_NAME, this.setMessage);
  }

  setMessage = state => {
    this.setState({
      notifications: state,
    });
  };

  renderMessage = item => {
    return html`<${VedaNotificationItem} key=${item.id} data=${item} />`;
  };

  renderContentWithPlacement = placement => {
    const { notifications } = this.state;
    return html` <div class="veda-notification-root--${placement}">${notifications[placement].map(this.renderMessage)}</div> `;
  };

  renderContent = () => {
    return html`
      ${this.renderContentWithPlacement('top-left')} ${this.renderContentWithPlacement('top-right')} ${this.renderContentWithPlacement('bottom-left')}
      ${this.renderContentWithPlacement('bottom-right')}
    `;
  };

  render() {
    return createPortal(this.renderContent(), document.body);
  }
}

class VedaNotificationAction {
  static defaultOptions = {
    duration: 300,
    delay: 2000,
    placement: 'top-left',
    className: '',
    style: {},
    onShow() {},
    onHide() {},
  };

  static id = 0;

  static initialized = false;

  _getOpts = options => {
    if (typeof options === 'string') {
      return {
        ...VedaNotificationAction.defaultOptions,
        content: options,
      };
    }
    return {
      ...VedaNotificationAction.defaultOptions,
      ...options,
    };
  };

  action = options => {
    const opts = {
      ...this._getOpts(options),
      id: VedaNotificationAction.id++,
    };
    if (!VedaNotificationAction.initialized) {
      renderWithElement(html`<${VedaNotificationView} />`, 'veda-notification-placeholder');
      VedaNotificationAction.initialized = true;
    }
    store.set(STATE_NAME, state => {
      return {
        ...state,
        [opts.placement]: [...(state[opts.placement] ?? []), opts],
      };
    });
  };
}

const notificationAction = new VedaNotificationAction();

export const notification = {
  push: notificationAction.action,
};
