import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { IOrganizationsState } from '../../../../../../core/store/organizations/organizations.reducer';
import * as orgActions from '../../../../../../core/store/organizations/organizations.actions';
import * as orgSelectors from '../../../../../../core/store/organizations/organizations.selectors';

@Component({
  selector: 'app-quick-add-organization',
  templateUrl: './quick-add-organization.component.html',
  styleUrls: ['./quick-add-organization.component.scss']
})
export class QuickAddOrganizationComponent implements OnInit {

  isAddState: boolean;
  addOrgName: string;
  spinner$ = this.orgStore.select(orgSelectors.selectIsSpinnerStarted);

  @Input() autoGroup: MatAutocomplete | MatSelect;

  @Input() set panelIsOpened(e) {
    this.resetState();
  }

  @ViewChild('el') el: ElementRef;

  constructor(
    private orgStore: Store<IOrganizationsState>,
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
    this.orgStore.dispatch(orgActions.addOrganization({ orgName: this.addOrgName }));

    this.orgStore.select(orgSelectors.selectIsSpinnerStarted).pipe(filter(res => !res)).subscribe(() => {
      this.isAddState = false;
    });
  }

  resetState(): void {
    this.isAddState = false;
    this.addOrgName = null;
  }

}
