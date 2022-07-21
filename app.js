"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// node_modules/convert-csv-to-json/src/util/fileUtils.js
var require_fileUtils = __commonJS({
  "node_modules/convert-csv-to-json/src/util/fileUtils.js"(exports, module2) {
    "use strict";
    var fs2 = require("fs");
    var FileUtils = class {
      readFile(fileInputName, encoding) {
        return fs2.readFileSync(fileInputName, encoding).toString();
      }
      writeFile(json, fileOutputName) {
        fs2.writeFile(fileOutputName, json, function(err) {
          if (err) {
            throw err;
          } else {
            console.log("File saved: " + fileOutputName);
          }
        });
      }
    };
    module2.exports = new FileUtils();
  }
});

// node_modules/convert-csv-to-json/src/util/stringUtils.js
var require_stringUtils = __commonJS({
  "node_modules/convert-csv-to-json/src/util/stringUtils.js"(exports, module2) {
    "use strict";
    var StringUtils = class {
      trimPropertyName(value) {
        return value.replace(/\s/g, "");
      }
      getValueFormatByType(value) {
        if (value === void 0 || value === "") {
          return String();
        }
        let isNumber = !isNaN(value);
        if (isNumber) {
          return Number(value);
        }
        if (value === "true" || value === "false") {
          return JSON.parse(value.toLowerCase());
        }
        return String(value);
      }
      hasContent(values) {
        if (values.length > 0) {
          for (let i = 0; i < values.length; i++) {
            if (values[i]) {
              return true;
            }
          }
        }
        return false;
      }
    };
    module2.exports = new StringUtils();
  }
});

// node_modules/convert-csv-to-json/src/util/jsonUtils.js
var require_jsonUtils = __commonJS({
  "node_modules/convert-csv-to-json/src/util/jsonUtils.js"(exports, module2) {
    "use strict";
    var JsonUtil = class {
      validateJson(json) {
        try {
          JSON.parse(json);
        } catch (err) {
          throw Error("Parsed csv has generated an invalid json!!!\n" + err);
        }
      }
    };
    module2.exports = new JsonUtil();
  }
});

// node_modules/convert-csv-to-json/src/csvToJson.js
var require_csvToJson = __commonJS({
  "node_modules/convert-csv-to-json/src/csvToJson.js"(exports, module2) {
    "use strict";
    var fileUtils = require_fileUtils();
    var stringUtils = require_stringUtils();
    var jsonUtils = require_jsonUtils();
    var newLine = /\r?\n/;
    var defaultFieldDelimiter = ";";
    var CsvToJson = class {
      formatValueByType(active) {
        this.printValueFormatByType = active;
        return this;
      }
      fieldDelimiter(delimieter) {
        this.delimiter = delimieter;
        return this;
      }
      parseSubArray(delimiter = "*", separator = ",") {
        this.parseSubArrayDelimiter = delimiter;
        this.parseSubArraySeparator = separator;
      }
      encoding(encoding) {
        this.encoding = encoding;
        return this;
      }
      generateJsonFileFromCsv(fileInputName, fileOutputName) {
        let jsonStringified = this.getJsonFromCsvStringified(fileInputName);
        fileUtils.writeFile(jsonStringified, fileOutputName);
      }
      getJsonFromCsvStringified(fileInputName) {
        let json = this.getJsonFromCsv(fileInputName);
        let jsonStringified = JSON.stringify(json, void 0, 1);
        jsonUtils.validateJson(jsonStringified);
        return jsonStringified;
      }
      getJsonFromCsv(fileInputName) {
        let parsedCsv = fileUtils.readFile(fileInputName, this.encoding);
        return this.csvToJson(parsedCsv);
      }
      csvStringToJson(csvString) {
        return this.csvToJson(csvString);
      }
      csvToJson(parsedCsv) {
        let lines = parsedCsv.split(newLine);
        let fieldDelimiter = this.getFieldDelimiter();
        let headers = lines[0].split(fieldDelimiter);
        let jsonResult = [];
        for (let i = 1; i < lines.length; i++) {
          let currentLine = lines[i].split(fieldDelimiter);
          if (stringUtils.hasContent(currentLine)) {
            jsonResult.push(this.buildJsonResult(headers, currentLine));
          }
        }
        return jsonResult;
      }
      getFieldDelimiter() {
        if (this.delimiter) {
          return this.delimiter;
        }
        return defaultFieldDelimiter;
      }
      buildJsonResult(headers, currentLine) {
        let jsonObject = {};
        for (let j = 0; j < headers.length; j++) {
          let propertyName = stringUtils.trimPropertyName(headers[j]);
          let value = currentLine[j];
          if (this.isParseSubArray(value)) {
            value = this.buildJsonSubArray(value);
          }
          if (this.printValueFormatByType && !Array.isArray(value)) {
            value = stringUtils.getValueFormatByType(currentLine[j]);
          }
          jsonObject[propertyName] = value;
        }
        return jsonObject;
      }
      buildJsonSubArray(value) {
        let extractedValues = value.substring(value.indexOf(this.parseSubArrayDelimiter) + 1, value.lastIndexOf(this.parseSubArrayDelimiter));
        extractedValues.trim();
        value = extractedValues.split(this.parseSubArraySeparator);
        if (this.printValueFormatByType) {
          for (let i = 0; i < value.length; i++) {
            value[i] = stringUtils.getValueFormatByType(value[i]);
          }
        }
        return value;
      }
      isParseSubArray(value) {
        if (this.parseSubArrayDelimiter) {
          if (value && (value.indexOf(this.parseSubArrayDelimiter) === 0 && value.lastIndexOf(this.parseSubArrayDelimiter) === value.length - 1)) {
            return true;
          }
        }
        return false;
      }
    };
    module2.exports = new CsvToJson();
  }
});

