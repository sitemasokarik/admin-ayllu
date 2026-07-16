import { Directive, TemplateRef } from '@angular/core';

export interface AdminTableBodyContext {
  rows: unknown[];
}

@Directive({
  selector: '[appAdminTableBody]',
  standalone: true,
})
export class AdminTableBodyDirective {
  constructor(public template: TemplateRef<AdminTableBodyContext>) {}
}
