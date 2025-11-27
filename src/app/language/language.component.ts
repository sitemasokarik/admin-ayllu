import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './language.component.html',
  styleUrl: './language.component.css'
})
export class LanguageComponent {
  title = 'Languages';
  constructor() { }
  languages = [
    { id: 1, name: 'English(Default)', active: true },
    { id: 2, name: 'Bangla', active: false },
    { id: 3, name: 'Bangla', active: false },
    { id: 4, name: 'Bangla', active: false },
    { id: 5, name: 'German', active: false },
    { id: 6, name: 'German', active: false },
    { id: 7, name: 'German', active: false },
    { id: 8, name: 'Hindi', active: false },
    { id: 9, name: 'Hindi', active: false }
  ];
  // Called when checkbox toggled
  toggleActive(language) {
    language.active = !language.active;
  }

  editLanguage(language) {
    console.log('Edit:', language);
    // open your modal or do your edit logic here
  }

  deleteLanguage(language) {
    console.log('Delete:', language);
    // implement delete logic here
  }

}
