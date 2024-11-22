import React from 'react';
import {
  FaCog,
  FaUser,
  FaTimes,
  FaCheck,
  FaEdit,
  FaClipboard,
  FaBan,
} from 'react-icons/fa';

interface WorkDetailStatusTrackerProps {
  currentStatus: string;
}

const statusMapping: Record<string, string> = {
  Processing: 'Đang xử lý',
  Reviewing: 'Chờ xác nhận từ quản lý',
  Updating: 'Đang chỉnh sửa',
  Updated: 'Đã chỉnh sửa',
  Approved: 'Đã xác nhận',
  Accepted: 'Chấp nhận bản vẽ',
  Finalized: 'Hoàn thành',
  Canceled: 'Bị đóng',
};

const statuses = [
  { label: 'Đang xử lý', icon: <FaCog /> },
  { label: 'Chờ xác nhận từ quản lý', icon: <FaUser /> },
  { label: 'Đang chỉnh sửa', icon: <FaEdit /> },
  { label: 'Đã chỉnh sửa', icon: <FaEdit /> },
  { label: 'Đã xác nhận', icon: <FaCheck /> },
  { label: 'Chấp nhận bản vẽ', icon: <FaCheck /> },
  { label: 'Hoàn thành', icon: <FaClipboard /> },
  { label: 'Bị đóng', icon: <FaBan /> },
];

const WorkDetailStatusTracker: React.FC<WorkDetailStatusTrackerProps> = ({
  currentStatus,
}) => {
  const translatedStatus = statusMapping[currentStatus] || currentStatus;
  const currentIndex = statuses.findIndex(
    (status) => status.label === translatedStatus,
  );

  return (
    <div className="py-3 flex items-center justify-center w-full">
      <div className="flex items-center justify-between px-4 space-x-4">
        {statuses.map((status, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index <= currentIndex
                    ? 'bg-primary text-white scale-110'
                    : 'bg-customGray text-gray-700'
                }`}
                title={status.label}
              >
                {status.icon}
              </div>
              <span
                className={`mt-2 text-xs md:text-sm transition-all duration-300 ${
                  index <= currentIndex
                    ? 'text-primary font-semibold'
                    : 'text-gray-700'
                }`}
              >
                {status.label}
              </span>
            </div>
            {index < statuses.length - 1 && (
              <div
                className="flex-1 h-2 flex items-center"
                style={{ marginTop: '-20px' }}
              >
                <div
                  className="w-full h-2 transition-all duration-300"
                  style={{
                    background:
                      index < currentIndex
                        ? '#007BFF'
                        : index === currentIndex
                        ? `linear-gradient(to right, #007BFF 50%, #FF5733 50%)`
                        : '#FF5733',
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WorkDetailStatusTracker;
