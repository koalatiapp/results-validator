class ResultsValidator
{
    checkResults(results) {
        this.errors = [];

        if ('object' != typeof results) {
            this.errors.push(`The tool's results should be an array or an object. ${typeof results} found instead.`);
        } else {
            results = Object.values(results);

            if (!results.length) {
                this.errors.push(`The tool did not return any results (array of results is empty).`);
            }

            for (const singleResult of results) {
                this._checkSingleResult(singleResult);
            }
        }

        return this.errors;
    }

    _checkSingleResult(result)
    {
        if ('object' != typeof result) {
            this.errors.push(`Every result element should be an object. ${typeof result} found instead.`);
            return;
        }

        this._checkMissingProperties(result);
        this._checkPropertiesType(result);
        this._checkSnippetsFormat(result);
        this._checkTableFormat(result);
        this._checkRecommendationsFormat(result);
    }

    _checkMissingProperties(result) {
        const requiredProperties = ['uniqueName', 'title', 'description', 'weight', 'score'];
        for (const property of requiredProperties) {
            if ('undefined' == typeof result[property] || result[property] === null) {
                this.errors.push(`Every result element should contain the ${property} property, but the following result does not include it: \n${JSON.stringify(result)}`);
                return;
            }
        }
    }

    _checkPropertiesType(result) {
        if (typeof result.uniqueName != 'string' || result.uniqueName.length < 2) {
            this.errors.push(`The uniqueName of a result element should be a string of at least 2 characters, but the following ${typeof result.uniqueName} was found: ${JSON.stringify(result.uniqueName)}`);
        }

        if (typeof result.title != 'string' || result.title.length < 2) {
            this.errors.push(`The title of a result element should be a string of at least 2 characters, but the following ${typeof result.title} was found: ${JSON.stringify(result.title)}`);
        }

        if (typeof result.description != 'string' || result.description.length < 20) {
            this.errors.push(`The description of a result element should be a string of at least 20 characters, but the following ${typeof result.description} was found: ${JSON.stringify(result.description)}`);
        }

        if (typeof result.weight != 'number' || result.weight > 1 || result.weight < 0) {
            this.errors.push(`The weight of a result element should be a float value between 0.0 and 1.0, but the following ${typeof result.weight} was found: ${JSON.stringify(result.weight)}`);
        }

        if (typeof result.score != 'number' || result.score > 1 || result.score < 0) {
            this.errors.push(`The score of a result element should be a float value between 0.0 and 1.0, but the following ${typeof result.score} was found: ${JSON.stringify(result.score)}`);
        }
    }

    _checkSnippetsFormat(result) {
        if (typeof result.snippets == 'undefined' || result.snippets === null) {
            return;
        }

        if (!Array.isArray(result.snippets)) {
            this.errors.push(`The snippets of a result element should be an array of strings or ElementHandle objects, but the following ${typeof result.snippets} was found: ${JSON.stringify(result.snippets)}`);
        } else {
            for (const snippet of result.snippets) {
                const type = typeof snippet;
                if (type != 'string' && !(type == 'object' && typeof snippet.executionContext != 'undefined')) {
                    this.errors.push(`The individual snippets of a result element should be a string or ElementHandle object, but the following ${typeof snippet} was found: ${JSON.stringify(snippet)}`);
                }
            }
        }
    }

    _checkTableFormat(result) {
        if (typeof result.table == 'undefined' || result.snippets === null) {
            return;
        }

        if (!Array.isArray(result.table)) {
            this.errors.push(`The table of a result element should be a two-dimensional arrays, but the following ${typeof result.table} was found: ${JSON.stringify(result.table)}`);
        } else {
            const headingCount = (result.table[0] || []).length;

            for (const row of result.table) {
                if (!Array.isArray(row)) {
                    this.errors.push(`The table of a result element should be a two-dimensional arrays, but the following ${typeof row} was found instead of an array for a row: ${JSON.stringify(row)}`);
                } else {
                    if (row.length != headingCount) {
                        this.errors.push(`Every row of a result element's table should contain the same number of values, but the following row's length doesn't match the heading: ${JSON.stringify(row)}`);
                    }

                    for (const value of row) {
                        if (['number', 'string', 'bigint', 'boolean'].indexOf(typeof value) == -1) {
                            this.errors.push(`The values of a result element's table be numbers, booleans or strings, but the following ${typeof value} was found instead of an array for a row: ${JSON.stringify(value)}`);
                        }
                    }
                }
            }
        }
    }

    _checkRecommendationsFormat(result) {
        if (typeof result.recommendations == 'undefined' || result.snippets === null) {
            return;
        }

        if (typeof result.recommendations != 'string' && !Array.isArray(result.recommendations)) {
            this.errors.push(`The recommendations of a result element should be a string or an array of strings, but the following ${typeof result.recommendations} was found: ${JSON.stringify(result.recommendations)}`);
        }

        if (Array.isArray(result.recommendations)) {
            for (const value of result.recommendations) {
                if (typeof value != 'string') {
                    this.errors.push(`The values in an array of recommendations for a result element should be a strings, but the following ${typeof value} was found: ${JSON.stringify(value)}`);
                }
            }
        }
    }
}

module.exports = ResultsValidator;
