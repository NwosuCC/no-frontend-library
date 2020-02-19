
const REPO = (function () {
  // Example Repo contents below (change to suit your need)
  // let Repo = {
  //   news: [],
  //   images: [],
  //   comments: [],
  // };

  let Repo = {};

  const _obj = {
    set: (prop, value) => {
      switch (true) {
        case (prop === 'data'):
          {
            Repo = value;
          }
          break;
        case (!Util.Object.isFalsy(prop)):
          {
            Repo[prop] = value;
          }
          break;
      }
    },
    append: (prop, value) => {
      _obj.validateProp(prop);
      Repo[prop].push(value);
    },
    update: (prop, value, index) => {
      _obj.validateProp(prop);
      Repo[prop][index] = value;
    },
    get: (prop) => {
      try {
        return typeof prop === 'undefined' ? Repo : Repo[prop];
      } catch (error) {
        return null;
      }
    },
    validateProp: (prop) => {
      if (!Array.isArray(Repo[prop])) {
        throw new Error(`${prop} is not Array`);
      }
    }
  };

  let { set, append, update, get } = _obj;
  return { set, append, update, get };
})();
