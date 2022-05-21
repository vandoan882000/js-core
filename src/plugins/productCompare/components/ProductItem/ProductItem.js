import { Component } from "preact";
import { html } from "htm/preact";
import { CloseButton } from "../CloseButton/CloseButton";
export class ProductItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { onClick, image, vendor, title, price, id } = this.props;
    return html`
    <div class="veda-compare__product-content-item" data-id="${id}">
      <div class="veda-compare-product-card">
        <div class="veda-compare-product-card__img">
          <div class="veda-compare-product-card__image">
            <a href="#" class="veda-image-cover">
              <img src="${ image.src}" alt="${title}">
            </a>
          </div>
          <div class="veda-compare-product-card__status">
            <${CloseButton} size="36" onClick=${ () => onClick() } />
          </div>
        </div>
        <div class="veda-compare-product-card__content">
          <div class="veda-compare-product-card__brand">${vendor}</div>
          <a class="veda-compare-product-card__name" href="#">${title}</a>
          <a class="veda-compare-product-card__price" href="#">
            <ins class="veda-compare-product-card__cost">$${ price }.00</ins>
          </a>
        </div>
      </div>
    </div>
    </div>
    `
  }
}
