import { useState, useEffect } from 'react';
import { Contact, ContactFormData } from '../types/contacts';
import { contactsStorage } from '../utils/contactsStorage';

export const ContactsPage = () => {
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
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-[#1CC5B8] to-[#7D4AE8] text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">Gestión de Contactos</h1>
          <p className="mt-2 text-lg opacity-90">Administra tus contactos de wallet</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar contactos por nombre o dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border-2 border-[#1CC5B8]/20 rounded-lg focus:border-[#1CC5B8] focus:outline-none text-lg"
            />
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#2ECC71] to-[#1CC5B8] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 whitespace-nowrap"
          >
            + Agregar Contacto
          </button>
        </div>

        {isFormOpen && (
          <div className="mb-6 bg-gradient-to-br from-[#1CC5B8]/5 to-[#7D4AE8]/5 p-6 rounded-xl border-2 border-[#1CC5B8]/20">
            <form onSubmit={handleSubmit}>
              <h3 className="text-2xl font-bold mb-4 text-[#7D4AE8]">
                {editingContact ? 'Editar Contacto' : 'Nuevo Contacto'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#7D4AE8]">Nombre del Contacto</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border-2 border-[#1CC5B8]/20 rounded-lg focus:border-[#1CC5B8] focus:outline-none"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#7D4AE8]">Dirección de Wallet</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-3 border-2 border-[#1CC5B8]/20 rounded-lg focus:border-[#1CC5B8] focus:outline-none font-mono text-sm"
                    placeholder="0x..."
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#1CC5B8] to-[#7D4AE8] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  {editingContact ? '💾 Actualizar' : '📥 Guardar'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg border border-[#1CC5B8]/20">
          <div className="p-6 border-b border-[#1CC5B8]/20">
            <h2 className="text-2xl font-bold text-[#7D4AE8]">Lista de Contactos</h2>
            <p className="text-gray-600 mt-1">{filteredContacts.length} contactos encontrados</p>
          </div>
          
          <div className="p-6">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-xl text-gray-500 mb-2">
                  {searchTerm ? 'No se encontraron contactos' : 'No hay contactos guardados'}
                </p>
                <p className="text-gray-400">
                  {searchTerm ? 'Intenta con otro término de búsqueda' : 'Agrega tu primer contacto para comenzar'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContacts.map(contact => (
                  <div key={contact.id} className="bg-gradient-to-br from-[#1CC5B8]/5 to-[#7D4AE8]/5 p-5 rounded-xl border-2 border-[#1CC5B8]/20 hover:border-[#1CC5B8]/40 transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-[#7D4AE8] mb-1">{contact.name}</h4>
                        <p className="text-xs font-mono text-gray-600 break-all bg-white/50 p-2 rounded">
                          {contact.address}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>Creado: {contact.createdAt.toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(contact.address)}
                        className="flex-1 px-3 py-2 bg-[#1CC5B8] text-white rounded-lg hover:bg-[#1CC5B8]/80 transition-all duration-300 text-sm font-semibold"
                        title="Copiar dirección"
                      >
                        📋 Copiar
                      </button>
                      <button
                        onClick={() => handleEdit(contact)}
                        className="flex-1 px-3 py-2 bg-[#7D4AE8] text-white rounded-lg hover:bg-[#7D4AE8]/80 transition-all duration-300 text-sm font-semibold"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="flex-1 px-3 py-2 bg-[#E74C3C] text-white rounded-lg hover:bg-[#E74C3C]/80 transition-all duration-300 text-sm font-semibold"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};