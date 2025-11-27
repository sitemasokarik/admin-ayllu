import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  title = 'Components / Card';

  cards = [
    {
      img: 'assets/images/card-component/card-img1.png',
      title: 'This is Card title',
      text: 'We quickly learn to fear and thus automatically avoid potentially stressful situations of all kinds, including the most common of all.',
      linkClass: 'btn text-primary-600 hover-text-primary px-0 py-10 d-inline-flex align-items-center gap-2',
      align: ''
    },
    {
      img: 'assets/images/card-component/card-img2.png',
      title: 'This is Card title',
      text: 'We quickly learn to fear and thus automatically avoid potentially stressful situations of all kinds, including the most common of all.',
      linkClass: 'btn btn-primary-600 px-12 py-10 d-inline-flex align-items-center gap-2',
      align: 'text-center'
    },
    {
      img: 'assets/images/card-component/card-img3.png',
      title: 'This is Card title',
      text: 'We quickly learn to fear and thus automatically avoid potentially stressful situations of all kinds, including the most common of all.',
      buttons: [
        {
          type: 'link',
          label: 'Read More',
          icon: 'iconamoon:arrow-right-2',
          classes: 'btn btn-primary-100 text-white text-primary-600 px-12 py-10 d-inline-flex align-items-center gap-2'
        },
        {
          type: 'button',
          label: 'Book Mark',
          icon: 'bx:bookmark-minus',
          classes: 'btn btn-warning-100 text-white text-warning-600 px-12 py-10 d-inline-flex align-items-center gap-2'
        }
      ],
      buttonContainerClass: 'd-flex flex-wrap align-items-center justify-content-end gap-3',
      align: 'text-end'
    },
    {
      img: 'assets/images/card-component/card-img4.png',
      title: 'This is Card title',
      text: 'We quickly learn to fear and thus automatically avoid potentially stressful situations of all kinds, including the most common of all.',
      buttons: [
        {
          type: 'button',
          label: '',
          icon: 'iconamoon:arrow-right-2',
          classes: 'btn btn-primary-600 px-12 py-10 d-inline-flex align-items-center gap-2'
        }
      ],
      align: 'text-center'
    }
  ];

  iconCards = [
    {
      icon: 'solar:medal-ribbons-star-bold',
      bgGradient: 'bg-gradient-purple',
      textColor: 'text-lilac-600',
      title: 'Brand Identity',
      text: 'Random Text gateway to the Original the Works Platform, & your unique blockchain gateway identity.',
      linkClass: 'btn text-lilac-600 hover-text-lilac px-0 py-0 mt-16 d-inline-flex align-items-center gap-2',
      align: ''
    },
    {
      icon: 'ri:computer-fill',
      bgGradient: 'bg-gradient-primary',
      textColor: 'text-primary-600',
      title: 'UI/UX Designer',
      text: 'Random Text gateway to the Original the Works Platform, & your unique blockchain gateway identity.',
      linkClass: 'btn text-primary-600 hover-text-primary px-0 py-10 d-inline-flex align-items-center gap-2',
      align: 'text-center'
    },
    {
      icon: 'fluent:toolbox-20-filled',
      bgGradient: 'bg-gradient-success',
      textColor: 'text-success-600',
      title: 'Business Strategy',
      text: 'Random Text gateway to the Original the Works Platform, & your unique blockchain gateway identity.',
      linkClass: 'btn text-success-600 hover-text-success px-0 py-10 d-inline-flex align-items-center gap-2',
      align: 'text-end'
    },
    {
      icon: 'ph:code-fill',
      bgGradient: 'bg-gradient-danger',
      textColor: 'text-danger-600',
      title: 'Business Strategy',
      text: 'Random Text gateway to the Original the Works Platform, & your unique blockchain gateway identity.',
      linkClass: 'btn text-danger-600 hover-text-danger px-0 py-10 d-inline-flex align-items-center gap-2',
      align: 'text-center'
    }
  ];

  overlayCards = [
    {
      img: 'assets/images/card-component/card-overlay-img1.png',
      title: 'This is Card title',
      text: 'We quickly learn to fear and thus automatically avoid potentially stressful situations of all kinds, including the most common of all.',
      position: 'bottom-0 start-0',
      textPosition: 'position-absolute start-0 bottom-0 text-start'
    },
    {
      img: 'assets/images/card-component/card-overlay-img1.png',
      title: 'This is Card title',
      text: 'We quickly learn to fear and thus automatically avoid potentially stressful situations of all kinds, including the most common of all.',
      position: 'top-0 start-0',
      textPosition: 'position-absolute start-0 top-0 text-center'
    },
    {
      img: 'assets/images/card-component/card-overlay-img1.png',
      title: 'This is Card title',
      text: 'We quickly learn to fear and thus automatically avoid potentially stressful situations of all kinds, including the most common of all.',
      position: 'bottom-0 start-0',
      textPosition: 'position-absolute start-0 bottom-0 text-end'
    }
  ];

  headerFooterCards = [
    {
      header: true,
      headerTitle: 'Hi, Will Mart',
      headerButton: true,
      headerButtonIcon: 'mdi:times',
      bodyTitle: 'How to learn UI /UX Design',
      bodyText1: 'Intrinsically incubate intuitive opportunities and real-time potentialities for change for interoperable meta-itself the viewer\'s attention from the layout',
      footer: true
    },
    {
      header: false,
      bodyTitle: 'How to learn UI /UX Design',
      bodyText1: 'Intrinsically incubate intuitive opportunities and real-time potentialities for change for interoperable meta-itself the viewer\'s attention from the layout',
      bodyText2: 'Intrinsically incubate intuitive opportunities and real-time potentialities for change for interoperable',
      readMore: true
    },
    {
      header: true,
      headerTitle: 'How can I help you',
      headerSubtitle: 'Awesome Support',
      headerLink: true,
      bodyText1: 'Intrinsically incubate intuitive opportunities and real-time potentialities for change for interoperable meta-itself the viewer\'s attention from the layout',
      bodyText2: 'Intrinsically incubate intuitive opportunities and real-time potentialities for change for interoperable'
    }
  ];

  horizontalCards = [
    {
      img: 'assets/images/card-component/horizontal-card-img1.png',
      title: 'This is Card title',
      text: 'We quickly learn to fear and thus automatically avoid potentially stressful situations of all kinds, including the most common of all .',
      reverse: false
    },
    {
      img: 'assets/images/card-component/horizontal-card-img2.png',
      title: 'This is Card title',
      text: 'We quickly learn to fear and thus automatically avoid potentially stressful situations of all kinds, including the most common of all .',
      reverse: true
    },
    {
      img: 'assets/images/card-component/horizontal-card-img3.png',
      title: 'This is Card title',
      text: 'We quickly learn to fear and thus automatically avoid potentially stressful situations of all kinds, including the most common of all .',
      reverse: false
    },
    {
      img: 'assets/images/card-component/horizontal-card-img4.png',
      title: 'This is Card title',
      text: 'We quickly learn to fear and thus automatically avoid potentially stressful situations of all kinds, including the most common of all .',
      reverse: true
    }
  ];

  bgCards = [
    {
      icon: 'solar:medal-ribbons-star-bold',
      bgGradient: 'bg-gradient-purple',
      bgIcon: 'bg-lilac-600',
      title: 'Brand Identity',
      text: 'Random Text gateway to the Original the Works Platform, & your unique blockchain gateway identity.',
      linkClass: 'text-lilac-600 hover-text-lilac px-0 py-0 mt-16 d-inline-flex align-items-center gap-2',
      align: ''
    },
    {
      icon: 'ri:computer-fill',
      bgGradient: 'bg-gradient-primary',
      bgIcon: 'bg-primary-600',
      title: 'UI/UX Designer',
      text: 'Random Text gateway to the Original the Works Platform, & your unique blockchain gateway identity.',
      linkClass: 'text-primary-600 hover-text-primary px-0 py-10 d-inline-flex align-items-center gap-2',
      align: 'text-center'
    },
    {
      icon: 'fluent:toolbox-20-filled',
      bgGradient: 'bg-gradient-success',
      bgIcon: 'bg-success-600',
      title: 'Business Strategy',
      text: 'Random Text gateway to the Original the Works Platform, & your unique blockchain gateway identity.',
      linkClass: 'text-success-600 hover-text-success px-0 py-10 d-inline-flex align-items-center gap-2',
      align: 'text-end'
    },
    {
      icon: 'ph:code-fill',
      bgGradient: 'bg-gradient-danger',
      bgIcon: 'bg-danger-600',
      title: 'Business Strategy',
      text: 'Random Text gateway to the Original the Works Platform, & your unique blockchain gateway identity.',
      linkClass: 'text-danger-600 hover-text-danger px-0 py-10 d-inline-flex align-items-center gap-2',
      align: 'text-center'
    }
  ];

}
