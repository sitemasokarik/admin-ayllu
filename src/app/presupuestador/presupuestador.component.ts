import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth.service';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-presupuestador',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BreadcrumbComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './presupuestador.component.html',
  styleUrl: './presupuestador.component.css'
})
export class PresupuestadorComponent {

  title = 'Presupuestador';

  onSubmit(): void {

  }
}
