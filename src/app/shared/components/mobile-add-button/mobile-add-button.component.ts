import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mobile-add-button',
  templateUrl: './mobile-add-button.component.html',
  styleUrls: ['./mobile-add-button.component.scss']
})
export class MobileAddButtonComponent implements OnInit {

  @Input() buttonStyleClass: string;

  constructor() { }

  ngOnInit(): void {
  }

}
