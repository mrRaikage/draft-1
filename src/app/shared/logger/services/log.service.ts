import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { LogPublisher } from '../log-publisher';
import { LogPublishersService } from './log-publishers.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  webTraceLogging = false;
  logWithDate = true;
  publishers: LogPublisher[];

  constructor(
    private publishersService: LogPublishersService,
    private lSService: LocalStorageService
    ) {

    /** Set publishers */
    this.publishers = this.publishersService.publishers;

    /** Web Trace Logging */
    if (this.lSService.getFeatureFlags()) {
      this.webTraceLogging = this.lSService.getFeatureFlags().WebTraceLogging;

    }
  }

  private writeToLog(msg: string) {
    const entry: LogEntry = new LogEntry();
    entry.message = msg;
    entry.logWithDate = this.logWithDate;

    this.publishers.forEach(logger => {
      logger.log(entry).subscribe(response => response);
    });
  }

  log(msg: string) {
    if (!this.webTraceLogging) {
      return;
    }
    this.writeToLog(msg);
  }

}

export class LogEntry {

  /** Public Properties */
  entryDate: Date = new Date();
  message = '';
  logWithDate = true;

  buildLogString(): string {
    let ret = this.message;

    if (this.logWithDate) {
      ret += ';\n -- timestamp( ' + moment().format('h:mm:ss a') + ' )';
    }

    return ret;
  }
}
