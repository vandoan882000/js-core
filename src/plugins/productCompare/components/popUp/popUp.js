import { Component } from "preact";
import { html } from "htm/preact";
import { HeaderCompare } from "../HeaderCompare/HeaderCompare";
import { togglePopup, subscribeVisible } from "../../store";
import { HeaderProductTable } from "../HeaderProductTable/HeaderProductTable";
import { CloseButton } from "../CloseButton/CloseButton";
import { OverlayCompare } from "../OverlayCompare/OverlayCompare";
import { ContentProductTable } from "../ContentProductTable/ContentProductTable";
import { ProductTable } from "../ProductTable/ProductTable";
export class PopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    }
    this.unsubscribeVisible = undefined;
  }

  componentDidMount() {
    this.unsubscribeVisible = subscribeVisible(( visible ) => {
      this.setState({ visible });
    });
    this.setHeight();
  }

  componentWillUnmount() {
    this.unsubscribeVisible?.();
  }
  componentDidUpdate() {
    this.setHeight();
  }
  setHeight() {
    const { visible } = this.state;
    const { content } = this.props.defaultProps;
    if (!!visible ) {
      const table = document.querySelector('.veda-compare__table');
      for( let i = 0; i < content.length; i++ ) {
        const items = table.querySelectorAll(`[data-id="${i}"]`);
        let maxHeight = 0;
        items.forEach(item => {
          if (item.offsetHeight > maxHeight) {
            maxHeight = item.offsetHeight;
          }
        })
        items.forEach(item => {
          item.style.height = maxHeight + "px";
        })
      }
    }
  }
  render() {
    const { visible } = this.state;
    const { renderProduct, keyExtractor, content, header } = this.props.defaultProps;
    const { defaultProps } = this.props;
    if (!visible) {
      return html``;
    }
    return html`
    <div class="veda-compare__container">
      <${OverlayCompare} onClick=${() => togglePopup(defaultProps)} />
      <div class="veda-compare__wrapper">
        <div class="veda-compare__content veda-scrollbar">
          <${HeaderCompare} header=${header}/>
          <${ProductTable}>
            <${HeaderProductTable} content=${content} />
            <${ContentProductTable} renderProduct=${renderProduct} keyExtractor=${keyExtractor} content=${content}/>
          </${ProductTable}>
        </div>
        <${CloseButton} size="30" onClick=${() => togglePopup(defaultProps)} style="position:absolute;top:-15px;right:-15px;"/>
      </div>
    </div>
    `
  }
}
