const Relay = require('react-relay/classic');

class MockStore {
  reset() {
    this.successResponse = undefined;
  }

  succeedWith(response) {
    this.reset();
    this.successResponse = response;
  }

  failWith(response) {
    this.reset();
    this.failureResponse = response;
  }

  update(callbacks) {
    if (this.successResponse) {
      callbacks.onSuccess(this.successResponse);
    } else if (this.failureResponse) {
      callbacks.onFailure(this.failureResponse);
    }
    this.reset();
  }

  commitUpdate(mutation, callbacks) {
    return this.update(callbacks);
  }

  applyUpdate(mutation, callbacks) {
    return this.update(callbacks);
  }
}

module.exports = {
  QL: Relay.QL,
  Mutation: Relay.Mutation,
  Route: Relay.Route,
  RootContainer: ({ renderFetched }) => renderFetched({}),
  createContainer: component => component,
  Store: new MockStore(),
};
