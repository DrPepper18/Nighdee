import React, { createContext, useContext, useState } from 'react';
import { Dialog } from './Dialog';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState({ isOpen: false, title: '', content: null });

    const openModal = (title, content) => setModal({ isOpen: true, title, content });
    const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            {modal.isOpen && (
                <Dialog title={modal.title} onClose={closeModal}>
                    {modal.content}
                </Dialog>
            )}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);