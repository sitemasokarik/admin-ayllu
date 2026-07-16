import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import Quill from 'quill';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-add-blog',
  standalone: true,
  imports: [BreadcrumbComponent, RouterLink,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-blog.component.html',
  styleUrl: './add-blog.component.css'
})
export class AddBlogComponent implements AfterViewInit, OnInit {
  title = 'Add Blog';
  latestBlogs = [
    {
      image: 'assets/images/blog/blog1.png',
      title: 'How to hire a right business executive for your company',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti, fuga necessitatibus fugiat adipisci quidem eveniet enim minus.'
    },
    {
      image: 'assets/images/blog/blog2.png',
      title: 'The Gig Economy: Adapting to a Flexible Workforce',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti, fuga necessitatibus fugiat adipisci quidem eveniet enim minus.'
    },
    {
      image: 'assets/images/blog/blog3.png',
      title: 'The Future of Remote Work: Strategies for Success',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti, fuga necessitatibus fugiat adipisci quidem eveniet enim minus.'
    },
    {
      image: 'assets/images/blog/blog4.png',
      title: 'Lorem ipsum dolor sit amet consectetur adipisicing.',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti, fuga necessitatibus fugiat adipisci quidem eveniet enim minus.'
    },
    {
      image: 'assets/images/blog/blog5.png',
      title: 'How to hire a right business executive for your company',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti, fuga necessitatibus fugiat adipisci quidem eveniet enim minus.'
    },
    {
      image: 'assets/images/blog/blog6.png',
      title: 'The Gig Economy: Adapting to a Flexible Workforce',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti, fuga necessitatibus fugiat adipisci quidem eveniet enim minus.'
    },
    {
      image: 'assets/images/blog/blog7.png',
      title: 'The Future of Remote Work: Strategies for Success',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores explicabo corrupti, fuga necessitatibus fugiat adipisci quidem eveniet enim minus.'
    },
  ];
  constructor() { }
  @ViewChild('editor', { static: true }) editorElement: ElementRef;

  ngOnInit() {
    const quill = new Quill(this.editorElement.nativeElement, {
      modules: {
        toolbar: '#toolbar-container'
      },
      placeholder: 'Compose an epic...',
      theme: 'snow'
    });
  }
  ngAfterViewInit() {
    const fileInput = document.getElementById("upload-file") as HTMLInputElement;
    const imagePreview = document.getElementById("uploaded-img__preview") as HTMLImageElement;
    const uploadedImgContainer = document.querySelector(".uploaded-img");
    const removeButton = document.querySelector(".uploaded-img__remove");

    fileInput.addEventListener("change", (e : any) => {
        if (e.target.files.length) {
        const src = URL.createObjectURL(e.target.files[0]);
        imagePreview.src = src;
        uploadedImgContainer.classList.remove('d-none');
        }
    });
    removeButton.addEventListener("click", () => {
        imagePreview.src = "";
        uploadedImgContainer.classList.add('d-none');
        fileInput.value = "";
    });

  }

}
