import { Component } from "preact";
import { html } from "htm/preact";
export class ProductTable extends Component {
  constructor(props) {
    super(props);

  }
  render() {
    const  { children } = this.props;
    return html`
      <div class="veda-compare__table">
        ${children}
      </div>
    `
  }
}
