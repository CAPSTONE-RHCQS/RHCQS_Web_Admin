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
  Rejected: 'Bị từ chối',
  Approved: 'Đã xác nhận',
  Updating: 'Đang chỉnh sửa',
  Accepted: 'Chấp nhận bản vẽ',
  Finalized: 'Hoàn thành',
  Canceled: 'Bị đóng',
};

const statuses = [
  { label: 'Đang xử lý', icon: <FaCog /> },
  { label: 'Chờ xác nhận từ quản lý', icon: <FaUser /> },
  { label: 'Bị từ chối', icon: <FaTimes /> },
  { label: 'Đã xác nhận', icon: <FaCheck /> },
  { label: 'Đang chỉnh sửa', icon: <FaEdit /> },
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
      <div className="w-full max-w-4xl flex items-center justify-between px-4">
        {statuses.map((status, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                  index <= currentIndex
                    ? 'bg-primary text-white'
                    : 'bg-customGray text-gray-700'
                }`}
              >
                {status.icon}
              </div>
              <span
                className={`mt-2 text-xs md:text-sm ${
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
                className="flex-1 h-1 flex items-center"
                style={{ marginTop: '-20px' }}
              >
                <div
                  className="w-full h-1"
                  style={{
                    background:
                      index < currentIndex
                        ? '#1F7F81'
                        : index === currentIndex
                        ? `linear-gradient(to right, #1F7F81 50%, #E5E5E5 50%)`
                        : '#E5E5E5',
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
