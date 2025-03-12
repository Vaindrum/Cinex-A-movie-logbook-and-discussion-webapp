import { X } from "lucide-react";

const ImageModal = ({ isOpen, imageUrl, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative max-w-[90vw] max-h-[90vh] p-2 bg-transparent rounded-lg" onClick={(e) => e.stopPropagation()}>
                <button className="cursor-pointer absolute -top-2 -right-2 bg-gray-800 text-white p-2 rounded-full" onClick={onClose}>
                    <X size={14} />
                </button>
                <img src={imageUrl} alt="Preview" className="w-auto h-auto max-w-full max-h-full rounded-lg" />
            </div>
        </div>
    );
};

export default ImageModal;
