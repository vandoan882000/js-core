import { Component } from "preact";
import { html } from "htm/preact";
import { ProductItem } from "../ProductItem/ProductItem";
import { toggleCompare } from "../../store";
import { RatingItem } from "../RatingItem/RatingItem";
export class ProductCard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { id, featured_image, vendor, title, price, available, type, variants, options_with_values, options, content} = this.props;
    let index = 0;
    return html`
      <div class="veda-compare__product-content">
        ${content.map(item => {
          if( item === "Product") {
            return html`<${ProductItem} id=${index++} onClick=${() => toggleCompare(id)} image=${featured_image} vendor=${vendor} title=${title} price=${price}  />`;
          } else if( item === "Rating") {
            return html`<${RatingItem} id=${index++} />`;
          } else if( item === "Description") {
            return html`<div class="veda-compare__product-content-item" data-id=${index++}>Jeans are the go-to pants for going places, and these jeans know you\'re going by bike. Made with performance materials for comfort, reflective side seams for visibility, and a water-resistant finish</div>`
          } else if( item === "Availability") {
            return html`<div class="veda-compare__product-content-item" data-id=${index++}>${available?"In Stock":"Out of Stock"}</div>`;
          } else if( item === "Product Type") {
            return html`<div class="veda-compare__product-content-item" data-id=${index++}>${type}</div>`;
          } else if( item === "SKU") {
            return html`<div class="veda-compare__product-content-item" data-id=${index++}>${variants[0].sku}</div>`
          } else if( item === "Size") {
            return html`<div class="veda-compare__product-content-item" data-id=${index++}>${options_with_values[0]?.values.join(", ")}</div>`;
          } else if( item === "Color") {
            return html`<div class="veda-compare__product-content-item" data-id=${index++}>${options_with_values[1]?.values.join(", ")}</div>`;
          } else if( item === "Option") {
            return html`<div class="veda-compare__product-content-item" data-id=${index++}>${options.join(", ")}</div>`;
          } else {
            return html`<div class="veda-compare__product-content-item" data-id=${index++}>_</div>`;
          }
        })}
      </div>
      `
  }
}
