import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, input, output, signal } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserModel } from '../core/models/admin/user.model';

@Component({
  selector: 'ui-users',
  standalone: true,
  imports: [BreadcrumbComponent, RouterLink, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  evtGetDataDialog = output<UserModel>();
  evtDeleteObjectTable = output<UserModel>();
  evtToListTable = output<void>();
  evtViewUser = output<UserModel>();

  title = 'Usuarios';

  users = input.required<UserModel[]>();
  loadingTable = input.required<boolean>();

  pageSize = signal(10);
  currentPage = signal(1);
  searchTerm = signal('');
  selectAll = signal(false);
  selectedUsers = signal<{ [key: number]: boolean }>({});

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      return this.users();
    }
    return this.users().filter(user =>
      user.nombre.toLowerCase().includes(term) ||
      user.userName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.rolNombre.toLowerCase().includes(term)
    );
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredUsers().length / this.pageSize()) || 1;
  });

  startIndex = computed(() => {
    return (this.currentPage() - 1) * this.pageSize();
  });

  endIndex = computed(() => {
    const end = this.startIndex() + this.pageSize();
    return Math.min(end, this.filteredUsers().length);
  });

  paginatedUsers = computed(() => {
    return this.filteredUsers().slice(this.startIndex(), this.endIndex());
  });

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(total, start + 4);
      } else if (end === total) {
        start = Math.max(1, end - 4);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  });

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.resetPagination();
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.resetPagination();
  }

  private resetPagination(): void {
    this.currentPage.set(1);
    this.selectAll.set(false);
    this.selectedUsers.set({});
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  toggleSelectAll(): void {
    const users = this.paginatedUsers();
    const isSelectAll = this.selectAll();
    const selected = { ...this.selectedUsers() };
    for (const user of users) {
      selected[user.usuarioID] = isSelectAll;
    }
    this.selectedUsers.set(selected);
  }

  onSelectUser(userId: number, checked: boolean): void {
    const selected = { ...this.selectedUsers() };
    selected[userId] = checked;
    this.selectedUsers.set(selected);
  }

  onSelectAllChange(checked: boolean): void {
    this.selectAll.set(checked);
    this.toggleSelectAll();
  }

  onView(user: UserModel): void {
    this.evtViewUser.emit(user);
  }

  onEdit(user: UserModel): void {
    this.evtGetDataDialog.emit(user);
  }

  onDelete(user: UserModel): void {
    this.evtDeleteObjectTable.emit(user);
  }
}
