class Evaluator {

    getParameters(expression) {
        const parameters = this.getStringParameters(expression);
        console.log("string params: ", parameters)
        this.evaluateParameters(parameters);
        console.log("after: ", parameters)

        return parameters;
    }

    evaluateSimpleExpression(expression) {
        try {
            const sanitizedExpression = expression.replace(/[^0-9+\-*/().\s]/g, '');

            const result = new Function(`return ${sanitizedExpression}`)();

            return result;
        } catch (error) {
            console.error("Invalid expression:", error);
            return "Error: Invalid expression";
        }
    }

    getStringParameters(expression) {
        const atkMatch = expression.match(/atk3?\s+([^defmod]+)/); // Matches "atk" values until "def" or "mod"
        const defMatch = expression.match(/def\s+([^mod]+)/);      // Matches "def" values until "mod"
        const modMatch = expression.match(/mod\s+(.+)/);  

        const atk = atkMatch ? atkMatch[1].trim() : null;
        const def = defMatch ? defMatch[1].trim() : null;
        const mod = modMatch ? modMatch[1].trim() : null;
        console.log("expression:", expression);
        console.log("mod", modMatch)

        return { atk, def, mod };
        // improve later
    }

    calculateMode1(parameters) {
        // ATK calculation mode
        const atk = parameters.atk;
        const def = parameters.def;
        const mod = parameters.mod ? parameters.mod : 0;
        // check atk def not null

        // evaluate simple expressions

        let result = 0;
        if (atk >= def)
            result = (atk * 2) / def + mod;
        else
            result = 4 - (def * 2 / atk) + mod;
        return result;
    }

    calculateMode2(parameters) {
        // ATK3 calculation mode
        const atk = parameters.atk;
        const def = parameters.def;
        const mod = parameters.mod ? parameters.mod : 0;
        // check atk def not null
        
        let result = 0;
        if (atk >= def)
            result = (atk * 3 / def) + mod;
        else result = 6 - (def * 3 / atk) + mod;

        return result;
    }

    getCalculationMode(expression) {
        if (expression.startsWith('atk3')) {
            return 2;
        } else if (expression.startsWith('atk')) {
            return 1;
        } else {
            return null;
        }
    }

    evaluateParameters(parameters) {
        for (let key in parameters) {
            parameters[key] = this.evaluateSimpleExpression(parameters[key]);
        }
    }

    processExpression(expression) {
        const calculationMode = this.getCalculationMode(expression);
        const parameters = this.getParameters(expression);

        const resultObject = {
            command: expression,
            values: `atk ${parameters.atk} def ${parameters.def} mod ${parameters.mod}`,
            result: 0
        }
        if (calculationMode === 1) {
            resultObject.result = this.calculateMode1(parameters);
        } else if (calculationMode === 2) {
            resultObject.result = this.calculateMode2(parameters);
        } else {
            throw new Error("Wrong calculation mode")
        }

        return resultObject;
    }

    beautifyResult(resultObject) {
        return `command: ${resultObject.command}\nvalues: ${resultObject.values}\nresult: ${resultObject.result}`;
    }

    evaluate(expression) {
        const result = this.processExpression(expression);
        return this.beautifyResult(result);
    }
}


module.exports = Evaluator;