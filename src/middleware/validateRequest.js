import { body } from 'express-validator'


const schema = [
    body('name').not().isEmpty.trim().escape()
    .withMessage('name must be provided'),
    body('email').isEmail()
    .withMessage('must be be a valid email'),
    body('password').isLength({min: 5})
    .withMessage('must be at least 5 characters long'),
]

export {schema as registerSchema}