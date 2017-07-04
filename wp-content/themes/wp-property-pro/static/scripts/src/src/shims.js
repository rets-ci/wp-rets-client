let values = require('object.values');

function shims() {
  // Object.values is not supported in Safari
  if (!Object.values) {
    values.shim();
  }
}

export default shims;