import React from 'react';
import { Dialog, DialogHeader, DialogBody } from '@material-tailwind/react';
import EmployeeCard from './EmployeeCard';
import { designEmployees } from '../../../../types/Employee';

interface EmployeeAllocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  handleConfirmAllocation: () => void;
  designEmployees: typeof designEmployees;
  selectedDesignEmployees: { [key: string]: string[] };
  handleSelectDesignEmployee: (role: string, name: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  currentDrawing: string;
}

const EmployeeAllocationDialog: React.FC<EmployeeAllocationDialogProps> = ({
  isOpen,
  onClose,
  handleConfirmAllocation,
  designEmployees,
  selectedDesignEmployees,
  handleSelectDesignEmployee,
  notes,
  setNotes,
  currentDrawing,
}) => {
  const getDesignRole = (drawing: string) => {
    switch (drawing) {
      case 'Phối cảnh':
        return 'Thiết kế phối cảnh';
      case 'Kiến trúc':
        return 'Thiết kế kiến trúc';
      case 'Kết cấu':
        return 'Thiết kế kết cấu';
      case 'Điện & nước':
        return 'Thiết kế điện & nước';
      default:
        return '';
    }
  };

  const designRole = getDesignRole(currentDrawing);

  return (
    <Dialog open={isOpen} handler={onClose}>
      <DialogHeader>Phân công nhân viên thiết kế</DialogHeader>
      <DialogBody className="max-h-[80vh] overflow-y-auto">
        <div className="space-y-4">
          <div key={designRole}>
            <h6 className="text-lg font-semibold mb-2">{designRole}</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designEmployees
                .filter((employee) => employee.roles.includes(designRole))
                .map((employee) => (
                  <EmployeeCard
                    key={employee.name}
                    avatar={employee.avatar}
                    name={employee.name}
                    roles={employee.roles}
                    address={employee.address}
                    phone={employee.phone}
                    onSelect={() =>
                      handleSelectDesignEmployee(designRole, employee.name)
                    }
                    isSelected={selectedDesignEmployees[designRole].includes(
                      employee.name,
                    )}
                  />
                ))}
            </div>
          </div>
        </div>
        <textarea
          placeholder="Ghi chú"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full mt-4 p-2 border rounded"
        />
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="p-2 bg-primaryGreenButton text-white rounded hover:bg-secondaryGreenButton transition"
          >
            Đóng
          </button>
          <button
            onClick={handleConfirmAllocation}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Phân công
          </button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default EmployeeAllocationDialog;
