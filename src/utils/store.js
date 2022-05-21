import { storage } from './storage';

export class VedaStore {
  constructor(options = {}) {
    this._store = {};
    this._listeners = {};
    this._storageRegisters = {};
    this._options = {
      logger: options.logger || false,
    };
  }

  static logger(prevStore, nextStore, stateName, actionName, nextState) {
    const date = new Date();
    const hour = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const space =
      actionName.length < 10
        ? Array(10 - actionName.length)
            .fill(' ')
            .join('')
        : '';
    console.group(`%c VedaStore: ${stateName}`, 'color: #614eff', `@${hour}`);
    console.log('%c Prev Store ', 'color: #999; font-weight: 600', prevStore);
    console.log(`%c ${actionName}  ${space}`, 'color: #44b0e2; font-weight: 600', nextState);
    console.log('%c Next Store ', 'color: #7ac143; font-weight: 600', nextStore);
    console.groupEnd();
  }

  _handleListeners = stateName => {
    if (!!this._listeners[stateName]) {
      this._listeners[stateName].forEach(listener => {
        listener(this._store[stateName]);
      });
    }
  };

  _getState = (stateName, initialState) => {
    const stateStr = storage.getItem(stateName);
    if (stateStr !== undefined && this._storageRegisters[stateName]) {
      return JSON.parse(storage.getItem(stateName));
    }
    return initialState;
  };

  _setStorage = (stateName, state) => {
    if (!!stateName && state !== undefined && this._storageRegisters[stateName]) {
      const stateStr = JSON.stringify(state);
      storage.setItem(stateName, stateStr);
    }
  };

  _set = (stateName, nextState) => {
    const { logger } = this._options;
    const prevStore = { ...this._store };
    this._store[stateName] = nextState;
    this._setStorage(stateName, nextState);
    this._handleListeners(stateName);
    if (logger) {
      return actionName => {
        VedaStore.logger(prevStore, this._store, stateName, actionName, nextState);
      };
    }
    return () => {};
  };

  get = stateName => {
    if (stateName) {
      return this._store[stateName];
    }
    return this._store;
  };

  create = (stateName, { initialState, useStorage = false }) => {
    if (!this._store[stateName]) {
      this._storageRegisters[stateName] = useStorage;
      this._store[stateName] = this._getState(stateName, initialState);
      if (!this._getState(stateName, initialState)) {
        this._setStorage(stateName, initialState);
      }
      if (!useStorage) {
        storage.removeItem(stateName);
      }
      this._handleListeners(stateName);
    }
  };

  set = (stateName, state) => {
    if (typeof state === 'function') {
      const prevState = this._store[stateName];
      return this._set(stateName, state(prevState));
    }
    return this._set(stateName, state);
  };

  subscribe = (stateName, listener) => {
    this._listeners[stateName] = this._listeners[stateName] || [];
    this._listeners[stateName].push(listener);

    return () => {
      this._listeners[stateName] = this._listeners[stateName].filter(listen => listen !== listener);
    };
  };
}

export const store = new VedaStore({
  logger: window.builderMode || false,
});
