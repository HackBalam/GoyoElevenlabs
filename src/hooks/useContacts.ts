/* 
Hook personalizado para manejar contactos en React.
Encapsula la lógica de lectura, escritura y búsqueda de contactos.
*/

import { useState, useEffect } from 'react';
import { Contact, ContactFormData } from '../types/contacts';
import { contactsStorage } from '../utils/contactsStorage';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const loadContacts = () => {
    const storedContacts = contactsStorage.getContacts();
    setContacts(storedContacts);
  };

  const addContact = (contactData: ContactFormData): Contact => {
    const newContact = contactsStorage.addContact(contactData);
    loadContacts();
    return newContact;
  };

  const updateContact = (id: string, updates: Partial<ContactFormData>): Contact | null => {
    const updatedContact = contactsStorage.updateContact(id, updates);
    loadContacts();
    return updatedContact;
  };

  const deleteContact = (id: string): boolean => {
    const success = contactsStorage.deleteContact(id);
    if (success) loadContacts();
    return success;
  };

  const findContactByAddress = (address: string): Contact | null => {
    return contactsStorage.findContactByAddress(address);
  };

  const findContactsByName = (name: string): Contact[] => {
    return contactsStorage.findContactsByName(name);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    findContactByAddress,
    findContactsByName,
    loadContacts
  };
};