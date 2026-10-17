// const Joi = require("joi");

// const signupValidation = (req, res, next) => {
//     const schema = Joi.object({
//         username: Joi.string().min(3).max(30).required(),
//         email: Joi.string().email().required(),
//         password: Joi.string().min(6).required()
//     });

//     const { error } = schema.validate(req.body);
//     if (error) {
//         return res.status(400).json({ message: "Bad Request", details: error.details });
//     }
//     next();
// };
//  const loginValidation = (req, res, next) => {
//     const schema = Joi.object({
//         email: Joi.string().email().required(),
//         password: Joi.string().min(6).required()
//     });

//     const { error } = schema.validate(req.body);
//     if (error) {
//         return res.status(400).json({ message: "Bad Request", details: error.details });
//     }
//     next();
// }

// module.exports = { signupValidation , loginValidation };