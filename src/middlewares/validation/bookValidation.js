export const validateBook = (req, res, next) => {
  const obj = {
    status: Joi.string().optional(),
    title: Joi.string().min(3).required(),
    year: Joi.number().min(9).required(),
    imageURL: Joi.string().email({ minDomainSegments: 2 }).required(),
    isbn: Joi.string().required(),
    genre: Joi.string().required(),
    available: Joi. string(),
    averageRating: Joi.number().optional(),
    addedBy:Joi.object({
        name:Joi.string(),
        adminId: Joi.string(),
    }),
    lastUpdatedBy:Joi.object({
        name:Joi.string(),
        adminId: Joi.string(),
    }),
    author: Joi.string().required()
  };
  return validateData({ req, res, next, obj });
};