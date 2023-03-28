import { Injectable } from '@angular/core';
import { ApplicationInsights, IExceptionTelemetry } from '@microsoft/applicationinsights-web';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApplicationInsightsService {
  private appInsights: ApplicationInsights;

  constructor(private router: Router) {

    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: environment.appInsights.instrumentationKey
      }
    });

    this.appInsights.loadAppInsights();
    this.loadCustomTelemetryProperties();
    this.createRouterSubscription();
  }

  logInSuccessful() {
    this.appInsights.trackMetric({ name: 'SuccessfulClientAuth', average: 1 });
    this.appInsights.trackEvent({ name: 'SuccessfulClientAuth' });
  }

  refreshTokenSuccessful() {
    this.appInsights.trackMetric({ name: 'SuccessfulClientJwtRefresh', average: 1 });
    this.appInsights.trackEvent({ name: 'SuccessfulClientJwtRefresh' });
  }

  setUserId(userId: string) {
    this.appInsights.setAuthenticatedUserContext(userId);
  }

  clearUserId() {
    this.appInsights.clearAuthenticatedUserContext();
  }

  logPageView(name?: string, uri?: string) {
    this.appInsights.trackPageView({ name, uri});
  }

  logException(error: Error){
    const exception: IExceptionTelemetry = {
      exception : error
    };
    this.appInsights.trackException(exception);
  }

  private loadCustomTelemetryProperties() {
    this.appInsights.addTelemetryInitializer(envelope =>
      {
        const item = envelope.baseData;
        item.properties = item.properties || {};
        item.properties.ApplicationPlatform = 'WEB';
        item.properties.ApplicationName = 'Norder';
      }
    );
  }

  private createRouterSubscription()
  {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.logPageView(null, event.urlAfterRedirects);
    });
  }
}
