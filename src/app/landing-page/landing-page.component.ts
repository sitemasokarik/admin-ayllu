import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

import { UserService } from '../../service/user.service';

import { AuthService } from '../../service/auth.service';

import Swal from 'sweetalert2';

import {
  buildLandingConfigPayload,
  createDefaultLandingConfig,
  LandingConfig,
  normalizeStatItem,
  PAGE_BANNER_LABELS,
  PageBanners,
  parseLandingConfig,
} from './landing-config.util';

type LandingTab = 'general' | 'mision-vision' | 'imagenes' | 'valores' | 'banners-stats';



@Component({

  selector: 'app-landing-page',

  standalone: true,

  imports: [CommonModule, FormsModule, BreadcrumbComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  templateUrl: './landing-page.component.html',

  styleUrl: './landing-page.component.css',

})

export class LandingPageComponent implements OnInit {

  title = 'Landing Page';

  loading = true;

  saving = false;

  fotoUploading = false;

  bannerUploading = false;

  activeTab: LandingTab = 'general';

  blogID = 0;



  blog = {

    titulo: '',

    resumen: '',

    descripcion: '',

    misionTitulo: '',

    misionTexto: '',

    visionTitulo: '',

    visionTexto: '',

    imagenesUrls: [] as string[],

    valores: [] as { nombre: string; descripcion: string }[],

  };

  landingConfig: LandingConfig = createDefaultLandingConfig();

  apiSupportsLandingConfig = true;

  configWarning = '';

  nuevoValor = { nombre: '', descripcion: '' };



  readonly tabs: { id: LandingTab; label: string; icon: string }[] = [

    { id: 'general', label: 'Nosotros (home + página)', icon: 'solar:document-text-bold' },

    { id: 'mision-vision', label: 'Misión y visión', icon: 'solar:target-bold' },

    { id: 'imagenes', label: 'Collage Nosotros', icon: 'solar:gallery-bold' },

    { id: 'banners-stats', label: 'Banners y stats', icon: 'solar:slider-vertical-bold' },

    { id: 'valores', label: 'Valores / pilares', icon: 'solar:star-bold' },

  ];

  readonly pageBannerLabels = PAGE_BANNER_LABELS;



  constructor(

    public userService: UserService,

    private authService: AuthService,

  ) {}



  ngOnInit(): void {

    this.loadBlog();

  }



  setTab(tab: LandingTab): void {

    this.activeTab = tab;

  }



  private applyBlogData(data: any): void {

    if (!data) {

      return;

    }



    this.blogID = data.blogID ?? data.BlogID ?? 0;

    this.blog = {

      titulo: data.titulo || data.Titulo || '',

      resumen: data.resumen || data.Resumen || '',

      descripcion: data.descripcion || data.Descripcion || '',

      misionTitulo: data.misionTitulo || data.MisionTitulo || '',

      misionTexto: data.misionTexto || data.MisionTexto || '',

      visionTitulo: data.visionTitulo || data.VisionTitulo || '',

      visionTexto: data.visionTexto || data.VisionTexto || '',

      imagenesUrls: [...(data.imagenesUrls || data.ImagenesUrls || [])],

      valores: (data.valores || data.Valores || []).map((v: any) => ({

        nombre: v.nombre || v.Nombre || '',

        descripcion: v.descripcion || v.Descripcion || '',

      })),

    };

    this.landingConfig = parseLandingConfig(data.landingConfig ?? data.LandingConfig);
    this.landingConfig.stats = this.landingConfig.stats.map((s) => normalizeStatItem(s));

    const hasConfigKey = data != null && ('landingConfig' in data || 'LandingConfig' in data);
    this.apiSupportsLandingConfig = hasConfigKey;
    this.configWarning = hasConfigKey
      ? ''
      : 'La API no expone landingConfig. Reinicia el backend local (dotnet run en DcodePe.Catering.Api) para aplicar el parche SQLite. Si persiste, detén la API, borra ayllu-backend/src/DcodePe.Catering.Api/Data/ayllu-dev.db y vuelve a iniciar.';

  }



  loadBlog(): void {

    this.loading = true;



    this.userService.getBlogById(1).subscribe({

      next: (res: any) => {

        const data = res?.data;

        if (data) {

          this.applyBlogData(data);

          this.loading = false;

          return;

        }

        this.loadFirstOrCreate();

      },

      error: () => this.loadFirstOrCreate(),

    });

  }



  private loadFirstOrCreate(): void {

    this.userService.getAllBlogs().subscribe({

      next: (res: any) => {

        const list = res?.data || [];

        if (list.length) {

          this.applyBlogData(list[0]);

          this.loading = false;

          return;

        }

        this.createDefaultBlog();

      },

      error: () => {

        if (this.authService.getToken()) {

          this.createDefaultBlog();

          return;

        }

        this.loading = false;

        Swal.fire('Error', 'No se pudo cargar la configuración de la landing. Inicia sesión de nuevo.', 'error');

      },

    });

  }



  private createDefaultBlog(): void {

    const user = this.authService.getUser();

    this.userService.createBlog({

      titulo: '¿Quiénes somos?',

      resumen: 'Creamos experiencias memorables para bodas, quinceaños, eventos corporativos y celebraciones familiares.',

      descripcion: 'Describe aquí la historia completa de Ayllu Eventos para la página Nosotros.',

      misionTitulo: 'Misión',

      misionTexto: 'Brindar experiencias gastronómicas y de organización excepcionales.',

      visionTitulo: 'Visión',

      visionTexto: 'Ser referentes en eventos y catering, reconocidos por calidad e innovación.',

      imagenesUrls: [],

      valores: [

        { nombre: 'Compromiso', descripcion: 'Trabajamos con pasión en cada evento.' },

        { nombre: 'Creatividad', descripcion: 'Diseñamos experiencias únicas.' },

        { nombre: 'Calidad', descripcion: 'Lo mejor en gastronomía y organización.' },

      ],

      usuarioCreacion: user?.nombre || user?.userName || 'Admin',

      estado: true,

    }).subscribe({

      next: (res: any) => {

        this.applyBlogData(res?.data);

        this.loading = false;

      },

      error: () => {

        this.loading = false;

        Swal.fire('Error', 'No se pudo inicializar la landing. Reinicia la API e intenta de nuevo.', 'error');

      },

    });

  }



  onImageSelected(event: Event): void {

    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) return;



    this.fotoUploading = true;

    this.userService.uploadMedia(file, 'blog').subscribe({

      next: (res) => {

        const url = res?.data?.url;

        if (url) this.blog.imagenesUrls.push(url);

        this.fotoUploading = false;

        (event.target as HTMLInputElement).value = '';

      },

      error: (err) => {

        this.fotoUploading = false;

        Swal.fire('Error', err?.error?.message || 'No se pudo subir la imagen', 'error');

      },

    });

  }



  removeImage(index: number): void {

    this.blog.imagenesUrls.splice(index, 1);

  }

  addHeroSlide(): void {
    this.landingConfig.heroSlides.push({
      tag: '',
      title: '',
      subtitle: '',
      imageUrl: '',
      orden: this.landingConfig.heroSlides.length,
      activo: true,
    });
  }

  removeHeroSlide(index: number): void {
    this.landingConfig.heroSlides.splice(index, 1);
  }

  onHeroImageSelected(event: Event, index: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.bannerUploading = true;
    this.userService.uploadMedia(file, 'blog').subscribe({
      next: (res) => {
        const url = res?.data?.url;
        if (url) this.landingConfig.heroSlides[index].imageUrl = url;
        this.bannerUploading = false;
        (event.target as HTMLInputElement).value = '';
      },
      error: (err) => {
        this.bannerUploading = false;
        Swal.fire('Error', err?.error?.message || 'No se pudo subir la imagen', 'error');
      },
    });
  }

  onPageBannerSelected(event: Event, key: keyof PageBanners): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.bannerUploading = true;
    this.userService.uploadMedia(file, 'blog').subscribe({
      next: (res) => {
        const url = res?.data?.url;
        if (url) this.landingConfig.pageBanners[key] = url;
        this.bannerUploading = false;
        (event.target as HTMLInputElement).value = '';
      },
      error: (err) => {
        this.bannerUploading = false;
        Swal.fire('Error', err?.error?.message || 'No se pudo subir la imagen', 'error');
      },
    });
  }

  clearPageBanner(key: keyof PageBanners): void {
    this.landingConfig.pageBanners[key] = '';
  }

  addStat(): void {
    this.landingConfig.stats.push({
      value: '+0',
      numericValue: 0,
      prefix: '+',
      suffix: '',
      label: 'Nueva estadística',
      animate: true,
    });
  }

  onStatAnimateChange(stat: { animate: boolean; value: string; numericValue?: number | null; prefix?: string; suffix?: string }): void {
    if (!stat.animate) {
      stat.numericValue = null;
      stat.prefix = '';
      stat.suffix = '';
      if (!stat.value?.trim()) {
        stat.value = '—';
      }
    } else if (stat.numericValue == null) {
      stat.numericValue = 0;
      stat.prefix = stat.prefix || '+';
    }
  }

  removeStat(index: number): void {
    this.landingConfig.stats.splice(index, 1);
  }

  resolveBannerPreview(url?: string): string {
    return url ? this.userService.resolveMediaUrl(url) : '';
  }



  addValor(): void {

    if (!this.nuevoValor.nombre.trim()) return;

    this.blog.valores.push({ ...this.nuevoValor });

    this.nuevoValor = { nombre: '', descripcion: '' };

  }



  removeValor(index: number): void {

    this.blog.valores.splice(index, 1);

  }



  save(): void {

    if (!this.blogID) {

      Swal.fire('Error', 'No hay registro de landing para guardar. Recarga la página.', 'error');

      return;

    }



    this.saving = true;

    const user = this.authService.getUser();



    this.userService.updateBlog({

      blogID: this.blogID,

      titulo: this.blog.titulo,

      resumen: this.blog.resumen,

      descripcion: this.blog.descripcion,

      misionTitulo: this.blog.misionTitulo,

      misionTexto: this.blog.misionTexto,

      visionTitulo: this.blog.visionTitulo,

      visionTexto: this.blog.visionTexto,

      imagenesUrls: this.blog.imagenesUrls,

      landingConfig: buildLandingConfigPayload(this.landingConfig),

      valores: this.blog.valores.map((v) => ({

        nombre: v.nombre,

        descripcion: v.descripcion,

      })),

      usuarioModificacion: user?.nombre || user?.userName || 'Admin',

    }).subscribe({

      next: () => {

        const hadBannerImages = this.landingConfig.heroSlides.some((s) => !!s.imageUrl?.trim())

          || Object.values(this.landingConfig.pageBanners).some((u) => !!u?.trim());

        this.userService.getBlogById(this.blogID).subscribe({

          next: (res: any) => {

            this.saving = false;

            const data = res?.data;

            const hasConfigKey = data != null && ('landingConfig' in data || 'LandingConfig' in data);

            if (hadBannerImages && !hasConfigKey) {

              Swal.fire({

                icon: 'warning',

                title: 'Backend desactualizado',

                html:

                  'Subiste banners pero el servidor <strong>no los guardó</strong>. ' +

                  'Despliega el backend nuevo (<code>scripts/deploy-monster-backend.ps1</code>) ' +

                  'y ejecuta <code>DB/monster-04-landing-config.sql</code> en WebMSSQL. ' +

                  'Luego vuelve a guardar aquí.',

              });

              return;

            }

            if (data) {

              this.applyBlogData(data);

            }

            Swal.fire({ icon: 'success', title: 'Guardado', text: 'Landing actualizada correctamente', timer: 1600, showConfirmButton: false });

          },

          error: () => {

            this.saving = false;

            Swal.fire({ icon: 'success', title: 'Guardado', text: 'Landing actualizada (no se pudo verificar banners)', timer: 2000, showConfirmButton: false });

          },

        });

      },

      error: (err) => {

        this.saving = false;

        Swal.fire('Error', err?.error?.message || 'No se pudo guardar la landing', 'error');

      },

    });

  }

}


