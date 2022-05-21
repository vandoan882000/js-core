import { Component, html, render } from "htm/preact";
import { createRootElement } from "./createRootElement";
import { store } from "./store";

export { Component, html, render };
export { createPortal, PureComponent, Fragment } from "preact/compat";

export const renderWithElement = (tree, className) => {
  const element = createRootElement(className);
  return render(tree, element);
};

export function withStore(subscribers) {
  return (Comp) => {
    return class extends Component {
      constructor(props) {
        super(props);
        this.subscribers =
          typeof subscribers === "string" ? [subscribers] : subscribers;
        this.state = store.get();
        // this.state = Object.entries(store.get()).reduce((acc, [key, value]) => {
        //   return {
        //     ...acc,
        //     ...(this.subscribers.includes(key) ? { [key]: value } : {}),
        //   };
        // }, {});
        this.unsubscribes = [];
        this.subscribe();
      }

      subscribe() {
        this.unsubscribes = this.subscribers.map((subscriber) => {
          const unsubscribe = store.subscribe(subscriber, (state) => {
            this.setState((prevState) => ({
              ...prevState,
              [subscriber]: state,
            }));
          });
          return unsubscribe;
        });
      }

      componentWillUnmount() {
        this.unsubscribes.forEach((unsubscribe) => unsubscribe());
      }

      render() {
        return html`<${Comp}
          ...${this.props}
          actions=${{
            create: store.create,
            set: store.set,
          }}
          store=${this.state}
        />`;
      }
    };
  };
}
