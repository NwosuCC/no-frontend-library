const Spinner = (
  () => ({
    start: () => Dom.show('.overlay'),
    stop: () => Dom.hide('.overlay'),
  })
)();


// Perform pre-load actions
const initialize = () => {
  // 1.) Sets the spinner on the XHR component. Note that the Spinner component can still be used on its own
  XHR.setSpinner('start', 'stop', Spinner);

  // 2.) Render view template
  DomLoader.renderView();

  // 3.) Register route handlers
  Routes.handlers({
    'news.delete': (event) => {
      if (confirm(`Delete this record?`)) {
        // ToDo: update this to grab the actual record id
        API.news.delete(event.target.id);
      }
    }
  });

  // 3.) Sets a Default Image Url. Any broken image is replaced by this default image placeholder
  return XHR
    .get(Routes.api('image.default'))
    .then(({imageUrl}) => {
      REPO.set('defaultImageUrl', imageUrl);
    });
};


// Start Application
window.onload = () => {
  initialize()
    .then(() => {
      /*
      | This mimics [cloak] behaviour:
      |   - hides Api-Dom elements and shows placeholders if available
      |   - when their data are fully loaded, it toggles the display states of the elements affected
      */
      Dom.cloak(() => {
        // Fetches Ajax data and saves them in app Repo, then, loads the data into the Dom
        return API
          .route()
          .then(() => {
            // Iterates over Api-Dom elements (=> that expect to be populated with data) and loads in their data
            Dom
              .els('.api-dom')
              .forEach(element => {
                DomLoader.load(element);
              });
          });
      });
    });
};
