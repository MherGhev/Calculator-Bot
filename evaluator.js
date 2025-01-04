class Evaluator {

    getParameters(expression) {
        const parameters = this.getStringParameters(expression);

        this.evaluateParameters(parameters);

        this.validateParameters(parameters);

        return parameters;
    }

    getStringParameters(expression) {
        const atkMatch = expression.match(/atk\d?(.*?)def/);
        const defMatch = expression.match(/def(.*?)(?:mod|$)/);
        const modMatch = expression.match(/mod(.*)$/);

        const atk = atkMatch ? atkMatch[1].trim() : null;
        const def = defMatch ? defMatch[1].trim() : null;
        const mod = modMatch ? modMatch[1].trim() : 0;

        return { atk, def, mod };
    }

    evaluateParameters(parameters) {
        for (let key in parameters) {
            parameters[key] = this.evaluateMathExpression(parameters[key]);
        }
    }

    evaluateMathExpression(mathExpression) {
        try {
            const sanitizedExpression = mathExpression.replace(/[^0-9+\-*/().\s]/g, '');

            const result = new Function(`return ${sanitizedExpression}`)();

            return result;
        } catch (error) {
            console.log("Invalid expression:", error);
            return "Error: Invalid expression";
        }
    }

    validateParameters(parameters) {
        let errorMessages = [];
        let isError = false;
        if (parameters.atk === null || parameters.atk === "" || isNaN(parameters.atk)) {
            errorMessages.push("Missing parameter atk");
            isError = true;
        }
        if (parameters.def === null || parameters.def === "" || isNaN(parameters.def)) {
            errorMessages.push("Missing parameter def");
            isError = true;
        }

        if (parameters.mod === null || parameters.def === "" || isNaN(parameters.mod)) {
            parameters.mod = 0; // mod is optional
        }

        if (isError) {
            throw new Error(errorMessages.join("\n"));
        }
    }



    evaluate(expression) {
        const result = this.processExpression(expression);
        return this.beautifyResult(result);
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

        resultObject.result = this.roundToFirstDecimalPlace(resultObject.result);

        return resultObject;
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

    calculateMode1(parameters) {
        // ATK calculation mode
        const atk = parameters.atk;
        const def = parameters.def;
        const mod = parameters.mod ? parameters.mod : 0;

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

        let result = 0;
        if (atk >= def)
            result = (atk * 3 / def) + mod;
        else result = 6 - (def * 3 / atk) + mod;

        return result;
    }

    roundToFirstDecimalPlace(number) {
        return Math.floor(number * 10) / 10;
    }

    beautifyResult(resultObject) {
        return `command: ${resultObject.command}\nvalues: ${resultObject.values}\nresult: ${resultObject.result}`;
    }

  
}


module.exports = Evaluator;