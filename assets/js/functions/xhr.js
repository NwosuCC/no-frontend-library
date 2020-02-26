
const XHR = (() => {
  // Spinner component adapted to suit the XHR
  const Spinner = (() => {
    const _spn = {
      isValid: false,
      start: null,
      stop: null,
      set: (startMethodName, stopMethodName, spinner) => {
        let [ctl, start, stop] = [spinner, startMethodName, stopMethodName];

        _spn.isValid = typeof ctl === 'object' && typeof ctl[start] === 'function' && typeof ctl[stop] === 'function';
        _spn.start = _spn.isValid ? ctl[start] : null;
        _spn.stop = _spn.isValid ? ctl[stop] : null;
      },
      toggleState: (state) => {
        if (_spn.isValid) {
          state === true ? _spn.start.call() : _spn.stop.call();
        }
      },
    };

    // Exposed API
    let { set, toggleState } = _spn;
    return { set, toggleState };
  })();

  const _obj = {
    spinner: Spinner,
    get: (routeString) => {
      _obj.spinner.toggleState(true);
      return _obj.handleResponse(
        fetch(routeString)
      );
    },
    post: (routeString, formData, isJson) => {
      _obj.spinner.toggleState(true);
      let payload = {
        method: 'POST', body: formData
      };
      if (isJson === true) {
        payload.headers = {
          'Content-Type': 'application/json'
        };
        payload.body = JSON.stringify(payload.body);
      }
      return _obj.handleResponse(
        fetch(routeString, payload)
      );
    },
    checkStatus: (response) => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    },
    handleResponse: (fetchPromise) => {
      return fetchPromise
        .then(_obj.checkStatus)
        .then(response => {
          _obj.spinner.toggleState(false);
          return response.json();
        })
        // Extract and return the data
        .then(({data}) => data)
        // Or catch any errors
        .catch(error => {
          _obj.spinner.toggleState(false);
          console.log('Request error', error);
        });
    },
  };

  // Exposed API
  return {
    get: _obj.get,
    post: _obj.post,
    setSpinner: _obj.spinner.set
  };
})();


