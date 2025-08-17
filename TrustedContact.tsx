import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, MessageSquare, Edit3, Save, User, Plus, Trash2, Star } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  isDefault?: boolean;
}

export const TrustedContact: React.FC = () => {
  const { setCurrentScreen, state, setTrustedContacts } = useApp();
  const { classes } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editingContact, setEditingContact] = useState<TrustedContact | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const contacts = state.trustedContacts || [];

  const handleSave = () => {
    if (name.trim() && phone.trim()) {
      const newContact: TrustedContact = {
        id: editingContact?.id || Date.now().toString(),
        name: name.trim(),
        phone: phone.trim(),
        isDefault: editingContact?.isDefault || contacts.length === 0
      };

      let updatedContacts;
      if (editingContact) {
        updatedContacts = contacts.map(c => c.id === editingContact.id ? newContact : c);
      } else {
        updatedContacts = [...contacts, newContact];
      }

      setTrustedContacts(updatedContacts);
      setIsEditing(false);
      setEditingContact(null);
      setName('');
      setPhone('');
    }
  };

  const handleEdit = (contact: TrustedContact) => {
    setEditingContact(contact);
    setName(contact.name);
    setPhone(contact.phone);
    setIsEditing(true);
  };

  const handleDelete = (contactId: string) => {
    const updatedContacts = contacts.filter(c => c.id !== contactId);
    // If we deleted the default contact, make the first remaining one default
    if (updatedContacts.length > 0 && !updatedContacts.some(c => c.isDefault)) {
      updatedContacts[0].isDefault = true;
    }
    setTrustedContacts(updatedContacts);
  };

  const handleSetDefault = (contactId: string) => {
    const updatedContacts = contacts.map(c => ({
      ...c,
      isDefault: c.id === contactId
    }));
    setTrustedContacts(updatedContacts);
  };

  const handleCall = (contact: TrustedContact) => {
    window.open(`tel:${contact.phone}`, '_self');
  };

  const handleWhatsApp = (contact: TrustedContact) => {
    const message = "Hi, I need someone to talk to right now. Are you available?";
    const whatsappUrl = `https://wa.me/${contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const startAddNew = () => {
    setEditingContact(null);
    setName('');
    setPhone('');
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingContact(null);
    setName('');
    setPhone('');
  };

  return (
    <div className={`min-h-screen ${classes.background} relative z-10`}>
      <div className="p-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentScreen('emergency-toolkit')}
          className={`mb-6 p-3 ${classes.card} rounded-full shadow-lg`}
        >
          <ArrowLeft size={20} className={classes.text} />
        </motion.button>

        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className={`text-3xl font-light ${classes.text} mb-2`}>Trusted Contacts</h1>
              <p className={`${classes.text} opacity-70`}>
                Your emergency contacts for immediate support
              </p>
            </div>
            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startAddNew}
                className={`p-3 bg-gradient-to-r ${classes.gradient} text-white rounded-full shadow-lg`}
              >
                <Plus size={20} />
              </motion.button>
            )}
          </div>

          {isEditing ? (
            <motion.div
              className={`${classes.card} p-6 rounded-2xl shadow-lg`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-3 bg-gradient-to-r ${classes.gradient} rounded-full`}>
                  <User size={24} className="text-white" />
                </div>
                <h2 className={`text-xl font-medium ${classes.text}`}>
                  {editingContact ? 'Edit Contact' : 'Add Contact'}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${classes.text} mb-2`}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter contact name"
                    className={`w-full p-3 rounded-xl border-0 focus:ring-2 focus:ring-purple-300 ${classes.card} ${classes.text} placeholder-gray-400`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${classes.text} mb-2`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className={`w-full p-3 rounded-xl border-0 focus:ring-2 focus:ring-purple-300 ${classes.card} ${classes.text} placeholder-gray-400`}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={!name.trim() || !phone.trim()}
                    className={`flex-1 py-3 rounded-xl font-medium shadow-lg flex items-center justify-center space-x-2 ${
                      name.trim() && phone.trim()
                        ? `bg-gradient-to-r ${classes.gradient} text-white`
                        : `${classes.card} ${classes.text} opacity-50 cursor-not-allowed`
                    }`}
                  >
                    <Save size={18} />
                    <span>Save</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={cancelEdit}
                    className={`px-6 py-3 ${classes.card} rounded-xl font-medium shadow-lg`}
                  >
                    <span className={classes.text}>Cancel</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : contacts.length > 0 ? (
            <div className="space-y-4">
              {/* Contacts List */}
              {contacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  className={`${classes.card} p-6 rounded-2xl shadow-lg`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 bg-gradient-to-r ${classes.gradient} rounded-full relative`}>
                        <User size={20} className="text-white" />
                        {contact.isDefault && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Star size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className={`text-lg font-medium ${classes.text}`}>
                          {contact.name}
                          {contact.isDefault && (
                            <span className={`ml-2 text-xs ${classes.text} opacity-60`}>
                              (Default)
                            </span>
                          )}
                        </h3>
                        <p className={`${classes.text} opacity-70 text-sm`}>
                          {contact.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!contact.isDefault && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSetDefault(contact.id)}
                          className={`p-2 ${classes.card} rounded-lg shadow-sm`}
                          title="Set as default"
                        >
                          <Star size={16} className={classes.text} />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(contact)}
                        className={`p-2 ${classes.card} rounded-lg shadow-sm`}
                      >
                        <Edit3 size={16} className={classes.text} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(contact.id)}
                        className={`p-2 ${classes.card} rounded-lg shadow-sm`}
                      >
                        <Trash2 size={16} className={classes.text} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCall(contact)}
                      className="flex-1 bg-blue-500 text-white p-3 rounded-xl font-medium shadow-lg flex items-center justify-center space-x-2"
                    >
                      <Phone size={18} />
                      <span>Call</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleWhatsApp(contact)}
                      className="flex-1 bg-green-500 text-white p-3 rounded-xl font-medium shadow-lg flex items-center justify-center space-x-2"
                    >
                      <MessageSquare size={18} />
                      <span>WhatsApp</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}

              {/* Emergency Note */}
              <motion.div
                className={`${classes.card} p-4 rounded-xl shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: contacts.length * 0.1 + 0.2 }}
              >
                <p className={`${classes.text} opacity-70 text-sm text-center`}>
                  These contacts will be used for emergency situations. The default contact (⭐) will be used for Quick SOS.
                </p>
              </motion.div>
            </div>
          ) : (
            <motion.div
              className={`${classes.card} p-8 rounded-2xl shadow-lg text-center`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Plus size={48} className={`${classes.text} opacity-40 mx-auto mb-4`} />
              <h3 className={`text-xl font-medium ${classes.text} mb-2`}>
                No Trusted Contacts
              </h3>
              <p className={`${classes.text} opacity-70 mb-6`}>
                Add people you trust for emergency situations.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startAddNew}
                className={`px-8 py-3 bg-gradient-to-r ${classes.gradient} text-white rounded-xl font-medium shadow-lg`}
              >
                Add First Contact
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};