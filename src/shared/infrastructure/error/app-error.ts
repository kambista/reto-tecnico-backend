export default class AppError extends Error {
  public nameError: string;
  public statusCode: number;
  public errors?: string[];

  constructor(
    nameError: string,
    statusCode: number,
    errorOrErros: string | string[],
  ) {
    const messageError = Array.isArray(errorOrErros)
      ? errorOrErros.join(", ")
      : errorOrErros;

    super(messageError);
    this.nameError = nameError;
    this.statusCode = statusCode;
    this.errors = Array.isArray(errorOrErros) ? errorOrErros : [errorOrErros];
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(errorOrErros: string | string[]) {
    return new AppError("BAD_REQUEST", 400, errorOrErros);
  }

  static notFound(messageError: string) {
    return new AppError("NOT_FOUND", 404, messageError);
  }

  static internalServerError(messageError: string) {
    return new AppError("INTERNAL_SERVER_ERROR", 500, messageError);
  }
}
