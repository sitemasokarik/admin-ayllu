import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [BreadcrumbComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent implements AfterViewInit {
  title = 'Tags';
  constructor() { }

  ngAfterViewInit() {
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.remove-tag').forEach(element => {
        element.addEventListener('click', () => {
          element.closest('li')?.remove();
        });
      });
    });

  }
}
