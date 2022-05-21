import { objectParse } from "../../utils/objectParse";
import { getData, subscribe, toggleCompare, togglePopup } from "./store";
export class VedaProductCompareActions {
  static defaultProps = {
    renderProduct: undefined,
    keyExtractor: (_, index) => index,
    header: {
      title: "Сompare",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing",
    },
    content: ["Product","Rating","Description","Availability","Product Type","SKU","Size","Color","Option"],
  }
  constructor() {
    this.defaultProps = { ...VedaProductCompareActions.defaultProps };
    const comparePopup = document.querySelector(".veda-compare__popup");
    const dataCompareOption = comparePopup.getAttribute("data-options");
    this.set(objectParse(dataCompareOption));
  }
  toggleProduct(product) {
    toggleCompare(product);
  }
  set = props => {
    this.defaultProps = { ...this.defaultProps, ...props };
  };
  togglePopop() {
    togglePopup(this.defaultProps);
  }
  getData() {
    return getData();
  }
  subscribe(listener) {
    return subscribe(listener);
  }
}
