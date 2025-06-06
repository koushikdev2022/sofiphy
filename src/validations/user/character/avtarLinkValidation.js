const { validationResult } = require('express-validator');
const { body } = require('express-validator');
const { User } = require("../../../models");

const afterLink = async (req, res, next) => {
    const payload = req?.body;
    const t = req.t;
    const validationRules = [
        body('avatar')
            .exists()
            .withMessage('avatar is required'),
        body('id')
            .exists()
            .withMessage('id is required'),
        body('video_url')
            .exists()
            .withMessage('video_url is required')
        ];

    await Promise.all(validationRules.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(error => ({
            field: error.param,
            value: error.value,
            message: error.msg,
        }));

        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            data: formattedErrors,
            status_code: 422,
        });
    }

    next();
};

module.exports = afterLink;
