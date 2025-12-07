import React from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  leaseTitle?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  leaseTitle,
}) => {
  const [reason, setReason] = React.useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-red-600 mb-3">Confirm Deletion</h2>
        <p className="text-sm text-gray-700 mb-2">
          Are you sure you want to delete <strong>{leaseTitle}</strong>?
        </p>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for deletion:</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="Enter a reason..."
        />

        <div className="flex justify-end gap-3 mt-4 text-sm">
          <button
            onClick={onClose}
            className="px-2 py-1  rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim()}
            className="px-2 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
