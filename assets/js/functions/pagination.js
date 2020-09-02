
const Pagination = (() => {
  const _obj = {
    el: null,
    total: null,
    page: null,
    limit: null,
    allowedLimits: [2, 5, 10, 20, 50, 100],
    reset: () => {
      _obj.el = null;
      _obj.total = null;
      _obj.page = null;
      _obj.limit = null;
    },
    get: () => {
      let {total, page, limit} = _obj;
      let pages = Math.floor(total / limit) + ((total % limit === 0) ? 0 : 1);
      let counts = {
        from: ((page - 1) * limit) + 1,
        to: Math.min(page * limit, total),
        of: total
      };
      if (Util.Object.isFalsy(pages) || counts.from > counts.of) {
        counts = {from: 0, to: 0, of: 0};
      }
      return {total, page, limit, pages, counts};
    },
    set: (parameters, item) => {
      let {total, page, limit} = parameters;
      [page, limit, total] = [page, limit, total].map(value => Util.String.asNumber(value));

      _obj.total = total;
      _obj.page = (page > 0) ? page : 1;
      if (_obj.allowedLimits.indexOf(limit) >= 0) {
        _obj.limit = limit;
      } else {
        _obj.limit = Util.String.asNumber(Routes.query().limit || 10);
      }
      if (typeof item !== 'undefined') {
        _obj.loadLinks(item);
      }
      return _obj;
    },
    disableLinkAsNonRequired: (linkElement, key, page, pages) => {
      switch (true) {
        case [linkElement, key, pages].some(item => Util.Object.isFalsy(item)):
          return true;
        case (page === 1 || page === pages) && _obj.arrowButtonIsNotRequired(linkElement, key, pages):
          return true;
      }
      return false;
    },
    arrowButtonIsNotRequired: (linkElement, key, pages) => {
      let firstAndPrevNotRequired = _obj.page === 1 && ['first','prev'].indexOf(key) >= 0;
      let lastAndNextNotRequired = _obj.page === pages && ['last','next'].indexOf(key) >= 0;
      return firstAndPrevNotRequired || lastAndNextNotRequired;
    },
    getArrowButtonPage: (linkElement, page, pages) => {
      switch (linkElement.textContent) {
        case '<<': return 1;
        case '<': return Math.max(1, page - 1);
        case '>': return Math.min(page + 1, pages);
        case '>>': return pages;
      }
    },
    loadLinks: (item) => {
      _obj.el = Dom.getElement(`[data-pagination="${item}"]`);
      if (!_obj.el) {
        return;
      }
      _obj.el.innerHTML = _obj.html();
      let {page, limit, pages, counts} = _obj.get();

      // Set current page items summary
      Dom.getElements('[data-pg-count]', _obj.el).forEach(countElement => {
        let key = Dom.getAttribute(countElement, 'data-pg-count');
        Dom.setText(countElement, Util.Object.getOrDefault(counts[key], 0));
        countElement.removeAttribute('data-pg-count');
      });

      // Set pages links
      let activeLinkSet = false;
      Dom.getElements('[data-pg-link]', _obj.el).forEach(linkElement => {
        let key = Dom.getAttribute(linkElement, 'data-pg-link').substr(6);
        linkElement.removeAttribute('data-pg-link');
        if (_obj.disableLinkAsNonRequired(linkElement, key, page, pages)) {
          Dom.addClass(linkElement, 'disabled');
          return;
        }
        let newPage = Util.String.asNumber(linkElement.textContent);
        if (!activeLinkSet && page === newPage) {
          Dom.addClass(linkElement, 'active');
          activeLinkSet = true;
        }
        if (newPage === 0) {
          newPage = _obj.getArrowButtonPage(linkElement, page, pages)
        }
        Dom.setAttribute(linkElement, 'href', Routes.paginated({page: newPage, limit}))
      });

      // Set Pagination-specific event handlers (e.g 'Per page' <select> 'onchange' event)
      Dom.getElements('[data-pg-handler]', _obj.el).forEach(handlerElement => {
        Dom.setEventHandler(
          handlerElement, 'data-pg-handler', (key) => _obj[key]
        );
        handlerElement.removeAttribute('data-pg-handler');
      });
    },
    // Handler assigned to 'Per page' <select> 'onchange' event. See '<select>' in '_obj.html()' below
    // Redirects to the new URL computed from the updated pagination params
    pageLimitChanged: (event) => {
      let newLimit = Util.String.asNumber(event.target.value);
      Routes.go(Routes.paginated({page: _obj.page, limit: newLimit}));
    },
    // Populates 'Per page' Select <option> elements
    getPgPerPageOptionsHtml: () => {
      const html = (num, selected) => {
        let selectedAttr = selected ? 'selected="selected"' : '';
        return `<option value="${num}" ${selectedAttr}>${num}</option>`
      };
      let pgOptions = '';
      _obj.allowedLimits.forEach(limit => {
        pgOptions = pgOptions + html(limit, limit === _obj.limit);
      });
      return pgOptions;
    },
    // Populates Pages numbered links
    getPgNumberedLinksHtml: () => {
      const html = (num) => `<a class="pagination-item" data-pg-link="items.num">${num}</a>`;
      let {page, pages} = _obj.get();
      let maxPage = Math.min(page + 5, pages);
      let minPage = Math.max(1, pages - 5);
      let numLinks = '';
      for (let p = minPage; p <= maxPage; p++) {
        numLinks = numLinks + html(p);
      }
      return numLinks;
    },
    html: () => {
      let el = `<div class="pagination-meta">
                  <div class="pagination-limit">
                    <label for="pg-per-page" class="label-inline" style="font-size: 15px;">Per Page: </label>
                    <!-- On <select> change, call event handler Pagination:pageLimitChanged() -->
                    <select id="pg-per-page" class="b b-g" data-pg-handler="change:pageLimitChanged">
                      {pgOptions}
                    </select>
                  </div>
                  <div class="pagination-summary">
                    <span class="pg-count" data-pg-count="from">1</span>
                    - <span class="pg-count" data-pg-count="to">1</span>
                    of <span class="pg-count" data-pg-count="of">1</span>
                    items
                  </div>
                </div>
                <div class="pagination">
                  <a class="pagination-item" data-pg-link="items.first"><<</a>
                  <a class="pagination-item" data-pg-link="items.prev"><</a>
                  {numLinks}
                  <a class="pagination-item" data-pg-link="items.next">></a>
                  <a class="pagination-item" data-pg-link="items.last">>></a>
                </div>`;

      return el
        .replace('{pgOptions}', _obj.getPgPerPageOptionsHtml())
        .replace('{numLinks}', _obj.getPgNumberedLinksHtml());
    },
  };

  let { reset, set, get } = _obj;
  return { reset, set, get };
})();
