import { Component, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import $ from 'jquery';
import 'datatables.net-dt';
import 'datatables.net-responsive-dt';

@Component({
  selector: 'app-cotizacion',
  standalone: true,
  imports: [BreadcrumbComponent, RouterLink, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cotizacion.component.html',
  styleUrl: './cotizacion.component.css'
})
export class CotizacionComponent implements AfterViewInit {

  title = 'Cotizaciones';

  dataTable: any;

  users = [
    {
      id: 1,
      date: '25 Jan 2024',
      imgSrc: 'assets/images/user-list/user-list1.png',
      name: 'Kathryn Murphy',
      email: 'osgoodwy@gmail.com',
      department: 'HR',
      position: 'Manager',
      status: 'Active'
    },
  ];

  ngAfterViewInit(): void {
    setTimeout(() => {

      this.dataTable = $('#myTable').DataTable({
        responsive: true,
        language: {
          url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        }
      });

    }, 100);
  }
}
