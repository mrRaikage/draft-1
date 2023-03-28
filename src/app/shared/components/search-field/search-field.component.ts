import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss']
})
export class SearchFieldComponent {

  @Input() placeholder = '';
  @Input() filterValue: string;
  @Input() searchFieldClass: string;

  @Output() applyFilter = new EventEmitter<string>();

  constructor() { }

  touchApplyFilter(event: KeyboardEvent): void {
    this.applyFilter.emit((event.target as HTMLInputElement).value);
  }
}
