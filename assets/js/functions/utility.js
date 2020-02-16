
 const Util = (() => ({
  Object: (function () {
    const _obj = {
      getOrDefault(value, defaultValue = "") {
        return _obj.isEmpty(value) ? defaultValue : value;
      },
      isEmpty(value) {
        const Empties = ['undefined', 'null', 'NaN', 'false', '0', ''];
        return !Array.isArray(value) && Empties.includes(String(value).trim());
      },
      isObject(obj) {
        return !_obj.isEmpty(obj) && isNaN(obj.length);
      },
      subset(obj, keys, newObj) {
        if(!_obj.isObject(newObj)){
          newObj = {};
        }
        keys.forEach(key => {
          newObj[key] = obj.hasOwnProperty(key) ? obj[key] : null;
        });
        return newObj;
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
        if (Util.Object.isEmpty(string)) { return ''; }

        let newWords = [];
        let words = String(string).toLowerCase().split(" ");

        words.forEach((word, i) => {
          let characters = _obj.trimMultipleSpaces(word).toLowerCase().split("");
          newWords[i] = characters.shift().toUpperCase() + characters.join("");
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
        return number.toLocaleString(undefined, {useGrouping, minimumFractionDigits: 2, maximumFractionDigits: 2});
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
    };
    return _obj;
  })(),
   
}))();
