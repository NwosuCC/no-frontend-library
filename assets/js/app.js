
const Spinner = (
  () => ({
    start: () => Dom.show('.overlay'),
    stop: () => Dom.hide('.overlay'),
  })
)();


const Dom = (() => {
  const _obj = {
    show: (selector) => {
      let element = _obj.el(selector);
      if (element) {
        element.classList.remove('d-none');
      }
      return _obj;
    },
    hide: (selector) => {
      let element = _obj.isValidElement(selector) ? selector : _obj.el(selector);
      if (element) {
        element.classList.add('d-none');
      }
      return _obj;
    },
    el: (selector, parent) => {
      parent = _obj.elOrDocument(parent);
      if (_obj.isValidElement(parent)) {
        return parent.querySelector(selector);
      }
    },
    els: (selector, parent) => {
      parent = _obj.elOrDocument(parent);
      if (_obj.isValidElement(parent)) {
        return parent.querySelectorAll(selector);
      }
      return [];
    },
    elOrDocument: (element) => {
      return (typeof element !== 'undefined') ? element : document;
    },
    isValidElement: (element) => {
      element = Util.Object.getOrDefault(element, {});
      return typeof element.querySelector === 'function' || typeof element.querySelectorAll === 'function';
    },
    getAttribute: (element, attributeName) => {
      if (_obj.isValidElement(element)) {
        return Util.Object.getOrDefault(element.getAttribute(attributeName), '').trim();
      }
      return '';
    },
  };

  // Public API
  let { show, hide, el, els, getAttribute } = _obj;
  return { show, hide, el, els, getAttribute };
})();


// Sample API Data
const API = (() => {
  return {
    news: (() => ([
      {
        id: 1,
        title: 'Why EQ matters at work',
        body: 'EQ is the ability to leverage and control one’s emotions while navigating relationships and stressful situations. Having a high EQ means a person uses good judgment and empathy in equal measure',
        author: "Mr. Eddy Brad",
        avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/scott_riley/128.jpg",
      },
      {
        id: 2,
        title: 'CSS breakpoints',
        body: 'For the next minute or so, I want you to forget about CSS. Forget about web development. Forget about digital user interfaces. And as you forget these things, I want you to allow your mind to wander.',
        author: "Mr. Eddy Brad",
        avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/scott_riley/128.jpg",
      },
      {
        id: 3,
        title: 'Simple start to Serverless',
        body: "So how do I get those files up there on the internet? I use Netlify! I've LOVED Netlify for years. It's bonkers how quickly I can get a site up and running (with HTTPS) with Netlify and it's integration with GitHub is unmatched. I love it.",
        author: "Mr. Eddy Brad",
        avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/scott_riley/128.jpg",
      }
    ]))(),
  }
})();


window.onload = () => {
  Spinner.start();
  setTimeout(() => Spinner.stop(), 1500);

  // Hides Api-Dom elements and shows placeholders
  // When their data are fully loaded, it toggles the display states
  Dom.show('.x-show').hide('.x-hide');


  // Save Ajax response data in App Repo
  // ToDo: revert to Storage and webDB
  GLOBAL_VAR.set('data', API);

  // Api-Dom elements: elements that expect to be populated with data
  // const apiDomEls = Dom.els('.api-dom');

  // Iterate over all Api-Dom elements
  Dom.els('.api-dom').forEach(element => {

    // Grab the row element that represents each row of data
    let dataRow = Dom.el('.data-row', element);
    let dataItem = Dom.getAttribute(dataRow, 'data-item');
    let dataKeys = Dom.getAttribute(dataRow, 'data-keys').split(',');

    // Fetch retrieved data
    const ApiData = GLOBAL_VAR.get(dataItem);

    // Interpolate data into html
    ApiData.forEach(row => {
      let dataRowClone = dataRow.cloneNode(true);
      let dataColumns = Dom.els('[data-key]', dataRowClone);

      // Iterates through the row data and populates the column elements
      dataColumns.forEach(dataColumn => {
        let dataKey = Dom.getAttribute(dataColumn, 'data-key');
        if (dataKeys.indexOf(dataKey) >= 0) {
          dataColumn.textContent = row[dataKey];
        }
      });

      // Iterates through the row links and updates them with the actual urls
      let dataLinks = Dom.els('a[data-link]', dataRowClone);
      dataLinks.forEach(dataLink => {
        let routeName = Dom.getAttribute(dataLink, 'data-link');
        dataLink.href = Routes.url(routeName, row);
      });

      dataRow.parentNode.appendChild(dataRowClone);
    });

    Dom.hide(dataRow);
  });

};
