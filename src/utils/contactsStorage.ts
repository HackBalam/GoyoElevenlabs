/* 
Módulo para manejar contactos usando localStorage.
Permite obtener, guardar, agregar, actualizar, eliminar y buscar contactos.
*/

import { Contact, ContactFormData, ContactsStorage } from '../types/contacts';

const CONTACTS_STORAGE_KEY = 'goyoIA_contacts'; // Clave única usada en localStorage para guardar los contactos

export const contactsStorage = {
  getContacts(): Contact[] {
    try {
      const stored = localStorage.getItem(CONTACTS_STORAGE_KEY);
      if (!stored) return [];
      
      const data: ContactsStorage = JSON.parse(stored);
      return data.contacts.map(contact => ({
        ...contact,
        createdAt: new Date(contact.createdAt),
        updatedAt: new Date(contact.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading contacts:', error);
      return [];
    }
  },

  saveContacts(contacts: Contact[]): void {
    try {
      const data: ContactsStorage = {
        contacts,
        lastUpdated: new Date()
      };
      localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving contacts:', error);
    }
  },

  addContact(contactData: ContactFormData): Contact {
    const newContact: Contact = {
      id: crypto.randomUUID(),
      name: contactData.name.trim(),
      address: contactData.address.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const contacts = this.getContacts();
    contacts.push(newContact);
    this.saveContacts(contacts);
    
    return newContact;
  },

  updateContact(id: string, updates: Partial<ContactFormData>): Contact | null {
    const contacts = this.getContacts();
    const contactIndex = contacts.findIndex(c => c.id === id);
    
    if (contactIndex === -1) return null;

    const updatedContact = {
      ...contacts[contactIndex],
      ...updates,
      updatedAt: new Date()
    };

    contacts[contactIndex] = updatedContact;
    this.saveContacts(contacts);
    
    return updatedContact;
  },

  deleteContact(id: string): boolean {
    const contacts = this.getContacts();
    const filteredContacts = contacts.filter(c => c.id !== id);
    
    if (filteredContacts.length === contacts.length) return false;
    
    this.saveContacts(filteredContacts);
    return true;
  },

  findContactByAddress(address: string): Contact | null {
    const contacts = this.getContacts();
    return contacts.find(c => 
      c.address.toLowerCase() === address.toLowerCase()
    ) || null;
  },

  findContactsByName(name: string): Contact[] {
    const contacts = this.getContacts();
    const searchTerm = name.toLowerCase();
    return contacts.filter(c => 
      c.name.toLowerCase().includes(searchTerm)
    );
  }
};