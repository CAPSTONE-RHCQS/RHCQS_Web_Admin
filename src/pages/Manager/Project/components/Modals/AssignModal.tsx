import React from 'react';
import EmployeeCard from '../Employee/EmployeeCard';
import { truncateName } from '../../../../../utils/stringUtils';

interface AssignModalProps {
  onClose: () => void;
  onAssign: () => void;
  setCurrentCategory: (category: string) => void;
  setShowEmployeeDialog: (show: boolean) => void;
  selectedEmployees: { [key: string]: any };
  resetSelectedEmployees: () => void;
}

const AssignModal: React.FC<AssignModalProps> = ({
  onClose,
  onAssign,
  setCurrentCategory,
  setShowEmployeeDialog,
  selectedEmployees,
  resetSelectedEmployees,
}) => {
  const categories = ['Phối cảnh', 'Kiến trúc', 'Kết cấu', 'Điện nước'];

  const handleClose = () => {
    resetSelectedEmployees();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
      onClick={handleClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto relative transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">
          Phân công nhân viên thiết kế
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div key={category} className="mb-4">
              <EmployeeCard
                avatar={selectedEmployees[category]?.avatar || ''}
                name={truncateName(
                  selectedEmployees[category]?.name || 'Phân công',
                  15,
                )}
                roles={selectedEmployees[category]?.roles || []}
                phone={selectedEmployees[category]?.phone || 'Số điện thoại'}
                onSelect={() => {
                  setCurrentCategory(category);
                  setShowEmployeeDialog(true);
                }}
                isSelected={!!selectedEmployees[category]}
              />
              <div className="text-center mt-2 text-lg font-bold text-gray-600">
                {category}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-primaryGreenButton text-white px-4 py-2 rounded hover:bg-secondaryGreenButton transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={onAssign}
          >
            Xác nhận Phân công
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
