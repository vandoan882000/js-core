import { Component, Fragment } from "preact";
import { html } from "htm/preact";
import { getData, subscribe } from "../../store";
import { ProductCard } from "../productCard/productCard";
export class ContentProductTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      products: [...getData()],
    }
    this.unsubscribe = undefined;
  }

  componentDidMount() {
    this.unsubscribe = subscribe(( products ) => {
      this.setState({ products });
    });
  }

  componentWillUnmount() {
    this.unsubscribe?.();
  }
  renderProduct = (product, index) => {
    const { renderProduct, keyExtractor, content } = this.props;
    if (!!renderProduct) {
      return html`
        <${Fragment} key=${keyExtractor(product, index)}>
          ${renderProduct(product, index)}
        </${Fragment}>
      `;
    }
    return html`<${ProductCard} key=${product.id} ...${product} content=${content}/>`;
  }
  render() {
    const { products } = this.state;
    return html`
      <div class="veda-compare__items-container">
        <div class="veda-compare__items">
          ${products.map((product, index) => this.renderProduct(product, index))}
        </div>
      </div>
    `
  }
}
