
const Dom = (() => {
  const _obj = {
    cloaked: false,
    cloakClass: 'd-cloak',
    // Returns true if element has a [tag | id | className] that equals selector (case-insensitive)
    is: (element, selector) => {
      selector = Util.String.lowerCase(selector);
      return Util.String.lowerCase(element.tagName) === selector
        || Util.String.lowerCase(_obj.getAttribute(element, 'id')) === selector
        || _obj.hasClass(element, selector);
    },
    // A HTML element is deemed valid if it has the 'querySelector' function
    isValidElement: (element) => {
      let elements = Array.isArray(element) ? element : [element];
      return elements.every(el => {
        el = Util.Object.getOrDefault(el, {});
        return typeof el.querySelector === 'function' || typeof el.querySelectorAll === 'function';
      });
    },
    // Displays a hidden DOM element
    show: (selector) => {
      _obj.removeClass(_obj.elsIfSelector(selector), 'd-none');
      return _obj;
    },
    // Hides a DOM element
    hide: (selector) => {
      _obj.addClass(_obj.elsIfSelector(selector), 'd-none');
      return _obj;
    },
    // `returns true if the current element being loaded is "cloaked" (temporarily hidden)
    isCloaked: () => _obj.cloaked,
    /*
     | This mimics [cloak] behaviour:
     |   - hides Api-Dom elements and shows placeholders if available
     |   - when their data are fully loaded, it toggles the display states of the elements affected
     */
    cloak: async (callback) => {
      // ToDo: create and prepend <style> element for '.d-cloak' css
      _obj.cloaked = true;
      await callback.call();
      _obj.removeClass(_obj.els(`.${_obj.cloakClass}`), _obj.cloakClass);
      _obj.cloaked = false;
    },
    // Selects the root 'document' as the default  element if no element is supplied in a function call
    elOrDocument: (element) => {
      return (typeof element !== 'undefined') ? element : document;
    },
    // Gets one DOM element (children of the parent if specified) by its selector
    el: (selector, parent) => {
      parent = _obj.elOrDocument(parent);
      if (_obj.isValidElement(parent)) {
        return parent.querySelector(selector);
      }
    },
    // Returns true if the elementGroup is a NodeList or an Array
    isIterable: (elementGroup) => {
      return elementGroup instanceof NodeList || Array.isArray(elementGroup);
    },
    // Gets multiple DOM elements (children of the parent if specified) by their common selector.
    // Returns a NodeList object
    els: (selector, parent) => {
      parent = _obj.elOrDocument(parent);
      if (_obj.isValidElement(parent)) {
        return parent.querySelectorAll(selector);
      }
      return [];
    },
    // 'elsIfSelector' can be any of: 'css selector', 'single element', 'iterable elementGroup'
    // Always returns an iterable elementGroup, for data-type alignment with other methods that will operate on them
    elsIfSelector: (elsOrSelector) => {
      if (typeof elsOrSelector === 'string') {
        return _obj.els(elsOrSelector);
      }
      return _obj.isIterable(elsOrSelector) ? elsOrSelector : [elsOrSelector];
    },
    // Sets an attribute on a valid element
    setAttribute: (element, attributeName, value) => {
      if (_obj.isValidElement(element)) {
        element.setAttribute(attributeName, value.toString());
      }
      return _obj;
    },
    // Gets a specified attribute from a valid element.
    // For data-type consistency, returns an empty string if element is not valid or attribute is not found
    getAttribute: (element, attributeName) => {
      if (_obj.isValidElement(element)) {
        return Util.Object.getOrDefault(element.getAttribute(attributeName), '').trim();
      }
      return '';
    },
    // Adds/removes a specified className to/from the supplied elementGroup
    modifyClassList: (action, element, className) => {
      if (['add', 'remove'].indexOf(action) < 0) {
        throw new Error(`Cannot perform action '${action}' on element classList`);
      }
      let elementGroup = _obj.isIterable(element) ? element : [element];
      elementGroup.forEach(el => {
        if (_obj.isValidElement(el)) {
          el.classList[action](className);
        }
      });
      return _obj;
    },
    // Adds a className to an element
    addClass: (element, className) => {
      return _obj.modifyClassList('add', element, className);
    },
    // Removes a className from an element
    removeClass: (element, className) => {
      return _obj.modifyClassList('remove', element, className);
    },
    // Returns true if the element has the supplied className
    hasClass: (element, className) => {
      if (_obj.isIterable(element)) {
        element = element[0];
      }
      return _obj.isValidElement(element) && element.classList.contains(Util.String.lowerCase(className));
    },
    // Sets the text on an element
    setText: (element, text) => {
      if (_obj.isValidElement(element)) {
        element.textContent = text;
      }
      return _obj;
    },
    // Returns the direct parent of a valid element
    getParent: (element) => {
      return _obj.isValidElement(element) ? element.parentNode : null;
    },
    // Returns the first ancestor of the element, that matches the specified selector
    getParentsUntil: (element, selector) => {
      let endSearch = false;
      while (!endSearch) {
        element = _obj.getParent(element);
        endSearch = !element || _obj.is(element, selector);
      }
      return element;
    },
    normalizeEventName: (eventName) => {
      eventName = String(eventName);
      if (eventName.substr(0,2) !== 'on') {
        eventName = `on${eventName}`;
      }
      return eventName;
    },
    setEventHandler: (handlerElement, attributeName, setterCallback) => {
      let [event, handlerName] = Dom.getAttribute(handlerElement, attributeName).split(':');
      let eventGroup = Util.String.trimAllSpaces(event).split(',');
      eventGroup.forEach(event => {
        event = Dom.normalizeEventName(event);
        handlerElement[event] = setterCallback.call(undefined, handlerName);
      });
    }
  };

  // Public API
  let {
    is, show, hide, cloak, isCloaked, el, els, setAttribute, getAttribute, addClass, removeClass,
    setText, getParent, getParentsUntil, normalizeEventName, setEventHandler
  } = _obj;

  return {
    is, show, hide, cloak, isCloaked, el, els, setAttribute, getAttribute, addClass, removeClass,
    setText, getParent, getParentsUntil, normalizeEventName, setEventHandler
  };
})();


