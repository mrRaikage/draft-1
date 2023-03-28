import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { LogEntry } from './services/log.service';

/** Log Publisher Abstract Class */
export abstract class LogPublisher {
  location: string;

  abstract log(record: LogEntry):
    Observable<boolean>;

  abstract clear(): Observable<boolean>;
}

/** Publish To Console */
export class LogConsole extends LogPublisher {
  log(entry: LogEntry): Observable<boolean> {
    console.log(entry.buildLogString());
    return of(true);
  }

  clear(): Observable<boolean> {
    console.clear();
    return of(true);
  }
}

/** Publish To Locale Storage */
export class LogLocalStorage extends LogPublisher {

  constructor() {
    super();
    this.location = 'logging';
  }

  log(entry: LogEntry): Observable<boolean> {
    let ret = false;
    let values: LogEntry[];

    try {
      /** Get previous values from local storage */
      values = JSON.parse(localStorage.getItem(this.location)) || [];

      /** Add new log entry to array */
      values.push(entry);

      /** Store array into local storage */
      localStorage.setItem(this.location, JSON.stringify(values));

      /** Set return value */
      ret = true;
    } catch (ex) {
      /** Display error in console */
      console.log(ex);
    }

    return of(ret);
  }

  /** Clear all log entries from local storage */
  clear(): Observable<boolean> {
    localStorage.removeItem(this.location);
    return of(true);
  }
}

/** Publish To Web Api */
export class LogWebApi extends LogPublisher {

  constructor(private http: HttpClient) {
    super();

    /** Set location */
    /** TODO: Wait Endpoint */
    this.location = '';
  }

  /** Add log entry to back end data asset */
  log(entry: LogEntry): Observable<boolean> {
    /** TODO: Wait Headers and Options for Request */
    const headers = '';
    const options = {};

    return this.http.post(this.location, entry, options).pipe(
      map(response => response),
      catchError((error) => {
        return this.handleErrors(error);
      })
    );
  }

  /** Clear all log entries from local storage */
  clear(): Observable<boolean> {
    /** TODO: Call Web API to clear all values */
    return of(true);
  }

  private handleErrors(error: any): Observable<any> {
    const errors: string[] = [];
    let msg = '';

    msg = 'Status: ' + error.status;
    msg += ' - Status Text: ' + error.statusText;
    if (error.json()) {
      msg += ' - Exception Message: ' + error.json().exceptionMessage;
    }
    errors.push(msg);

    console.error('An error occurred', errors);
    return Observable.throw(errors);
  }
}


