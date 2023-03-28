import { ErrorHandler, Injector, Injectable } from '@angular/core';
import { ApplicationInsightsService } from './application-insights.service';

@Injectable()
export class ApplicationInsightsErrorHandler implements ErrorHandler{

  constructor(private injector: Injector)
  {}

  handleError(error: any): void {
    this.injector.get<ApplicationInsightsService>(ApplicationInsightsService).logException(error);
    console.log(error);
  }
}
