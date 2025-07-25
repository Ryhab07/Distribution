import { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean; // Add isOpen prop
  onRequestClose: () => void; // Add onRequestClose prop
  children: ReactNode;
}

const Modal = ({ isOpen, onRequestClose, children }: ModalProps) => {
  // Ensure the modal closes when clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const modal = document.getElementById("modal-content");
      if (modal && !modal.contains(event.target as Node)) {
        onRequestClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onRequestClose]);

  if (!isOpen) return null; // Render nothing if modal is not open

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        id="modal-content"
        className="bg-white rounded-lg shadow-lg p-6 w-[90%]  h-[98%] overflow-y-auto relative"
      >
        <button
          onClick={onRequestClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
