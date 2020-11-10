class PropertyError {
  constructor(name, message) {
    Error.call(this, message);

    this.name = name;
    this.message = message;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PropertyError);
    } else {
      this.stack = (new Error()).stack;
    }
  }
}

module.exports = PropertyError;
