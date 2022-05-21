import { Component } from "preact";
import { html } from "htm/preact";
export class RatingItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { id } = this.props;
    return html`
      <div class="veda-compare__product-content-item" data-id="${id}">
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
      </div>
    `
  }
}
