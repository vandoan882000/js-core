import { Component } from "preact";
import { html } from "htm/preact";
export class CloseButton extends Component {
  constructor(props) {
    super(props);

  }
  render() {
    const { onClick, size, style } = this.props;
    return html`
      <button class="veda-compare__btn-close" style="${style};width:${size}px;height:${size}px" onClick=${onClick}>
        <i class="fal fa-times"></i>
      </button>
    `
  }
}
