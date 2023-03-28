import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dropzone-file',
  templateUrl: './dropzone-file.component.html',
  styleUrls: ['./dropzone-file.component.scss']
})
export class DropzoneFileComponent implements OnInit {

  dropAreaClass: boolean;
  @Input() label: string;

  @Output() file = new EventEmitter<File>();

  @HostListener('dragover', ['$event'])
  onDragOver(event: any): void {
    this.dropAreaClass = true;
    event.preventDefault();
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(event: any): void {
    this.dropAreaClass = true;
    event.preventDefault();
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: any): void {
    this.dropAreaClass = false;
    event.preventDefault();
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: any): void {
    this.dropAreaClass = false;
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      this.file.emit(event.dataTransfer.files[0]);
    }
  }

  constructor() { }

  ngOnInit(): void {}

}
