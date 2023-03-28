import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  @Input() disablePrevButton: boolean;
  @Input() disableNextButton: boolean;

  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
