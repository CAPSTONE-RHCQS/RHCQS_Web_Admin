import React, { useState, useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import EmployeeCard from '../Employee/EmployeeCard';
import { getAvailableDesignStaff } from '../../../../../api/AssignTask/AssignTask';
import { truncateName } from '../../../../../utils/stringUtils';

interface Employee {
  id: string;
  avatar: string | null;
  name: string;
  roles: string[];
  phone: string;
}

interface HouseDesignDrawingEmployeeListProps {
  onSelectEmployee: (id: string, employeeData: Employee) => void;
  onClose: () => void;
}

const HouseDesignDrawingEmployeeList: React.FC<
  HouseDesignDrawingEmployeeListProps
> = ({ onSelectEmployee, onClose }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(8);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const data = await getAvailableDesignStaff(page, size);
        const formattedEmployees = data.map((item: any) => ({
          id: item.Id,
          avatar: item.ImgUrl,
          name: item.Name,
          phone: item.Phone,
          roles: [item.RoleName],
        }));
        setEmployees(formattedEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [page, size]);

  const handleSelect = (id: string) => {
    setSelectedEmployeeId(id);
    const selectedEmployee = employees.find((employee) => employee.id === id);
    if (selectedEmployee) {
      onSelectEmployee(id, selectedEmployee);
    }
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-lg shadow-lg max-w-4xl mx-auto relative transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        {loading ? (
          <div className="flex justify-center">
            <ClipLoader size={50} color={'#5BABAC'} loading={loading} />
          </div>
        ) : (
          <div className="p-2">
            <h2 className="text-2xl font-bold mb-4 text-center text-primary">
              Chọn Nhân Viên
            </h2>
            <div
              className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
              style={{ maxHeight: '62vh', overflowY: 'auto' }}
            >
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
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePreviousPage}
                className="bg-gray-300 text-black px-4 py-2 rounded"
                disabled={page === 1}
              >
                Trang trước
              </button>
              <button
                onClick={handleNextPage}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Trang sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HouseDesignDrawingEmployeeList;
