import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';

import { AutoFocusDirective } from './directives/auto-focus.directive';
import { TokenInterceptor } from './interceptors/http-token.interceptor';
import { PermissionGuard } from './guards/permission.guard';
import { HeaderComponent } from './components/header/header.component';
import { UserPanelComponent } from './components/user-panel/user-panel.component';
import { ChipComponent } from './components/chip/chip.component';
import { TableHeaderActionsComponent } from './components/table-header-actions/table-header-actions.component';
import { TableRowActionsComponent } from './components/table-row-actions/table-row-actions.component';
import { TwoDigitDecimaNumberDirective } from './utils/validators/currency-validator';
import { InputComponent } from './components/form-controls/input/input.component';
import { EmptyContentComponent } from './components/empty-content/empty-content.component';
import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component';
import { ButtonComponent } from './components/button/button.component';
import { TextareaComponent } from './components/form-controls/textarea/textarea.component';
import { DatePickerComponent } from './components/form-controls/date-picker/date-picker.component';
import { SelectOptComponent } from './components/form-controls/select-opt/select-opt.component';
import { InputAmountComponent } from './components/form-controls/input-amount/input-amount.component';
import { ButtonDropDownComponent } from './components/button-drop-down/button-drop-down.component';
import { ModalFeedbackComponent } from './components/modal-feedback/modal-feedback.component';
import { ModalInfoComponent } from './components/modal-info/modal-info.component';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { WarningComponent } from './components/warning/warning.component';
import { SelectTaxRateComponent } from './components/form-controls/select-tax-rate/select-tax-rate.component';
import { InputFileComponent } from './components/input-file/input-file.component';
import { InputPercentComponent } from './components/input-percent/input-percent.component';
import { MobileAddButtonComponent } from './components/mobile-add-button/mobile-add-button.component';
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SelectOptGroupAutocompleteComponent } from './components/form-controls/select-opt-group-autocomplete/select-opt-group-autocomplete.component';
import { SelectOptAutocompleteComponent } from './components/form-controls/select-opt-autocomplete/select-opt-autocomplete.component';
import { EditableTableComponent } from './components/editable-table/editable-table.component';
import { MatTableModule } from '@angular/material/table';
import { DropzoneFileComponent } from './components/dropzone-file/dropzone-file.component';
import { SelectOptGroupQuickAddComponent } from './components/form-controls/select-opt-group-quick-add/select-opt-group-quick-add.component';
import { QuickAddPriceBookComponent } from './components/form-controls/select-opt-group-quick-add/components/quick-add-price-book/quick-add-price-book.component';
import { QuickAddClientComponent } from './components/form-controls/select-opt-group-quick-add/components/quick-add-client/quick-add-client.component';
import { QuickAddOrganizationComponent } from './components/form-controls/select-opt-group-quick-add/components/quick-add-organization/quick-add-organization.component';
import { QuickAddAccountComponent } from './components/form-controls/select-opt-group-quick-add/components/quick-add-account/quick-add-account.component';
import { CheckoutButtonComponent } from './components/checkout-button/checkout-button.component';
import { CloseBtnComponent } from './components/close-btn/close-btn.component';
import { AutocompletePositionDirective } from './directives/autocomplete-position.directive';
import { CheckboxComponent } from './components/form-controls/checkbox/checkbox.component';
import { EllipsisTooltipDirective } from './directives/ellipsis-tooltip.directive';
import { SelectMultiWithSearchComponent } from './components/form-controls/select-multi-with-search/select-multi-with-search.component';
import { PaginatorComponent } from './components/paginator/paginator.component';

const components = [
  HeaderComponent,
  UserPanelComponent,
  ChipComponent,
  TableHeaderActionsComponent,
  TableRowActionsComponent,
  TwoDigitDecimaNumberDirective,
  InputComponent,
  EmptyContentComponent,
  ButtonComponent,
  ModalConfirmComponent,
  TextareaComponent,
  DatePickerComponent,
  SelectOptComponent,
  InputAmountComponent,
  InputAmountComponent,
  ButtonDropDownComponent,
  ModalFeedbackComponent,
  ModalInfoComponent,
  SearchFieldComponent,
  WarningComponent,
  SelectTaxRateComponent,
  InputFileComponent,
  InputPercentComponent,
  MobileAddButtonComponent,
  SelectOptGroupAutocompleteComponent,
  SelectOptAutocompleteComponent,
  MobileHeaderComponent,
  SpinnerComponent,
  EditableTableComponent,
  SelectOptGroupQuickAddComponent,
  DropzoneFileComponent,
  SelectOptGroupQuickAddComponent,
  QuickAddPriceBookComponent,
  QuickAddClientComponent,
  QuickAddOrganizationComponent,
  QuickAddAccountComponent,
  CheckoutButtonComponent,
  AutoFocusDirective,
  CloseBtnComponent,
  AutocompletePositionDirective,
  CheckboxComponent,
  EllipsisTooltipDirective,
  SelectMultiWithSearchComponent,
];

const modules = [
  CommonModule,
  ToastrModule.forRoot(),
  RouterModule,
  MatMenuModule,
  NgxSkeletonLoaderModule,
  MatFormFieldModule,
  ReactiveFormsModule,
  MatButtonModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatDatepickerModule,
  MatSelectModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule,
  PdfViewerModule,
  FormsModule,
  CurrencyMaskModule,
  MatExpansionModule,
  MatListModule,
  MatAutocompleteModule,
  MatTableModule,
  MatTooltipModule,
  MatSortModule,
  MatChipsModule
];

@NgModule({
  declarations: [components, PaginatorComponent],
  imports: [modules],
  exports: [components, modules, PaginatorComponent],
  providers: [
    PermissionGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
})
export class SharedModule { }
