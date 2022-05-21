import { Component } from "preact";
import { html } from "htm/preact";
export class HeaderProductTable extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { content } = this.props;
    return html`
    <div class="veda-compare__table-header">
      ${content.map((item,index) => html`<div class="veda-compare__table-header-title" data-id="${index}">${item}</div>`)}
    </div>
    `
  }
}
