import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { RichTextEditorComponent } from '../rich-text-editor/rich-text-editor.component';

declare var Quill: any;

@Component({
  selector: 'app-terms-condition',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, RichTextEditorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.css'] // Use plural if CSS is array-based
})
export class TermsConditionComponent {
  title = 'Terms & Conditions';

}
