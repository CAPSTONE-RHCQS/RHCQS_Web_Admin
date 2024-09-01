import React from 'react';
import { FaCog, FaHome, FaUser, FaCheck } from 'react-icons/fa';

interface StatusTrackerProps {
  currentStatus: string;
}

const statuses = [
  { label: 'Đang Xử Lý', icon: <FaHome /> },
  { label: 'Đang Thiết Kế', icon: <FaUser /> },
  { label: 'Đang Báo Giá', icon: <FaCog /> },
  { label: 'Hoàn Thành', icon: <FaCheck /> },
];

const StatusTracker: React.FC<StatusTrackerProps> = ({ currentStatus }) => {
  const currentIndex = statuses.findIndex(
    (status) => status.label === currentStatus,
  );

  return (
    <div className="py-3 flex items-center justify-center w-full">
      <div className="w-4/5 flex items-center justify-between">
        {statuses.map((status, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentIndex
                    ? 'bg-primary text-white'
                    : 'bg-customGray text-gray-700'
                }`}
              >
                {status.icon}
              </div>
              <span
                className={`mt-2 ${
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
                style={{ marginTop: '-30px' }}
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
