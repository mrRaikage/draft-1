import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoComponent } from '../../shared/components/modal-info/modal-info.component';
import { ModalInfoInterface } from '../../shared/interfaces/modal-info.interface';
import { constantModalInfo } from '../../shared/constants/modal-info-constants';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  version = environment.version;
  currentDate = new Date();

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openModalInfo(name: string): void {
    this.dialog.open(ModalInfoComponent, {
      height: '554px',
      width: '470px',
      data: {
        title: constantModalInfo[name].title,
        text: constantModalInfo[name].text
      } as ModalInfoInterface
    });
  }
}
