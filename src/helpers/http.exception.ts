import { HttpException, HttpStatus } from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

function DuplicateEntryException(err: QueryFailedError) {
  throw new HttpException(
    {
      status: HttpStatus.BAD_REQUEST,
      error: `Field already exists ${err.message}`,
      errorMessageDetail: err,
    },
    HttpStatus.BAD_REQUEST,
  );
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
  DuplicateEntryException,
  EntityNotFoundException,
};
