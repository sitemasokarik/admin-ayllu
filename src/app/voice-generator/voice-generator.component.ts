import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-voice-generator',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './voice-generator.component.html',
  styleUrl: './voice-generator.component.css'
})
export class VoiceGeneratorComponent  {
  title = 'Voice Generator';
  constructor() { }

  audioSrc = 'assets/audio/sample.mp3';
  isPlaying = false;

  audio = new Audio();

  playAudio() {
    this.audio.src = this.audioSrc;
    this.audio.load();
    this.audio.play();
    this.isPlaying = true;
  }

  pauseAudio() {
    this.audio.pause();
    this.isPlaying = false;
  }
}
