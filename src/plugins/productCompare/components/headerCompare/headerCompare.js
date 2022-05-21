import { Component } from "preact";
import { html } from "htm/preact";
export class HeaderCompare extends Component {
  constructor(props) {
    super(props);

  }
  render() {
    const { title, description } = this.props.header;
    return html`
    <div class="veda-compare__header">
      <h2 class="veda-compare__header-title">${title}</h2>
      <div class="veda-compare__header-text">${description}</div>
    </div>
    `
  }
}
