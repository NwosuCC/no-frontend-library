
const Routes = (() => {
  const _obj = {
    routes: {
      // News
      "news.index": {
        uri: '/news', params: []
      },
      "news.index.pages": {
        uri: '/news?page=:page&limit=:limit', params: ['page', 'limit']
      },
      "news.create": {
        uri: '/news?r=create', params: []
      },
      "news.store": {
        uri: '/news', params: []
      },
      "news.view": {
        uri: '/news?r=view/:id', params: ['id']
      },
      "news.update": {
        uri: '/news?r=view/:id', params: ['id']
      },
      "news.delete": {
        uri: '/news?r=view/:id', params: ['id']
      },

      // Images
      "news.images.index": {
        uri: '/news?r=view/:id/images', params: ['id']
      },
      "news.images.store": {
        uri: '/news?r=view/:id/images', params: ['id']
      },
      "news.images.delete": {
        uri: '/news?r=view/:newsId/images/:id', params: ['newsId', 'id']
      },

      // Comments
      "news.comments.index": {
        uri: '/news?r=view/:newsId/comments', params: ['newsId']
      },
      "news.comments.store": {
        uri: '/news?r=view/:newsId/comments', params: ['newsId']
      },
      "news.comments.update": {
        uri: '/news?r=view/:newsId/comments/:id', params: ['newsId', 'id']
      },
      "news.comments.delete": {
        uri: '/news?r=view/:newsId/comments/:id', params: ['newsId', 'id']
      },
    },
    baseUrl: window.location.href.split('/news', 1).shift(),
    bindValues: (route, bindings) => {
      let url = (() => route.uri)();
      if (bindings && typeof bindings === 'object') {
        route.params.forEach(param => {
          if (bindings.hasOwnProperty(param)) {
            url = url.replace(new RegExp(`:${param}`, 'gi'), bindings[param]);
          }
        });
      }
      return url;
    },
    path: (routeKey, bindings) => {
      routeKey = Util.String.trimAllSpaces(routeKey);
      if (_obj.routes.hasOwnProperty(routeKey)) {
        return _obj.bindValues(_obj.routes[routeKey], bindings);
      }
    },
    url: (routeKey, bindings) => {
      return _obj.baseUrl + _obj.path(routeKey, bindings);
    },
  };

  // Public API
  let { path, url } = _obj;
  return { path, url };
})();

