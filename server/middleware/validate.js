

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(
      req.body
    );

    if (error) {
      return res.status(422).json({
        success: false,
        message: "Validation Error",
        data: null,
        error: error.details[0].message
      });
    }

    next();
  };
};

export default validate;