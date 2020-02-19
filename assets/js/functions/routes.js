
const Routes = (() => {
  const _obj = {
    routes: {
      // Generic
      "image.default": {
        uri: '?r=image-default', params: []
      },

      // News
      "news.index": {
        uri: '?r=index', params: []
      },
      "news.index.pages": {
        uri: '?page=:page&limit=:limit', params: ['page', 'limit']
      },
      "news.create": {
        uri: '?r=create', params: []
      },
      "news.store": {
        uri: '?r=index', params: []
      },
      "news.view": {
        uri: '?r=view/:id', params: ['id']
      },
      "news.update": {
        uri: '?r=view/:id', params: ['id']
      },
      "news.delete": {
        uri: '?r=view/:id', params: ['id']
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
    prefixRoot(path) {
      if (path.substr(0,1) !== '/') {
        path = '/' + path;
      }
      if (path.substr(0,5) !== '/news') {
        path = '/news' + path;
      }
      return path;
    },
    url: (path) => {
      path = String(path);
      return _obj.baseUrl + _obj.prefixRoot(path);
    },
    path: (routeName, bindings, short) => {
      routeName = Util.String.trimAllSpaces(routeName);
      if (!_obj.routes.hasOwnProperty(routeName)) {
        throw new Error(`Route named ${routeName} not found`);
      }
      let path = _obj.bindValues(_obj.routes[routeName], bindings);
      return short === true ? path : _obj.url(path);
    },
  };

  // Public API
  let { path, url } = _obj;
  return { path, url };
})();

