
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
      return _obj.handleResponse(fetch(routeString));
    },
    handleResponse: (fetchPromise) => {
      return fetchPromise
        .then(response => {
          _obj.spinner.toggleState(false);
          return response.json();
        })
        // Extract and return the data
        .then(({data}) => data)
        // Or catch any errors
        .catch(error => {
          _obj.spinner.toggleState(false);
          console.log('error: ', error);
        });
    },
  };

  // Exposed API
  return {
    get: _obj.get,
    setSpinner: _obj.spinner.set
  };
})();


