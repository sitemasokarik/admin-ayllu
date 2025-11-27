import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [BreadcrumbComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements AfterViewInit {
  title = 'Progress';

  progressData = [
    { percentage: 10 },
    { percentage: 30 },
    { percentage: 50 },
    { percentage: 70 },
    { percentage: 90 }
  ];

  progressCircle = {
    percentage: 40,
    current: 0,
    rotation: 'rotate(45deg)'
  };

  constructor() { }

  ngAfterViewInit() {
    // Animate progress labels (if needed, but you can handle with CSS transitions in Angular cleanly)
    this.animateFloatingLabels();

    // Animate semi-circle progress bar
    this.animateCircleProgress();
  }

  animateFloatingLabels() {
    const labels = document.querySelectorAll('.floating-label') as NodeListOf<HTMLElement>;

    labels.forEach((label) => {
      const parent = label.closest('.progress-wrapper') as HTMLElement;
      const percentage = parent?.dataset?.['perc'] || '0%';

      label.style.setProperty('--left-percentage', percentage);
      label.style.animation = 'none'; // Reset animation
      label.offsetWidth; // Force reflow
      label.style.left = percentage; // Final position
      label.style.animation = 'animateFloatingLabel 1s ease forwards';
    });
  }

  animateCircleProgress() {
    const duration = 3000;
    const start = performance.now();

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const currentValue = Math.floor(progress * this.progressCircle.percentage);
      const rotation = 45 + (currentValue * 1.8);

      this.progressCircle.current = currentValue;
      this.progressCircle.rotation = `rotate(${rotation}deg)`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }
}