const DomLoader = (() => {
  const _obj = {
    element: null,
    rowElement: null,
    rowEmptyElement: null,
    repoKey: null,
    repoItems: null,
    repoModelProps: null,
    isLoading: false,
    // Returns true if an object is fully loaded into the DOM
    isLoaded: () => !_obj.isLoading,
    // Sets the element to load into the DOM
    init: (element) => {
      _obj.element = element;
      return _obj;
    },
    extractRowData: () => {
      // Sets the row element that represents one row of data
      _obj.rowElement = Dom.el('.data-row', _obj.element);

      // Sets (then, hides) the 'empty' row element displayed if returned data contains no items
      _obj.rowEmptyElement = Dom.el('.data-row-empty', _obj.element);
      Dom.hide(_obj.rowEmptyElement);

      // Attaches retrieved API data saved in the app Repo into this DomLoader component
      _obj.repoKey = Dom.getAttribute(_obj.rowElement, 'data-item');
      _obj.repoItems = REPO.get(_obj.repoKey);
      _obj.repoModelProps = Dom.getAttribute(_obj.rowElement, 'data-keys').split(',');

      return _obj;
    },
    // A broken image is replaced by a default image placeholder. This adds the handler to any created IMG element
    addImageErrorHandler: (columnElement) => {
      let defaultImageUrl = REPO.get('defaultImageUrl');
      // ToDo: validate 'defaultImageUrl' as URL
      if (defaultImageUrl) {
        columnElement.onerror = (event) => {
          if (Dom.is(event.target, 'IMG')) {
            event.target.src = defaultImageUrl;
          }
        };
      }
    },
    // Iterates through the row data and populates the column elements (elements having [data-key] attribute)
    updateColumnsData: (repoRecord, rowClone) => {
      Dom
        .els('[data-key]', rowClone)
        .forEach(columnElement => {
          let modelProp = Dom.getAttribute(columnElement, 'data-key');

          // Skips the current iteration if property [modelProp] is not in the list of allowed properties
          if (_obj.repoModelProps.indexOf(modelProp) < 0) {
            return;
          }
          // Sets the [src] and [onerror] attributes for IMG element OR <>textContent</> for other elements
          if (Dom.is(columnElement, 'IMG')) {
            _obj.addImageErrorHandler(columnElement);
            columnElement.src = repoRecord[modelProp];
          } else {
            columnElement.textContent = repoRecord[modelProp];
          }
          // Removes template attributes to leave a clean HTML markup
          columnElement.removeAttribute('data-key');
        });
      return _obj;
    },
    // Iterates through the row links (<a> elements having [data-link] attribute) and updates their [href]
    updateLinks: (repoRecord, rowClone) => {
      Dom
        .els('a[data-link]', rowClone)
        .forEach(aLinkElement => {
          let routeName = Dom.getAttribute(aLinkElement, 'data-link');
          aLinkElement.href = Routes.view(routeName, repoRecord);
          aLinkElement.removeAttribute('data-key');
        });
      return _obj;
    },
    // Iterates through the elements having [data-handler] attribute and updates their specified event
    updateHandlers: (rowClone) => {
      Dom
        .els('[data-handler]', rowClone)
        .forEach(handlerElement => {
          Dom.setEventHandler(
            handlerElement, 'data-handler', (routeName) => Routes.handler(routeName)
          );
          if (Dom.is(handlerElement, 'a')) {
            handlerElement.removeAttribute('href');
          }
          handlerElement.removeAttribute('data-handler');
        });
      return _obj;
    },
    // Returns true if the current row element is a table row (table > tbody > tr)
    rowElementIsTR: () => {
      return Dom.is(_obj.rowElement, 'TR');
    },
    // Customises and sets an 'empty-row' element when returned API data contains no items
    // ToDo: expose API to customise the 'text', 'css', 'colspan', etc via {options}
    cloneEmptyElementIfTableRow: (rowEmptyElement) => {
      if (_obj.rowElementIsTR()) {
        let td = rowEmptyElement.children[0];
        // Calculates the 'td colspan' from the number of 'td' elements in the 'data-row' element
        Dom.setAttribute(td, 'colspan', _obj.rowElement.children.length);

        // Styles the empty 'td' element
        Dom.addClass(td, 'text-center').addClass(td, 'text-center');

        // Sets the text and adds the 'td' element to the DOM
        Dom.setText(td,'No results found');
        rowEmptyElement.innerHTML = '';
        rowEmptyElement.appendChild(td);
      }
    },
    // Cleans-up a new row element and adds it to the DOM
    appendRow: (rowClone) => {
      // Removes template 'data-' attributes to leave a clean HTML markup
      rowClone.removeAttribute('data-item');
      rowClone.removeAttribute('data-keys');

      // Removes default classes that make an element hidden, so the new element can be displayed
      Dom.removeClass(rowClone,'data-row');
      if (Dom.isCloaked()) {
        Dom.removeClass(rowClone,'d-cloak').addClass(rowClone,'d-cloaked');
      }

      // Appends new row element to the parent
      _obj.rowElement.parentNode.appendChild(rowClone);
    },
    // Inserts retrieved API data into their proper positions designated by template 'data-' attributes
    interpolate: () => {
      if (Util.Object.isEmpty(_obj.repoItems)) {
        // A.) [repoItems] contains no items => show the 'empty-row' element if available
        let dataRowEmptyClone = _obj.rowEmptyElement ? _obj.rowEmptyElement.cloneNode(true) : null;
        // If 'empty-row' element is not provided and the parent is a table TR, insert an empty table row
        if (!dataRowEmptyClone && _obj.rowElementIsTR()) {
          dataRowEmptyClone = _obj.rowElement.cloneNode(true);
        }
        // Add the 'empty-row' element to the DOM. If the element is a table 'TR', customise it further
        if (dataRowEmptyClone) {
          _obj.appendRow(dataRowEmptyClone);
          _obj.cloneEmptyElementIfTableRow(dataRowEmptyClone);
          Dom.show(dataRowEmptyClone);
        }

      } else {
        // B.) [repoItems] contains items => iterate through the items, inserting one row element for each item
        _obj.repoItems.forEach(repoItem => {
          let dataRowClone = _obj.rowElement.cloneNode(true);
          _obj
            .updateColumnsData(repoItem, dataRowClone)
            .updateLinks(repoItem, dataRowClone)
            .updateHandlers(dataRowClone)
            .appendRow(dataRowClone);
        });
      }
      return _obj;
    },
    // Loads the retrieved API data into the DOM
    load: (element) => {
      _obj.isLoading = true;
      _obj
        .init(element)
        .extractRowData()
        .interpolate();

      Dom.hide(_obj.rowElement);
      _obj.isLoading = false;
    },
    getViewPath: () => {
      let viewKey = Routes.baseSegment();
      return `views/news-${viewKey}.html`;
    },
    renderView: (viewPath) => {
      if (typeof viewPath === 'undefined') {
        viewPath = _obj.getViewPath();
      }
      fetch(viewPath)
        .then(response => response.text())
        .then(data => {
          Dom.el('[data-app]').innerHTML = data;
        })
        .catch(error => {
          // if () {
          //   console.log('view error: ', error);
          // }
        });
    },
  };

  let { renderView, load, isLoaded } = _obj;
  return { renderView, load, isLoaded };
})();
