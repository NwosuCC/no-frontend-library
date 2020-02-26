
const Form = (() => {
  const _obj = {
    formElement: null,
    formInputIds: [],
    formData: null,
    asJson: false,
    init: (formId, {texts, files}) => {
      _obj.formElement = Dom.el(`form#${formId}`);
      _obj.formInputIds = {texts, files};
      _obj.formData = _obj.asJson === true ? {} : new FormData();
    },
    setValue: (id, value) => {
      if (_obj.asJson === true) {
        _obj.formData[id] = value;
      } else {
        _obj.formData.append(id, value);
      }
    },
    extractData: () => {
      // ToDo: validate form and post
      _obj.formInputIds.texts.forEach(id => {
        _obj.setValue(id, Dom.el(`#${id}`, _obj.formElement).value)
      });
      _obj.formInputIds.files.forEach(id => {
        _obj.setValue(id, Dom.el(`#${id}`, _obj.formElement).files[0]);
      });
      return _obj;
    },
    extract: (formId, {texts, files}) => {
      _obj.init(formId, {texts, files});
      return _obj.extractData().formData;
    },
    extractJson: (formId, {texts, files}) => {
      _obj.asJson = true;
      return _obj.extract(formId, {texts, files});
    },
  };

  let {extract, extractJson} = _obj;
  return {extract, extractJson};
})();
