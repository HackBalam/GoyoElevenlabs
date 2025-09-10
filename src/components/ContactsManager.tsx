/* 
Componente React para gestionar contactos.
Permite crear, editar, eliminar, buscar y listar contactos.
*/
import { useState, useEffect } from 'react';
import { Contact, ContactFormData } from '../types/contacts';
import { contactsStorage } from '../utils/contactsStorage';

export const ContactsManager = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({ name: '', address: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    const storedContacts = contactsStorage.getContacts();
    setContacts(storedContacts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.address.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (editingContact) {
      contactsStorage.updateContact(editingContact.id, formData);
    } else {
      contactsStorage.addContact(formData);
    }

    setFormData({ name: '', address: '' });
    setIsFormOpen(false);
    setEditingContact(null);
    loadContacts();
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({ name: contact.name, address: contact.address });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
      contactsStorage.deleteContact(id);
      loadContacts();
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', address: '' });
    setIsFormOpen(false);
    setEditingContact(null);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="contacts-manager p-4 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Gestión de Contactos</h2>
      
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Buscar contactos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Agregar Contacto
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold mb-2">
            {editingContact ? 'Editar Contacto' : 'Nuevo Contacto'}
          </h3>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Nombre:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Nombre del contacto"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Dirección de Wallet:</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="0x..."
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {editingContact ? 'Actualizar' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="contacts-list">
        {filteredContacts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            {searchTerm ? 'No se encontraron contactos que coincidan con la búsqueda' : 'No hay contactos guardados'}
          </p>
        ) : (
          <div className="space-y-2">
            {filteredContacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-white border rounded shadow-sm">
                <div className="flex-1">
                  <h4 className="font-semibold">{contact.name}</h4>
                  <p className="text-sm text-gray-600 font-mono">{contact.address}</p>
                  <p className="text-xs text-gray-400">
                    Creado: {contact.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(contact.address)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                    title="Copiar dirección"
                  >
                    Copiar
                  </button>
                  <button
                    onClick={() => handleEdit(contact)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};