import { APP_INITIALIZER, Provider } from '@angular/core';

const SWAL_TYPOGRAPHY_FIX = `
div.swal2-container .swal2-popup {
  font-size: 0.875rem !important;
  max-width: min(420px, calc(100vw - 2rem)) !important;
}
div.swal2-container .swal2-popup h2.swal2-title {
  font-size: 1.05rem !important;
  font-weight: 600 !important;
  line-height: 1.35 !important;
  padding: 1rem 1.25rem 0.35rem !important;
  margin: 0 !important;
}
div.swal2-container .swal2-popup .swal2-html-container {
  font-size: 0.8125rem !important;
  line-height: 1.45 !important;
  padding: 0.35rem 1.25rem 0.75rem !important;
  margin: 0 !important;
}
div.swal2-container .swal2-popup .swal2-styled {
  font-size: 0.8125rem !important;
  padding: 0.45rem 1.1rem !important;
}
div.swal2-container .swal2-popup.swal2-toast {
  font-size: 13px !important;
  padding: 0.55rem 0.85rem !important;
  width: max-content !important;
  max-width: min(320px, calc(100vw - 1.5rem)) !important;
  overflow: hidden !important;
  min-height: unset !important;
}
div.swal2-container .swal2-popup.swal2-toast h2.swal2-title {
  font-size: 13px !important;
  font-weight: 600 !important;
  line-height: 1.35 !important;
  margin: 0 0 0 0.4rem !important;
  padding: 0 !important;
  white-space: nowrap !important;
}
div.swal2-container .swal2-popup.swal2-toast .swal2-icon {
  transform: scale(0.5) !important;
  margin: 0 0.4rem 0 0 !important;
  width: 1.75em !important;
  height: 1.75em !important;
}
`;

export function injectSwalTypographyFix(): void {
  if (typeof document === 'undefined' || document.getElementById('ayllu-swal-typography-fix')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'ayllu-swal-typography-fix';
  style.textContent = SWAL_TYPOGRAPHY_FIX;
  document.head.appendChild(style);
}

export function provideSwalTypographyFix(): Provider {
  return {
    provide: APP_INITIALIZER,
    multi: true,
    useFactory: () => () =>
      import('sweetalert2').then(() => {
        injectSwalTypographyFix();
      }),
  };
}
