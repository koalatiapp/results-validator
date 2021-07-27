const assert = require("assert");
const validResults = require("./stub/valid-result.json");
const ResultsValidator = require("../index.js");
const resultsValidator = new ResultsValidator();

describe("Basics", () => {
	it("Valid results should validate without errors", () => {
		const errors = resultsValidator.checkResults(validResults);
		assert.deepStrictEqual(errors, []);
	});
});

describe("Table", () => {
	it("Non-matching column count triggers validation error", () => {
		const results = extendValidResults("table", [
			["Header 1", "Header 2"],
			["Value 1", "Value 2"],
			["Other Value 1", "Other Value 2", "A third value?"]
		]);
		const errors = resultsValidator.checkResults(results);
		assert.notStrictEqual(errors.length, 0);
	});
});

describe("Recommendations", () => {
	it("Wrong type (non-array) triggers validation error", () => {
		const results = extendValidResults("recommendations", {});
		const errors = resultsValidator.checkResults(results);
		assert.notStrictEqual(errors.length, 0);
	});

	it("Non-string/array recommendations trigger validation errors", () => {
		const results = extendValidResults("recommendations", [() => {}]);
		const errors = resultsValidator.checkResults(results);
		assert.notStrictEqual(errors.length, 0);
	});

	it("Invalid templated recommendations trigger validation errors", () => {
		const results = extendValidResults("recommendations", [["My template", "not an object"]]);
		const errors = resultsValidator.checkResults(results);
		assert.notStrictEqual(errors.length, 0);
	});
});

function extendValidResults(key, newValue)
{
	const newResults = JSON.parse(JSON.stringify(validResults));
	newResults[0][key] = newValue;

	return newResults;
}