import React from "react";
import { useNavigate } from "react-router-dom";

interface ProfileWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CompleteProfile: React.FC<ProfileWarningModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-red-600">Complete Your Profile</h2>
        <p className="mt-2 text-gray-600">
          Your profile is incomplete. Please update your details to enjoy the full experience.
        </p>

        <div className="mt-4 flex justify-end space-x-2 text-sm">
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Later
          </button>
          <button
            onClick={() => {
              onClose();
              navigate("/profile"); // ✅ SPA navigation without reload
            }}
            className="px-2 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Update Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
