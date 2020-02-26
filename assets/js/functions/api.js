
// External API Data Retrieval component
const API = (() => {
  const _obj = {
    get: () => {
      Pagination.reset();
      let [main, ...sub] = Routes.segments();
      return _obj.news[main].call(undefined, sub);
    },
    post: (routeName, formData, isJson) => {
      let [main, ...sub] = Routes.segments(Routes.api(routeName, {}, true));
      return _obj.news[main].call(undefined, sub, formData, isJson);
    },
    news: {
      index: (...args) => {
        let [, formData, isJson] = args;
        if (Util.Object.isObject(formData)) {
          return XHR.post(Routes.api('news.index'), formData, isJson)
            .then(data => {
              return Routes.go(Routes.view('news.view', {id: data.id}))
            });
        } else {
          let {page, limit} = Pagination.set(Routes.query());
          let [routeName, bindings] = (page > 0 && limit > 0)
            ? ['news.index.pages', {page, limit}]
            : ['news.index', null];

          return XHR.get(Routes.api(routeName, bindings))
            .then(data => {
              // ToDo: revert to Storage and/or webDB
              REPO.set('news', data['items']);
              Pagination.set(data, 'news');
            });
        }
      },
      view: (subRoute) => {
        let [id, ...sub] = subRoute;
        return XHR.get(Routes.api('news.view', {id}))
          .then(data => {
            // ...
          });
      },
      // Made 'async' so Promise (.then()) is returned to the caller
      create: async () => {
        // ...
      },
    },
  };

  // Exposed API Methods
  let { get, post } = _obj;
  return { get, post };
})();
