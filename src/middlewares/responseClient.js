export const responseClient = ({req, res, message, statusCode = 200}) => {
  //success response
  req.success = () => {
    res.status(statusCode).json({
      status: "success",
      message,
    });
  };

  //error response
  req.error = () => {
    console.log("Error here.");
    res.status(statusCode).json({
      status: "error",
      message,
    });
  };

  if (statusCode >= 200 && statusCode < 300) {
    return req.success();
  } else {
    return req.error();
  }
};
