/* 
Este código define tres interfaces de TypeScript que sirven como modelos de datos:
Contact: cómo debe lucir un contacto completo (con id, nombre, dirección y fechas).
ContactFormData: los datos mínimos que un usuario debe ingresar en un formulario para crear o editar un contacto.
ContactsStorage: la estructura que guarda un conjunto de contactos y la fecha de la última actualización.
*/
export interface Contact {
  id: string;
  name: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactFormData {
  name: string;
  address: string;
}

export interface ContactsStorage {
  contacts: Contact[];
  lastUpdated: Date;
}