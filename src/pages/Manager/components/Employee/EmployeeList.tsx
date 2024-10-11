import React, { useState, useEffect } from 'react';
import EmployeeCard from './EmployeeCard';
import { getAccountsByRoleId } from '../../../../api/Account/Account';
import { assignProject } from '../../../../api/Project/Project';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Dialog } from '@material-tailwind/react'; 

interface Employee {
  id: string;
  avatar: string;
  name: string;
  roles: string[];
  address: string;
  phone: string;
}

interface EmployeeListProps {
  onSelectEmployee: (id: string, note: string) => void;
  projectId: string;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  onSelectEmployee,
  projectId,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null,
  );
  const [note, setNote] = useState<string>('');

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const size = 4;

  const [message, setMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getAccountsByRoleId(
          '9959CE96-DE26-40A7-B8A7-28A704062E89',
          page,
          size,
        );
        const formattedEmployees = data.Items.map((item: any) => ({
          id: item.Id,
          avatar: item.ImageUrl || 'https://via.placeholder.com/150',
          name: item.Username,
          roles: [item.RoleName],
          address: 'N/A',
          phone: item.PhoneNumber,
        }));
        setEmployees(formattedEmployees);
        setTotalPages(data.TotalPages);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, [page]);

  const handleSelect = (id: string) => {
    setSelectedEmployeeId(id);
  };

  const handleAssign = async () => {
    if (selectedEmployeeId) {
      try {
        await assignProject(selectedEmployeeId, projectId);
        onSelectEmployee(selectedEmployeeId, note);
        setMessage('Phân công nhân viên thành công!');
      } catch (error) {
        console.error('Error assigning project:', error);
        setMessage('Có lỗi xảy ra khi phân công nhân viên.');
      }
    } else {
      setMessage('Vui lòng chọn một nhân viên trước khi phân bổ.');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMessage(null);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Chọn Nhân Viên</h2> {/* Thay đổi màu tiêu đề */}
      <div className="grid grid-cols-4 gap-4">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            avatar={employee.avatar}
            name={employee.name}
            roles={employee.roles}
            address={employee.address}
            phone={employee.phone}
            onSelect={() => handleSelect(employee.id)}
            isSelected={selectedEmployeeId === employee.id}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          <FaArrowLeft />
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          <FaArrowRight />
        </button>
      </div>
      <div className="mt-4">
        <textarea
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập ghi chú (không bắt buộc)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleAssign}
        >
          Phân bổ
        </button>
      </div>
      <Dialog open={showModal} handler={handleCloseModal} className="w-64 mx-auto">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-2">Thông báo</h3>
          <p className="text-gray-700">{message}</p>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
            onClick={handleCloseModal}
          >
            Đóng
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default EmployeeList;