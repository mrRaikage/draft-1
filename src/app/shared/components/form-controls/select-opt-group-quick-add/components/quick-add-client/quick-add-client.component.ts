import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Store } from '@ngrx/store';

import * as clientsSelectors from '../../../../../../core/store/clients/clients.selectors';
import { IClientsState } from '../../../../../../core/store/clients/clients.reducer';

@Component({
  selector: 'app-quick-add-client',
  templateUrl: './quick-add-client.component.html',
  styleUrls: ['./quick-add-client.component.scss']
})
export class QuickAddClientComponent implements OnInit {

  isAddState: boolean;
  addClientName: string;
  spinner$ = this.clientsStore.select(clientsSelectors.selectSpinner);

  @Input() autoGroup: MatAutocomplete;
  @Input() set panelIsOpened(e) {
    this.resetState();
  }

  @Output() quickAddClient = new EventEmitter<string>();

  @ViewChild('el') el: ElementRef;

  constructor(
    private clientsStore: Store<IClientsState>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  quickAddButtonClick($event: Event): void {
    $event.stopPropagation();
    this.isAddState = true;
    this.cdr.detectChanges();
    this.autoGroup.panel.nativeElement.scrollTop += this.el.nativeElement.offsetHeight;
  }

  addButtonClick(): void {
    this.quickAddClient.emit(this.addClientName);
  }

  resetState(): void {
    this.addClientName = null;
    this.isAddState = false;
  }

}
