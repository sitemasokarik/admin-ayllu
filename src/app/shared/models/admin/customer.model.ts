export interface CustomerModel {
  tipoDocumento: string;
  numeroDocumento: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  telefonoSecundario: string;
  direccion: string;
  ciudad: string;
  pais: string;
  tipoCliente: string;
  observaciones: string;
  esVIP: boolean;
  fechaNacimiento: Date;
  usuarioCreacion: string;
}
