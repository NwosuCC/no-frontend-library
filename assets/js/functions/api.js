
// External API Data Retrieval component
const API = (() => {
  const _obj = {
    get: () => {
      Pagination.reset();
      let [main, ...sub] = Routes.segments();
      return _obj.news[main].call(undefined, sub);
    },
    post: (routeName, formData, isJson) => {
      let [main, ...sub] = Routes.segments(Routes.api(routeName, formData, true));
      console.log('routeName', routeName, 'formData', formData, 'main', main, 'sub', sub);
      return _obj.news[main].call(undefined, sub, formData, isJson);
    },
    news: {
      index: () => {
        let bindings = Pagination.set(Routes.query());
        console.log('api.news.index bindings', bindings);
        return XHR.get(Routes.api('news.index', bindings))
          .then(data => {
            // ToDo: revert to Storage and/or webDB
            REPO.set('news', data['items']);
            Pagination.set(data, 'news');
          });
      },
      view: (subRoute) => {
        let [id, ...sub] = subRoute;
        return XHR.get(Routes.api('news.view', {id}))
          .then(data => {
            console.log('api.news.view', data);
            // ...
          });
      },
      // Made 'async' so Promise (.then()) is returned to the caller
      create: async (formData, isJson) => {
        // ...
      },
      store: (...args) => {
        let [, formData, isJson] = args;
        return XHR.post(Routes.api('news.store'), formData, isJson)
          .then(data => {
            return Routes.go(Routes.view('news.view', {id: data.id}))
          });
      },
      delete: (subRoute) => {
        let [id, ...sub] = subRoute;
        console.log('id', id, 'sub', sub);
        return XHR.post(Routes.api('news.delete', {id}), {id}, true)
          .then(data => {
            console.log('api.news.delete', data);
            // ...
          });
      },
    },
  };

  // Exposed API Methods
  let { get, post } = _obj;
  return { get, post };
})();
