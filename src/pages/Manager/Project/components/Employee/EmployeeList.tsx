import React, { useState, useEffect } from 'react';
import EmployeeCard from './EmployeeCard';
import { getAvailableSalesStaff } from '../../../../../api/Account/AccountApi';
import { assignProject } from '../../../../../api/Project/ProjectApi';
import {
  FaArrowLeft,
  FaArrowRight,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckCircle,
} from 'react-icons/fa';
import { Dialog } from '@material-tailwind/react';
import { truncateName } from '../../../../../utils/stringUtils';

interface Employee {
  id: string;
  avatar: string | null;
  name: string;
  roles: string[];
  phone: string;
}

interface EmployeeListProps {
  onSelectEmployee: (id: string, note: string) => void;
  projectId: string;
  onRefreshProjectDetail: () => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  onSelectEmployee,
  projectId,
  onRefreshProjectDetail,
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
        const data = await getAvailableSalesStaff(page, size);
        const formattedEmployees = data.Items.map((item: any) => ({
          id: item.Id,
          avatar: item.ImageUrl,
          name: item.Username,
          roles: [item.RoleName],
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

  useEffect(() => {
    if (showModal && message?.includes('thành công')) {
      const timer = setTimeout(() => {
        setShowModal(false);
        setMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showModal, message]);

  const handleAssign = async () => {
    if (selectedEmployeeId) {
      try {
        await assignProject(selectedEmployeeId, projectId);
        onSelectEmployee(selectedEmployeeId, note);
        onRefreshProjectDetail();
        setMessage(null);
      } catch (error: any) {
        console.error('Error assigning project:', error);
        const errorMessage =
          error.response?.data?.Error ||
          'Có lỗi xảy ra khi phân công nhân viên.';
        setMessage(`Lỗi: ${errorMessage}`);
        setShowModal(true);
      }
    } else {
      setMessage('Vui lòng chọn một nhân viên trước khi Phân công.');
      setShowModal(true);
    }
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
      <h2 className="text-2xl font-bold mb-4 text-center text-primary">
        Chọn Nhân Viên
      </h2>
      {employees.length === 0 ? (
        <p className="text-center text-gray-500">Hiện tại chưa có nhân viên...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      )}
      <div className="mt-4 flex justify-between items-center">
        <button
          className={`px-4 py-2 rounded transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 ${
            page === 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-secondaryGreenButton text-white hover:bg-primaryGreenButton focus:ring-secondaryGreenButton'
          }`}
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          <FaArrowLeft />
        </button>
        <span className="text-gray-700">
          {page} / {totalPages}
        </span>
        <button
          className={`px-4 py-2 rounded transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 ${
            page === totalPages
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-secondaryGreenButton text-white hover:bg-primaryGreenButton focus:ring-secondaryGreenButton'
          }`}
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          <FaArrowRight />
        </button>
      </div>
      <div className="mt-4">
        <textarea
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Nhập ghi chú (không bắt buộc)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          className="bg-primaryGreenButton text-white px-4 py-2 rounded hover:bg-secondaryGreenButton transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
          onClick={handleAssign}
        >
          Phân công
        </button>
      </div>
      {message && (
        <Dialog
          open={showModal}
          handler={handleCloseModal}
          className="w-80 mx-auto"
        >
          <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
            <FaExclamationTriangle className="text-teal-500 text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-center">Lỗi</h3>
            <p className="text-gray-700 text-center">{message}</p>
            <button
              className="mt-6 bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
              onClick={handleCloseModal}
            >
              Đóng
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default EmployeeList;
