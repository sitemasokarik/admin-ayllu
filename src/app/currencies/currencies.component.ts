import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Define the interface outside the component class
export interface CurrencyRow {
  id: number;
  name: string;
  symbol: string;
  code: string;
  default: string;
  active: boolean;
  hidden?: boolean;  // optional property to toggle row visibility
}

@Component({
  selector: 'app-currencies',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']  // fixed here
})
export class CurrenciesComponent {
  title = 'Currencies';

  rows: CurrencyRow[] = [
    { id: 1, name: 'Dollars(Default)', symbol: '$', code: 'USD', default: 'No', active: true },
    { id: 2, name: 'Taka', symbol: '৳', code: 'BDT', default: 'No', active: false },
    { id: 3, name: 'Rupee', symbol: '₹', code: 'INR', default: 'No', active: false },
    { id: 4, name: 'Dollars', symbol: '$', code: 'USD', default: 'No', active: false },
    { id: 5, name: 'Taka', symbol: '৳', code: 'BDT', default: 'No', active: false },
    { id: 6, name: 'Rupee', symbol: '₹', code: 'INR', default: 'No', active: false },
    { id: 7, name: 'Dollars', symbol: '$', code: 'USD', default: 'No', active: false },
    { id: 8, name: 'Taka', symbol: '৳', code: 'BDT', default: 'No', active: false },
    { id: 9, name: 'Rupee', symbol: '₹', code: 'INR', default: 'No', active: false }
  ];

  hideRow(index: number) {
    this.rows[index].hidden = true;
  }
}
