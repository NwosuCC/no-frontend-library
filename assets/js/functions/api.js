
// External API Data Retrieval component
const API = (() => {
  const _obj = {
    route: () => {
      Pagination.reset();
      let [main, ...sub] = Routes.segments();
      return _obj.news[main].call(undefined, sub);
    },
    news: {
      index: () => {
        let {page, limit} = Pagination.set(Routes.query());
        let [routeName, bindings] = (page > 0 && limit > 0)
          ? ['news.index.pages', {page, limit}]
          : ['news.index', null];

        return XHR.get(Routes.api(routeName, bindings)).then(data => {
          // ToDo: revert to Storage and/or webDB
          REPO.set('news', data['items']);
          Pagination.set(data, 'news');
        });
      },
      view: (subRoute) => {
        let [id, ...sub] = subRoute;
        return XHR
          .get(Routes.api('news.view', {id}))
          .then(data => {
            // ...
          });
      },
      create: () => {
        return XHR
          .get(Routes.api('news.create'))
          .then(data => {
            // ...
          });
      },
    },
  };

  // Exposed API Methods
  let { route } = _obj;
  return { route };
})();
