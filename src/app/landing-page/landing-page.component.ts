import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import Swal from 'sweetalert2';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  blogForm: FormGroup;
  blogID!: number;
  loading: boolean = true;

  constructor(private fb: FormBuilder, private userService: UserService) {

    this.blogForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagenes: [''],                  
      valores: this.fb.array([]),
      imagenesUrls: this.fb.array([]), 
    });
  }

  ngOnInit(): void {
    const id = 1;

    this.userService.getBlogById(id).subscribe({
      next: (res: any) => {

        const data = res.data;
        this.blogID = data.blogID;

        this.blogForm.patchValue({
          titulo: data.titulo,
          descripcion: data.descripcion,
          imagenes: data.imagenes || ''  
        });

        data.valores?.forEach((v: any) => this.addValor(v));
        data.imagenesUrls?.forEach((url: string) => this.addImagen(url));
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
        Swal.fire('Error', 'No se pudo cargar el blog', 'error');
      }
    });
  }

  // GETTERS
  get valores(): FormArray {
    return this.blogForm.get('valores') as FormArray;
  }

  get imagenesUrls(): FormArray {
    return this.blogForm.get('imagenesUrls') as FormArray;
  }

  // VALORES
  addValor(data: any = { nombre: '', descripcion: '' }) {
    this.valores.push(
      this.fb.group({
        nombre: [data.nombre],
        descripcion: [data.descripcion]
      })
    );
  }

  removeValor(index: number) {
    this.valores.removeAt(index);
  }

  // IMÁGENES
  addImagen(url: string = '') {
    this.imagenesUrls.push(new FormControl(url));
  }

  removeImagen(index: number) {
    this.imagenesUrls.removeAt(index);
  }

  saveChanges() {
    if (this.blogForm.invalid) {
      Swal.fire('Atención', 'Completa los campos correctamente', 'warning');
      return;
    }

    const body = {
      blogID: this.blogID,
      titulo: this.blogForm.value.titulo,
      descripcion: this.blogForm.value.descripcion,

      imagenes: this.blogForm.value.imagenes, 
      imagenesUrls: this.blogForm.value.imagenesUrls || [],

      valores: this.blogForm.value.valores,
      usuarioModificacion: "Admin"
    };

    this.userService.updateBlog(body).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Blog actualizado correctamente', 'success');
      },
      error: err => {
        console.error(err);
        Swal.fire('Error', 'No se pudo actualizar el blog', 'error');
      }
    });
  }
}
