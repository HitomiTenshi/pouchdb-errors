import inherits from 'inherits';

inherits(PouchError, Error);

function PouchError(status, error, reason) {
  Error.call(this, reason);
  this.status = status;
  this.name = error;
  this.message = reason;
  this.error = true;
}

PouchError.prototype.toString = function () {
  return JSON.stringify({
    status: this.status,
    name: this.name,
    message: this.message,
    reason: this.reason
  });
};

var UNAUTHORIZED = new PouchError(401, 'unauthorized', "Name or password is incorrect.");
var MISSING_BULK_DOCS = new PouchError(400, 'bad_request', "Missing JSON list of 'docs'");
var MISSING_DOC = new PouchError(404, 'not_found', 'missing');
var REV_CONFLICT = new PouchError(409, 'conflict', 'Document update conflict');
var INVALID_ID = new PouchError(400, 'bad_request', '_id field must contain a string');
var MISSING_ID = new PouchError(412, 'missing_id', '_id is required for puts');
var RESERVED_ID = new PouchError(400, 'bad_request', 'Only reserved document ids may start with underscore.');
var NOT_OPEN = new PouchError(412, 'precondition_failed', 'Database not open');
var UNKNOWN_ERROR = new PouchError(500, 'unknown_error', 'Database encountered an unknown error');
var BAD_ARG = new PouchError(500, 'badarg', 'Some query argument is invalid');
var INVALID_REQUEST = new PouchError(400, 'invalid_request', 'Request was invalid');
var QUERY_PARSE_ERROR = new PouchError(400, 'query_parse_error', 'Some query parameter is invalid');
var DOC_VALIDATION = new PouchError(500, 'doc_validation', 'Bad special document member');
var BAD_REQUEST = new PouchError(400, 'bad_request', 'Something wrong with the request');
var NOT_AN_OBJECT = new PouchError(400, 'bad_request', 'Document must be a JSON object');
var DB_MISSING = new PouchError(404, 'not_found', 'Database not found');
var IDB_ERROR = new PouchError(500, 'indexed_db_went_bad', 'unknown');
var WSQ_ERROR = new PouchError(500, 'web_sql_went_bad', 'unknown');
var LDB_ERROR = new PouchError(500, 'levelDB_went_went_bad', 'unknown');
var FORBIDDEN = new PouchError(403, 'forbidden', 'Forbidden by design doc validate_doc_update function');
var INVALID_REV = new PouchError(400, 'bad_request', 'Invalid rev format');
var FILE_EXISTS = new PouchError(412, 'file_exists', 'The database could not be created, the file already exists.');
var MISSING_STUB = new PouchError(412, 'missing_stub', 'A pre-existing attachment stub wasn\'t found');
var INVALID_URL = new PouchError(413, 'invalid_url', 'Provided URL is invalid');

function createError(error, reason) {
  function CustomPouchError(reason) {
    // inherit error properties from our parent error manually
    // so as to allow proper JSON parsing.
    /* jshint ignore:start */
    for (var p in error) {
      if (typeof error[p] !== 'function') {
        this[p] = error[p];
      }
    }
    /* jshint ignore:end */
    if (reason !== undefined) {
      this.reason = reason;
    }
  }
  CustomPouchError.prototype = PouchError.prototype;
  return new CustomPouchError(reason);
}

function generateErrorFromResponse(err) {

  if (typeof err !== 'object') {
    var data = err;
    err = UNKNOWN_ERROR;
    err.data = data;
  }

  if ('error' in err && err.error === 'conflict') {
    err.name = 'conflict';
    err.status = 409;
  }

  if (!('name' in err)) {
    err.name = err.error || 'unknown';
  }

  if (!('status' in err)) {
    err.status = 500;
  }

  if (!('message' in err)) {
    err.message = err.message || err.reason;
  }

  return err;
}

export { UNAUTHORIZED, MISSING_BULK_DOCS, MISSING_DOC, REV_CONFLICT, INVALID_ID, MISSING_ID, RESERVED_ID, NOT_OPEN, UNKNOWN_ERROR, BAD_ARG, INVALID_REQUEST, QUERY_PARSE_ERROR, DOC_VALIDATION, BAD_REQUEST, NOT_AN_OBJECT, DB_MISSING, WSQ_ERROR, LDB_ERROR, FORBIDDEN, INVALID_REV, FILE_EXISTS, MISSING_STUB, IDB_ERROR, INVALID_URL, createError, generateErrorFromResponse };
