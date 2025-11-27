import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import Tooltip from 'bootstrap/js/dist/tooltip';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [BreadcrumbComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent implements AfterViewInit {
  title = 'Tooltip';

  constructor() { }

  ngAfterViewInit() {
    const tooltipButtons = document.querySelectorAll('.tooltip-button');

    tooltipButtons.forEach(button => {
      const tooltipContent = button.parentElement?.querySelector('.my-tooltip')?.innerHTML || '';

      // Initialize Bootstrap tooltip
      const bootstrapTooltip = new Tooltip(button, {
        title: tooltipContent,
        trigger: 'hover',
        html: true
      });

      // On mouseenter, refresh tooltip instance
      button.addEventListener('mouseenter', () => {
        const currentTooltip = Tooltip.getInstance(button);

        if (currentTooltip) {
          currentTooltip.dispose();
        }

        const newTooltip = new Tooltip(button, {
          title: tooltipContent,
          trigger: 'hover',
          html: true
        });

        newTooltip.show();
      });
    });
  }
}
