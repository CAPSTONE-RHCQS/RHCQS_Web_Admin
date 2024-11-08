import React, { useState, useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import EmployeeCard from '../Employee/EmployeeCard';
import { getAvailableDesignStaff } from '../../../../../api/AssignTask/AssignTask';
import { truncateName } from '../../../../../utils/stringUtils';

interface Employee {
  id: string;
  avatar: string;
  name: string;
  roles: string[];
  phone: string;
}

interface HouseDesignDrawingEmployeeListProps {
  onSelectEmployee: (id: string, employeeData: Employee) => void;
}

const HouseDesignDrawingEmployeeList: React.FC<
  HouseDesignDrawingEmployeeListProps
> = ({ onSelectEmployee }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getAvailableDesignStaff();
        const formattedEmployees = data.map((item: any) => ({
          id: item.Id,
          avatar: item.ImgUrl || 'https://via.placeholder.com/150',
          name: item.Name,
          phone: item.Phone,
          roles: item.RoleName,
        }));
        setEmployees(formattedEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleSelect = (id: string) => {
    setSelectedEmployeeId(id);
  };

  const handleConfirmSelection = () => {
    if (selectedEmployeeId) {
      const selectedEmployee = employees.find(
        (employee) => employee.id === selectedEmployeeId,
      );
      if (selectedEmployee) {
        onSelectEmployee(selectedEmployeeId, selectedEmployee);
      }
    } else {
      alert('Vui lòng chọn một nhân viên.');
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <ClipLoader size={50} color={'#5BABAC'} loading={loading} />
        </div>
      ) : (
        <div className="p-4 bg-white rounded-lg shadow-lg max-w-4xl mx-auto" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
            Chọn Nhân Viên
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {employees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                avatar={employee.avatar}
                name={truncateName(employee.name, 10)}
                roles={employee.roles}
                phone={employee.phone}
                onSelect={() => handleSelect(employee.id)}
                isSelected={selectedEmployeeId === employee.id}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleConfirmSelection}
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HouseDesignDrawingEmployeeList;
