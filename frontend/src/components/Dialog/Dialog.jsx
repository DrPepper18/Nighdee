import React from 'react';
import ReactDOM from 'react-dom';
import './Dialog.css';
import { useModal } from './ModalContext';


export const ChildrenAlert = ({message, onClose}) => {
    const { closeModal } = useModal();
    if (!onClose) onClose = closeModal;
    return (
        <div className="alert-children">
            <p>{message}</p>
            <input className="button full-width" type="button" value="OK" onClick={onClose}/>
        </div>
    );
}

export const ChildrenConfirm = ({message, onConfirm, onCancel}) => {
    const { closeModal } = useModal();
    if (!onConfirm) onConfirm = closeModal;
    if (!onCancel) onCancel = closeModal;
    return (
        <div className="confirm-children">
            <p>{message}</p>
            <div style={{display: 'flex', gap: '10px'}}>
                <input className="button button--to-go full-width" type="button" value="Yes" onClick={onConfirm}/>
                <input className="button button--negative full-width" type="button" value="No" onClick={onCancel}/>
            </div>
        </div>
    );
}

export const Dialog = ({title, children, onClose}) => {
    return ReactDOM.createPortal(
        <dialog className="dialog-background" open onClick={onClose}>
            <div className="dialog" onClick={(e) => e.stopPropagation()}>
                <h2>{title}</h2>
                <div className="dialog-content">
                    {children}
                </div>
            </div>
        </dialog>,
        document.body
    );
};