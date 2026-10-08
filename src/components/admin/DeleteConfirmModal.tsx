import { Trash2 } from 'lucide-react';

type DeleteConfirmModalProps = { productName: string; onCancel: () => void; onConfirm: () => void };

export default function DeleteConfirmModal({ productName, onCancel, onConfirm }: DeleteConfirmModalProps) {
  return <div className="modal-backdrop" onClick={onCancel}><div className="admin-confirm" onClick={(event) => event.stopPropagation()}><div className="admin-confirm-icon"><Trash2 size={28} /></div><h3>Delete this product?</h3><p>{productName} will be permanently removed from your store.</p><div className="admin-confirm-actions"><button className="button" onClick={onCancel}>Cancel</button><button className="button admin-delete-btn" onClick={onConfirm}><Trash2 size={15} /> Delete product</button></div></div></div>;
}