// node_modules/convert-csv-to-json/index.js
var require_convert_csv_to_json = __commonJS({
  "node_modules/convert-csv-to-json/index.js"(exports) {
    "use strict";
    var csvToJson2 = require_csvToJson();
    var encodingOps = {
      utf8: "utf8",
      ucs2: "ucs2",
      utf16le: "utf16le",
      latin1: "latin1",
      ascii: "ascii",
      base64: "base64",
      hex: "hex"
    };
    exports.formatValueByType = function(active = true) {
      csvToJson2.formatValueByType(active);
      return this;
    };
    exports.fieldDelimiter = function(delimiter) {
      csvToJson2.fieldDelimiter(delimiter);
      return this;
    };
    exports.parseSubArray = function(delimiter, separator) {
      csvToJson2.parseSubArray(delimiter, separator);
      return this;
    };
    exports.customEncoding = function(encoding) {
      csvToJson2.encoding = encoding;
      return this;
    };
    exports.utf8Encoding = function utf8Encoding() {
      csvToJson2.encoding = encodingOps.utf8;
      return this;
    };
    exports.ucs2Encoding = function() {
      csvToJson2.encoding = encodingOps.ucs2;
      return this;
    };
    exports.utf16leEncoding = function() {
      csvToJson2.encoding = encodingOps.utf16le;
      return this;
    };
    exports.latin1Encoding = function() {
      csvToJson2.encoding = encodingOps.latin1;
      return this;
    };
    exports.asciiEncoding = function() {
      csvToJson2.encoding = encodingOps.ascii;
      return this;
    };
    exports.base64Encoding = function() {
      this.csvToJson = encodingOps.base64;
      return this;
    };
    exports.hexEncoding = function() {
      this.csvToJson = encodingOps.hex;
      return this;
    };
    exports.generateJsonFileFromCsv = function(inputFileName, outputFileName) {
      if (!inputFileName) {
        throw new Error("inputFileName is not defined!!!");
      }
      if (!outputFileName) {
        throw new Error("outputFileName is not defined!!!");
      }
      csvToJson2.generateJsonFileFromCsv(inputFileName, outputFileName);
    };
    exports.getJsonFromCsv = function(inputFileName) {
      if (!inputFileName) {
        throw new Error("inputFileName is not defined!!!");
      }
      return csvToJson2.getJsonFromCsv(inputFileName);
    };
    exports.csvStringToJson = function(csvString) {
      return csvToJson2.csvStringToJson(csvString);
    };
    exports.jsonToCsv = function(inputFileName, outputFileName) {
      csvToJson2.generateJsonFileFromCsv(inputFileName, outputFileName);
    };
  }
});

