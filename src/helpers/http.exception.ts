import { HttpException, HttpStatus } from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

const DUPLICATE_ENTRY_ERROR = 1062;
const FIELD_CANNOT_BE_NULL_ERROR = 1364;

function QueryFailedErrorException(err: QueryFailedError) {
  if (err.driverError.errno === DUPLICATE_ENTRY_ERROR) {
    // TODO: especificar qual é o campo que esta duplicado.
    throw new HttpException(
      {
        status: HttpStatus.CONFLICT,
        error: `Field already exists. ${err.message}`,
        errorMessageDetail: err,
      },
      HttpStatus.CONFLICT,
    );
  } else if (err.driverError.errno === FIELD_CANNOT_BE_NULL_ERROR) {
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: `Field cannot be null. ${err.message}`,
        errorMessageDetail: err,
      },
      HttpStatus.BAD_REQUEST,
    );
  } else {
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: err.message,
        errorMessageDetail: err,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

function EntityNotFoundException(entity: string, err: EntityNotFoundError) {
  throw new HttpException(
    {
      status: HttpStatus.NOT_FOUND,
      error: `Entity ${entity} not found`,
      errorMessageDetail: err,
    },
    HttpStatus.NOT_FOUND,
  );
}

export const CatarinaException = {
  QueryFailedErrorException,
  EntityNotFoundException,
};
