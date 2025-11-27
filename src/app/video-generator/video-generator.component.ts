import {  Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
declare var $: any;
@Component({
  selector: 'app-video-generator',
  standalone: true,
  imports: [BreadcrumbComponent,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './video-generator.component.html',
  styleUrls: ['./video-generator.component.css']
})
export class VideoGeneratorComponent   {
  title = 'Image Generator';
  imagePreviewUrl: string | ArrayBuffer | null = null;

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.imagePreviewUrl = e.target?.result;
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

}
