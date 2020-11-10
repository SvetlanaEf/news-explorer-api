module.exports = (errorName) => {
  const defaultError = {
    status: 500,
    message: 'На сервере произошла ошибка',
  };
  const errorCode = {
    NotFound: {
      status: 404,
      message: 'Не найдено',
    },
    CastError: {
      status: 400,
      message: 'Переданы некорректные данные',
    },
    ValidationError: {
      status: 400,
      message: 'Ошибка валидации',
    },
    AuthError: {
      status: 401,
      message: 'Ошибка авторизации',
    },
    ConflictError: {
      status: 409,
      message: 'Конфликт данных',
    },
    ForbiddenError: {
      status: 403,
      message: 'Ошибка доступа',
    },
  };

  return errorCode[errorName] || defaultError;
};
