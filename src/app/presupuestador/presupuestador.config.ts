// src/app/presupuestador/presupuestador.config.ts
export const PresupuestadorConfig = {
  limitesCategorias: {
    coctel: 1,
    entrada: 1,
    fondo: 2,
    entremeses: 2
  },
  garantia: 500,
  personal: 100, // cargo fijo de personal de servicio (no va en el menú por invitado)
  personalEquipoIncluido: [
    'Personal de cocina',
    '1 mozo cada 20 invitados',
    '1 mozo para la atención de los novios',
    'Meitre',
    'Seguridad en puerta principal del Club para controlar el ingreso de invitados',
    'Anfitriona para dirigir a los invitados en el área de ascensores',
    'Supervisor/a del evento',
    'Ama de llaves para el aseo de los SS.HH. (incluyen todos los útiles de aseo)',
    'Maestro de Ceremonias',
  ],
  personalDjIncluido: [
    '4 parlantes de 15 pulgadas marca JBL',
    '1 consola de audio marca Berengher de 6 canales',
    '08 tachos led para ambientación (baño de color)',
    '2 micrófonos inalámbricos',
    '2 esferas de luz',
  ],
};
