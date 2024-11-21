export const createErrorOptions = (error) => {
  const validationErrorsArr = error.graphQLErrors
    .filter((error) => error.extensions.error)
    .map((error) => error.extensions.error.message);

  const validationErrorsMessage =
    validationErrorsArr.length > 0 ? validationErrorsArr.join("\n") : null;

  return {
    message: validationErrorsMessage || error.message || "Error",
    type: "error",
  };
};
