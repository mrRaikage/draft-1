import { Injectable } from '@angular/core';

import { LogConsole, LogLocalStorage, LogPublisher } from '../log-publisher';

@Injectable({
  providedIn: 'root'
})
export class LogPublishersService {

  constructor() {
    this.buildPublishers();
  }

  /** Public properties */
  publishers: LogPublisher[] = [];

  /** Build publishers array */
  buildPublishers(): void {
    /** Create instance of LogConsole Class */
    this.publishers.push(new LogConsole());

    /** Create instance of LogLocalStorage Class */
    // this.publishers.push(new LogLocalStorage());
  }

}
