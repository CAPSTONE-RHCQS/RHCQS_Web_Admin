import React from 'react';
import {
  FaHome,
  FaUser,
  FaCog,
  FaCheck,
  FaFileContract,
  FaBan,
} from 'react-icons/fa';

interface StatusTrackerProps {
  currentStatus: string;
}

const statuses = [
  { label: 'Đang xử lý', icon: <FaHome /> },
  { label: 'Đã thiết kế', icon: <FaFileContract /> },
  { label: 'Chờ xác nhận', icon: <FaUser /> },
  { label: 'Đã ký hợp đồng', icon: <FaCog /> },
  { label: 'Hoàn thành', icon: <FaCheck /> },
  { label: 'Đã chấm dứt', icon: <FaBan /> },
];

type StatusLabel =
  | 'Đang xử lý'
  | 'Đã thiết kế'
  | 'Chờ xác nhận'
  | 'Đã ký hợp đồng'
  | 'Hoàn thành'
  | 'Đã chấm dứt';

const statusColors: Record<StatusLabel, { bg: string; text: string }> = {
  'Đang xử lý': { bg: 'bg-primary', text: 'text-primary' },
  'Đã thiết kế': { bg: 'bg-pink-500', text: 'text-pink-500' },
  'Chờ xác nhận': { bg: 'bg-blue-500', text: 'text-blue-500' },
  'Đã ký hợp đồng': { bg: 'bg-purple-500', text: 'text-purple-500' },
  'Hoàn thành': { bg: 'bg-green-500', text: 'text-green-500' },
  'Đã chấm dứt': { bg: 'bg-red-500', text: 'text-red-500' },
};

const StatusTracker: React.FC<StatusTrackerProps> = ({ currentStatus }) => {
  const currentIndex = statuses.findIndex(
    (status) => status.label === currentStatus,
  );

  let filteredStatuses = statuses.filter((status) => {
    if (currentStatus === 'Đã chấm dứt') {
      return status.label !== 'Hoàn thành';
    }
    return status.label !== 'Đã chấm dứt';
  });

  return (
    <div className="py-3 flex items-center justify-center w-full">
      <div className="w-full max-w-4xl flex items-center justify-between px-4">
        {filteredStatuses.map((status, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`flex flex-col items-center transition-transform transform ${
                  index === currentIndex ? 'scale-125' : 'hover:scale-110'
                }`}
              >
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                    index <= currentIndex
                      ? `${
                          statusColors[status.label as StatusLabel].bg
                        } text-white`
                      : 'bg-customGray text-gray-700'
                  } ${
                    index === currentIndex
                      ? 'ring-4 ring-offset-2 ring-blue-300'
                      : ''
                  }`}
                  title={status.label}
                >
                  {status.icon}
                </div>
                <span
                  className={`mt-2 text-xs md:text-sm ${
                    index <= currentIndex
                      ? statusColors[status.label as StatusLabel].text
                      : 'text-gray-700'
                  } font-semibold`}
                >
                  {status.label}
                </span>
              </div>
            </div>
            {index < filteredStatuses.length - 1 && (
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

export default StatusTracker;
