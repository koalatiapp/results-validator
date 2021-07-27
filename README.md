# Koalati Results Validator

[![NPM version of @koalati/results-validator](https://img.shields.io/npm/v/@koalati/results-validator)](https://www.npmjs.com/package/@koalati/results-validator)

The ResultsValidator class can be used to ensure the validity of a Koalati tool's results.
It is included and used by the @koalati/tool-template package, and to validate results before they are returned on Koalati.

To get started with the ResultsValidator, you can install it via NPM:
```bash
npm i @koalati/results-validator
```

Then, you can include it in your project and use it as such:
```js
const ResultsValidator = require('@koalati/results-validator');

// ...

const results = yourResultsFunction();
const validator = new ResultsValidator();
const validationErrors = validator.checkResults(results);

// validator.checkResults returns an array of error messages (strings)
// if the array is empty, it means your results are valid
for (const error of validationErrors) {
    console.log('Results validation error: ' + error);
    // ... or other error handling of your choice
}
```

## Tool result format and available properties

A tool's results are are simply an array of serializable objects. Each of those objects represent a test that the tool has carried out and contains the results for that test.
Here are the properties that are allowed for those objects:


| Property          | Required | Allowed types             | Description                                                   |
|-------------------|----------|---------------------------|---------------------------------------------------------------|
| uniqueName        | Yes      | string                    | A slug-like name for the test that is unique within a tool. This will be prefixed with the tool's name to generate a Koalati-wide unique name for the test. |
| title             | Yes      | string                    | A user-friendly title.                                        |
| description       | Yes      | string                    | A user-friendly description of the test.                      |
| weight            | Yes      | float                     | The percentage of your tool's total score that comes from this test. Should be a float between 0 and 1.0 |
| score             | Yes      | float                     | Score obtained by the tested page or website. Should be a float between 0 and 1.0 |
| snippets          | No       | string[], [ElementHandle](https://pptr.dev/#?product=Puppeteer&version=main&show=api-class-elementhandle)[] | A list of strings to represent as code snippets in Koalati's results. |
| table             | No       | array[]                   | A two-dimensional array of data that will be represented as a table in Koalati's results. The first row should contain the column's headings. |
| recommendations   | No       | string, string[], array          | Recommendation(s) telling the user what can be done to improve their results. **If your recommendation contains dynamic value(s)**, you should use the array format and provide a message template (string) as the first element, and an object literal containing the values with the placeholders as keys.  Ex.: `["Use XYZ to reduce page weight by %savings%.", { "%savings%": "6%" }]` |
