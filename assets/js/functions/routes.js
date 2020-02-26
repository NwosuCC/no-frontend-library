
const Routes = (() => {
  const _obj = {
    routes: {
      // Generic
      "image.default": {
        uri: '?r=image-default', params: []
      },

      // News
      "news.index": {
        uri: '?r=index', params: [], view: 'news-index'
      },
      "news.index.pages": {
        uri: '?r=index&page=:page&limit=:limit', params: ['page', 'limit'], view: 'news-index'
      },
      "news.create": {
        uri: '?r=create', params: [], view: 'news-create'
      },
      "news.store": {
        uri: '?r=index', params: []
      },
      "news.view": {
        uri: '?r=view/:id', params: ['id'], view: 'news-view'
      },
      "news.update": {
        uri: '?r=view/:id', params: ['id']
      },
      "news.delete": {
        uri: '?r=view/:id', params: ['id']
      },

      // Images
      "news.images.index": {
        uri: '?r=view/:id/images', params: ['id']
      },
      "news.images.store": {
        uri: '?r=view/:id/images', params: ['id']
      },
      "news.images.delete": {
        uri: '?r=view/:newsId/images/:id', params: ['newsId', 'id']
      },

      // Comments
      "news.comments.index": {
        uri: '?r=view/:newsId/comments', params: ['newsId']
      },
      "news.comments.store": {
        uri: '?r=view/:newsId/comments', params: ['newsId']
      },
      "news.comments.update": {
        uri: '?r=view/:newsId/comments/:id', params: ['newsId', 'id']
      },
      "news.comments.delete": {
        uri: '?r=view/:newsId/comments/:id', params: ['newsId', 'id']
      },
    },

    baseUrl: () => window.location.href.split('/news', 1).shift(),

    string: (route) => String(route).replace('?', ''),

    parts: (route) => {
      let partsObj = {};
      _obj.string(route).split('&').forEach(part => {
        let [key, value] = part.split('=');
        partsObj[key] = value;
      });
      return partsObj;
    },
    routeOrCurrent: (route) => {
      if (typeof route === 'undefined') {
        route = window.location.search;
      }
      return _obj.parts(route);
    },
    path: (route) => _obj.routeOrCurrent(route)['r'],

    query: (route) => {
      let parts = _obj.routeOrCurrent(route);
      delete parts['r'];
      return parts;
    },
    buildRoute: (query) => {
      let newRoute = '', currentQuery = _obj.query();
      for (let key in query) {
        if (query.hasOwnProperty(key)) {
          newRoute = newRoute + `&${key}=${query[key]}`;
        } else if (currentQuery.hasOwnProperty(key)) {
          newRoute = newRoute + `&${key}=${currentQuery[key]}`;
        }
      }
      return '?r=' + _obj.path() + newRoute;
    },
    segments: (route) => _obj.path(route).split('/'),

    baseSegment: (route) => _obj.segments(route).shift(),

    bindValues: (route, bindings) => {
      let url = (() => route.uri)();
      if (Util.Object.isObject(bindings)) {
        route.params.forEach(param => {
          if (bindings.hasOwnProperty(param)) {
            url = url.replace(new RegExp(`:${param}`, 'gi'), bindings[param]);
          }
        });
      }
      return url;
    },
    normalizeRoute: (routeName) => {
      routeName = Util.String.trimAllSpaces(routeName);
      if (!_obj.routes.hasOwnProperty(routeName)) {
        throw new Error(`Route named ${routeName} not found`);
      }
      return routeName;
    },
    realPath: (routeName, bindings) => {
      routeName = _obj.normalizeRoute(routeName);
      return _obj.bindValues(_obj.routes[routeName], bindings);
    },
    prefixRoot(path) {
      path = String(path);
      if (path.substr(0,1) !== '/') {
        path = '/' + path;
      }
      let prefix = '/news';
      if (path.substr(0, prefix.length) !== prefix) {
        path = prefix + path;
      }
      return path;
    },

    url: (path) => _obj.baseUrl() + _obj.prefixRoot(path),

    go: (path) => {
      window.location.href = _obj.url(path).replace('/news/', '/news/index.html');
    },
    api: (routeName, bindings, short) => {
      let realPath = _obj.realPath(routeName, bindings, short);
      return short === true ? realPath : _obj.url(realPath);
    },

    view: (routeName, bindings) => _obj.realPath(routeName, bindings),

    // Returns a new route URL built from the supplied pagination parameters
    paginated: ({page, limit}) => _obj.buildRoute({page, limit}),

    // Returns the event handler for the named route; sets same if param 'handler' is supplied
    handler: (routeName, handler) => {
      routeName = _obj.normalizeRoute(routeName);
      if (typeof handler === 'function') {
        _obj.routes[routeName].handler = handler;
      } else {
        handler = _obj.routes[routeName].handler || null;
      }
      return handler;
    },
    // Sets handlers in bulk
    handlers: (handlers) => {
      for (let routeName in handlers) {
        if (handlers.hasOwnProperty(routeName)) {
          _obj.handler(routeName, handlers[routeName]);
        }
      }
    },
  };

  // Public API
  let {
    go, view, api, handler, handlers, segments, baseSegment, path, query, paginated
  } = _obj;

  return {
    go, view, api, handler, handlers, segments, baseSegment, path, query, paginated
  };
})();

