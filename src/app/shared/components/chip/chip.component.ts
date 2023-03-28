import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent {
  @Input() label: string;
  @Input() icon: string;
  @Input() mobile: boolean;

  classList = {
    sent: 'green',
    received: 'purple',
    paid: 'blue',
    approved: 'green',
    draft: 'purple',
    pending: 'purple',
    active: 'green',
    inactive: 'grey',
    complete: 'grey',
    inprogress: 'green',
    registered: 'green',
    invoiced: 'green'
  };

  get chipClass(): string {
    return this.classList[this.label.replace(/\s+/g, '').toLowerCase()];
  }
}
