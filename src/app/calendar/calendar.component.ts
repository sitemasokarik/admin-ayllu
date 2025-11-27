import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CalendarWidgetComponent } from '../calendar-widget/calendar-widget.component';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [BreadcrumbComponent, CalendarWidgetComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  title = 'Components / Calendar';


}
