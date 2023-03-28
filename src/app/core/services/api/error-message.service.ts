import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {

  constructor() { }

  getMessage(errorResponse: HttpErrorResponse): string {
    return typeof errorResponse.error === 'string'
      ? errorResponse.error
      : null;
  }
}
