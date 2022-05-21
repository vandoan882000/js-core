import { Component, createPortal, html, renderWithElement } from '../../utils/csr';
import { VedaStore } from '../../utils/store';

const store = new VedaStore({
  logger: false,
});

export const STATE_NAME = '$coreMessage';
export const MARGIN_BOTTOM = 4;

store.create(STATE_NAME, { initialState: [] });

class VedaMessageItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: 0,
      top: 0,
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
    const { delay, id, duration, onShow, onHide } = this.props.message;
    const top = (this.containerRef.offsetHeight + MARGIN_BOTTOM) * -1;
    onShow();
    this.setState({
      top,
    });
    this.effectId = setTimeout(() => {
      this.setState({
        opacity: 1,
        top: 0,
        durationState: duration,
      });
    }, 0);
    this.removeId = setTimeout(() => {
      this.setState({
        opacity: 0,
        top,
      });
      this.removedId = setTimeout(() => {
        store.set(STATE_NAME, state => {
          return state.filter(item => item.id !== id);
        });
        onHide();
      }, duration);
    }, delay);
  }

  componentWillUnmount() {
    clearTimeout(this.removeId);
    clearTimeout(this.removedId);
    clearTimeout(this.effectId);
  }

  renderIcon() {
    const { message } = this.props;
    if (message.icon) {
      return html`<span class="veda-message__icon" dangerouslySetInnerHTML=${{ __html: message.icon }} />`;
    }
    switch (message.type) {
      case 'info':
        return html`<span class="veda-message__icon"><i class="fas fa-info-circle" /></span>`;
      case 'success':
        return html`<span class="veda-message__icon"><i class="fas fa-check-circle" /></span>`;
      case 'warning':
        return html`<span class="veda-message__icon"><i class="fas fa-exclamation-triangle" /></span>`;
      case 'error':
        return html`<span class="veda-message__icon"><i class="fas fa-times-circle" /></span>`;
      default:
        return html``;
    }
  }

  render() {
    const { message } = this.props;
    const { top, opacity, durationState } = this.state;
    return html`<div
      ref=${c => (this.containerRef = c)}
      class="veda-message veda-message--${message.type}${!!message.className ? ` ${message.className}` : ``}"
      style=${{
        transition: `${durationState}ms`,
        opacity: opacity,
        marginTop: top,
        marginBottom: MARGIN_BOTTOM,
        ...message.style,
      }}
    >
      ${this.renderIcon()} ${message.content}
    </div> `;
  }
}

class VedaMessageView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };
    store.subscribe(STATE_NAME, this.setMessage);
  }

  setMessage = state => {
    this.setState({
      messages: state,
    });
  };

  renderMessage = item => {
    return html`<${VedaMessageItem} key=${item.id} message=${item} />`;
  };

  renderContent = () => {
    const { messages } = this.state;
    return html` <div class="veda-message-root">${messages.map(this.renderMessage)}</div> `;
  };

  render() {
    return createPortal(this.renderContent(), document.body);
  }
}

class VedaMessageAction {
  static defaultOptions = {
    duration: 300,
    delay: 2000,
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
        ...VedaMessageAction.defaultOptions,
        content: options,
      };
    }
    return {
      ...VedaMessageAction.defaultOptions,
      ...options,
    };
  };

  action = (type, options) => {
    const opts = {
      ...this._getOpts(options),
      type,
      id: VedaMessageAction.id++,
    };
    if (!VedaMessageAction.initialized) {
      renderWithElement(html`<${VedaMessageView} />`, 'veda-message-placeholder');
      VedaMessageAction.initialized = true;
    }
    store.set(STATE_NAME, state => [...state, opts]);
  };
}

const messageAction = new VedaMessageAction();

export const message = {
  info: options => {
    messageAction.action('info', options);
  },
  success: options => {
    messageAction.action('success', options);
  },
  error: options => {
    messageAction.action('error', options);
  },
  warning: options => {
    messageAction.action('warning', options);
  },
};
