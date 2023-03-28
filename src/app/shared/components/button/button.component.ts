import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() buttonStyleType: string;
  @Input() label: string;
  @Input() disabled = false;
  @Input() spinner = false;
  @Input() spinnerColor = 'white';
  /** green, red, purple, white */
  @Input() style;
  @Output() btnClick = new EventEmitter();

}
