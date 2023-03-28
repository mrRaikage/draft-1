import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss']
})
export class InputFileComponent implements OnInit {

  @Input() label: string;
  @Input() buttonStyleType: string;

  @Output() imgUrl = new EventEmitter<string>();
  @Output() file = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {}

  handleFileInput(e): void {
    const file = e.target.files.item(0);
    this.file.emit(file);
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imgUrl.emit(event.target.result);
    };
    reader.readAsDataURL(file);
  }

}
