const apiError = require("../utils/apiError.js")

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)

    if (result.success === false) {
        throw new apiError(400, result.error.issues.map((res) => res.message).join(","))
    }

    next()
}

module.exports = validate
