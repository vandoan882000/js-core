import { Component } from "preact";
import { html } from "htm/preact";
export class OverlayCompare extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { onClick } = this.props;
    return html`
      <div class="veda-compare__overlay" onClick=${onClick}></div>
    `
  }
}
