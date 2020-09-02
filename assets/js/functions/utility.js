const Util = (() => ({
  Object: (function () {
    const validateParam = (value) => {
      if (!_obj.isObject(value)) {
        throw new Error('Supplied param is not a valid object');
      }
    };
    const _obj = {
      getOrDefault(value, defaultValue = "") {
        return _obj.isFalsy(value) ? defaultValue : value;
      },
      isFalsy(value) {
        const Empties = ['undefined', 'null', 'NaN', 'false', '0', ''];
        // NOTE: String([]) === '', String(<a href=""></a>) === ""
        return value === null || (typeof value !== 'object' && Empties.includes(String(value).trim()));
      },
      isObject(value) {
        return !_obj.isFalsy(value) && isNaN(value.length);
      },
      isEmpty(value) {
        if (_obj.isObject(value)) {
          return Object.keys(value).length === 0;
        }
        if (Array.isArray(value)) {
          return value.length === 0;
        }
        return true;
      },
      flip(value) {
        validateParam(value);
        return Object.entries(value).reduce((all, [key, value]) => ({ ...all, [value]: key }), {});
      },
      subset(object, keys) {
        validateParam(object);
        let entriesSubset = Object.entries(object).filter(([key]) => keys.indexOf(key) >= 0);
        return Object.fromEntries(entriesSubset);
      },
    };
    return _obj
  })(),

  String: (function () {
    const _obj = {
      upperCase(string) {
        return String(string).toUpperCase();
      },
      lowerCase(string) {
        return String(string).toLowerCase();
      },
      titleCase(string) {
        if (Util.Object.isFalsy(string)) {
          return '';
        }
        let newWords = [];
        let words = _obj.String.lowerCase(string).split(" ");
        words.forEach((word, i) => {
          let characters = _obj.lowerCase(_obj.trimMultipleSpaces(word)).split("");
          newWords[i] = _obj.upperCase(characters.shift())+ characters.join("");
        });
        return newWords.join(" ");
      },
      trimMultipleChars(text, character) {
        text = Util.Object.getOrDefault(text, '');
        return String(text).split(character).filter(item => !!item).join(character).trim();
      },
      trimMultipleSpaces(text) {
        return _obj.trimMultipleChars(text, ' ');
      },
      trimAllSpaces(text) {
        return String(text).replace(/ /g, '');
      },
      stripNonPrintableChars(text) {
        return String(text).replace(/[^ -~]+/g, "");
      },
      padString(text, char, desiredLength, side) {
        text = String(text);
        char = String(char);
        if (["left", "right"].indexOf(side) < 0) {
          side = "right";
        }
        let characters = text.split("");
        let stringLength = characters.length;
        let padLength = desiredLength - stringLength;

        for (let c = 1; c <= padLength; c++) {
          text = (side === "right") ? text + char : char + text;
        }
        return text;
      },
      asCurrency(number, useGrouping) {
        useGrouping = useGrouping !== false;
        number = _obj.asNumber(number);
        return number.toLocaleString(
          undefined,
          {useGrouping, minimumFractionDigits: 2, maximumFractionDigits: 2}
        );
      },
      asNumber(number) {
        number = Util.Object.getOrDefault(number);
        number = Number(String(number).split(",").join(""));
        return (!isNaN(number)) ? number : 0;
      },
      withOptionalDecimal(number) {
        let newNumber = _obj.asNumber(number);
        let splitNewNumber = String(newNumber).split('.').map(n => Number(n));
        let [integer, fraction] = splitNewNumber;
        return (fraction) ? newNumber : integer;
      },
      windowTimestamp() {
        return String(window.performance.now()).split('.').join('');
      }
    };
    return _obj;
  })(),

}))();
