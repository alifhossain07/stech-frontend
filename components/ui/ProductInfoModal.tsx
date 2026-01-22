import React from "react";
import { FiX } from "react-icons/fi";

interface ProductInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        product_serial_id: number;
        serial: string;
        product: {
            name: string;
            warranty_days: number;
        };
        activation: {
            activated_at: string;
            expires_at: string;
            claim_count: number;
        };
    } | undefined;
}

const ProductInfoModal: React.FC<ProductInfoModalProps> = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg relative overflow-hidden animate-scaleIn">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Product Information
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                        <h3 className="font-semibold text-gray-800 text-lg mb-1">{product.product.name}</h3>
                        <p className="text-orange-600 font-semibold">Serial: {product.serial}</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-gray-500 font-medium">Warranty Period:</span>
                            <span className="text-gray-800 font-medium">{product.product.warranty_days} Days</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-gray-500 font-medium">Activated On:</span>
                            <span className="text-gray-800 font-medium">{formatDate(product.activation.activated_at)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#FFE8E8] px-4 py-3 rounded-md">
                            <span className="text-red-500 font-semibold">Expires On:</span>
                            <span className="text-red-500 font-medium">{formatDate(product.activation.expires_at)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-gray-500 font-medium">Claims Made:</span>
                            <span className="text-gray-800 font-medium">{product.activation.claim_count} Times</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end p-6 pt-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductInfoModal;
