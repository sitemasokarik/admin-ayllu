import {
  Component,
  ContentChild,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminTableBodyDirective } from './admin-table-body.directive';

@Component({
  selector: 'app-admin-table-shell',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './admin-table-shell.component.html',
  styleUrl: './admin-table-shell.component.css',
})
export class AdminTableShellComponent implements OnChanges {
  @Input() data: unknown[] = [];
  @Input() loading = false;
  @Input() filterFields: string[] = [];
  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];
  @Input() emptyMessage = 'Sin registros para mostrar';

  @ContentChild(AdminTableBodyDirective) bodyTpl?: AdminTableBodyDirective;

  searchTerm = '';
  pageSize = 10;
  currentPage = 1;
  sortField: string | null = 'fechaCreacion';
  sortDirection: 'asc' | 'desc' = 'desc';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.clampCurrentPage();
    }
  }

  get filteredRows(): unknown[] {
    const term = this.searchTerm.trim().toLowerCase();
    let rows = this.data;

    if (term) {
      const fields = this.filterFields.length
        ? this.filterFields
        : this.data[0]
          ? Object.keys(this.data[0] as object)
          : [];

      rows = this.data.filter((row) =>
        fields.some((field) => {
          const value = this.readField(row, field);
          return value != null && String(value).toLowerCase().includes(term);
        })
      );
    }

    return this.sortRows(rows);
  }

  get paginatedRows(): unknown[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  toggleSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
  }

  sortIcon(field: string): string {
    if (this.sortField !== field) return 'solar:sort-vertical-linear';
    return this.sortDirection === 'asc' ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear';
  }

  private sortRows(rows: unknown[]): unknown[] {
    if (!this.sortField) return rows;
    const field = this.sortField;
    const dir = this.sortDirection === 'asc' ? 1 : -1;

    return [...rows].sort((a, b) => {
      const av = this.readField(a, field);
      const bv = this.readField(b, field);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;

      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * dir;
      }

      const ad = Date.parse(String(av));
      const bd = Date.parse(String(bv));
      if (!Number.isNaN(ad) && !Number.isNaN(bd)) {
        return (ad - bd) * dir;
      }

      return String(av).localeCompare(String(bv), 'es', { sensitivity: 'base' }) * dir;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize));
  }

  get pageReport(): string {
    const total = this.filteredRows.length;
    if (!total) {
      return '0 registros';
    }
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, total);
    return `${start}–${end} de ${total}`;
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const windowSize = 5;
    let start = Math.max(1, current - Math.floor(windowSize / 2));
    let end = Math.min(total, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  onPageSizeChange(): void {
    this.clampCurrentPage();
  }

  goToPage(page: number): void {
    this.currentPage = Math.min(Math.max(page, 1), this.totalPages);
  }

  private clampCurrentPage(): void {
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
  }

  private readField(row: unknown, field: string): unknown {
    return field.split('.').reduce<unknown>((acc, key) => {
      if (acc == null || typeof acc !== 'object') {
        return undefined;
      }
      return (acc as Record<string, unknown>)[key];
    }, row);
  }
}