// src/index.ts
var import_convert_csv_to_json = __toESM(require_convert_csv_to_json());
var import_fs = __toESM(require("fs"));
var semesterReportCSV = import_convert_csv_to_json.default.fieldDelimiter('"').getJsonFromCsv("./csv/SemesterReportAllResultsCsvExport.csv");
var studentResults = /* @__PURE__ */ new Map();
getStudents().forEach((student) => {
  const VCDSAverage = getVCDSAverage(student);
  let validVCDSAverage = 0;
  if (!isNaN(VCDSAverage)) {
    validVCDSAverage = VCDSAverage;
  }
  const data = {
    firstName: getFirstName(student),
    surname: getSurname(student),
    VCDSAverage: validVCDSAverage,
    WorkHabitsAverage: getWorkHabitsAverage(student),
    formGroup: getFormGroup(student)
  };
  studentResults.set(student, data);
  console.log(`[ Processed Student: ${student} ]`);
});
import_fs.default.writeFileSync("./csv/Student-VCDS-and-WorkHabits-Average.csv", getCSV(studentResults));
console.log("\n[ Finished! Output: ./csv/Student-VCDS-and-WorkHabits-Average.csv ] \n");
function getCSV(sResults) {
  const header = "StudentCode,FirstName,Surname,FormGroup,VCDSAverage,WorkHabitsAverage";
  let csv = "";
  for (const [key, student] of sResults) {
    csv += String(key) + ",";
    csv += String(student.firstName) + ",";
    csv += String(student.surname) + ",";
    csv += String(student.formGroup) + ",";
    csv += String(student.VCDSAverage) + ",";
    csv += String(student.WorkHabitsAverage);
    csv += "\n";
  }
  return header + "\n" + csv;
}
function getWorkHabitsAverage(studentCode) {
  const results = [];
  semesterReportCSV.forEach((row) => {
    if (row.StudentCode === studentCode) {
      results.push(rowHasWorkHabit(row));
    }
  });
  return getAverage(results);
}
function rowHasWorkHabit(row) {
  let workHabitResult = 0;
  const workHabitResultValues = /* @__PURE__ */ new Map();
  workHabitResultValues.set("rarely", 1);
  workHabitResultValues.set("sometimes", 2);
  workHabitResultValues.set("usually", 3);
  workHabitResultValues.set("consistently", 4);
  if (row.AssessmentType === "Work Habits") {
    const result = row.Result.toLowerCase();
    if (workHabitResultValues.has(result)) {
      workHabitResult = workHabitResultValues.get(result);
    }
  }
  return workHabitResult;
}
function getVCDSAverage(studentCode) {
  const results = [];
  semesterReportCSV.forEach((e) => {
    if (e.StudentCode === studentCode) {
      const rawResult = +e.Result;
      if (!isNaN(rawResult)) {
        results.push(rawResult);
      }
    }
  });
  return getAverage(results);
}
function getStudents() {
  const studentCodes = /* @__PURE__ */ new Set();
  semesterReportCSV.forEach((row) => {
    studentCodes.add(row.StudentCode);
  });
  return studentCodes;
}
function getFirstName(studentCode) {
  let firstName = "";
  for (const row of semesterReportCSV) {
    if (row.StudentCode === studentCode) {
      firstName = row.StudentFirstName;
      break;
    }
  }
  return firstName;
}
function getSurname(studentCode) {
  let surname = "";
  for (const row of semesterReportCSV) {
    if (row.StudentCode === studentCode) {
      surname = row.StudentLastName;
      break;
    }
  }
  return surname;
}
function getFormGroup(studentCode) {
  let formGroup = "";
  for (const row of semesterReportCSV) {
    if (row.StudentCode === studentCode) {
      formGroup = row.StudentFormGroup;
      break;
    }
  }
  return formGroup;
}
function getAverage(results) {
  const sum = results.reduce((a, b) => a + b, 0);
  const average = sum / results.length;
  return Number(average.toFixed(2));
}
//# sourceMappingURL=app.js.map
