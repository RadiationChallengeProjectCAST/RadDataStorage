const { validationResult } = require('express-validator');

// Both inclusive
function GetRandomInt(min, max) {
    const intMin = Math.ceil(min);
    const intMax = Math.floor(max);
    return Math.floor(Math.random() * (intMax - intMin + 1)) + intMin;
}

function FormatValidatorErrors(errors) {
    const formattedErrors = [];
    errors.array().forEach((e) => {
        formattedErrors.push(
            {
                code: 101,
                message: `${e.param} parameter is missing or is invalid.`,
            },
        );
    });
    return formattedErrors;
}

function CheckValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422);
        res.json({
            success: false,
            errors: FormatValidatorErrors(errors),
        });
    } else {
        next();
    }
}
exports.GetRandomInt = GetRandomInt;
exports.CheckValidation = CheckValidation;
