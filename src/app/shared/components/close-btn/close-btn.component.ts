import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-close-btn',
  templateUrl: './close-btn.component.html',
  styleUrls: ['./close-btn.component.scss']
})
export class CloseBtnComponent {
  @Output() btnClick = new EventEmitter<any>();
}
