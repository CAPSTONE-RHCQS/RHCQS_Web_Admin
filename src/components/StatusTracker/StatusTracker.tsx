import React from 'react';
import {
  FaHome,
  FaUser,
  FaCog,
  FaCheck,
  FaFileContract,
  FaBan,
  FaSignature,
} from 'react-icons/fa';

interface StatusTrackerProps {
  currentStatus: string;
}

const statusMap: Record<
  string,
  { label: string; icon: JSX.Element; bg: string; text: string }
> = {
  'Đang xử lý': {
    label: 'Đang xử lý',
    icon: <FaHome />,
    bg: 'bg-primary',
    text: 'text-primary',
  },
  'Đã thiết kế': {
    label: 'Đã thiết kế',
    icon: <FaFileContract />,
    bg: 'bg-pink-500',
    text: 'text-pink-500',
  },
  'Chờ xác nhận': {
    label: 'Chờ xác nhận',
    icon: <FaUser />,
    bg: 'bg-blue-500',
    text: 'text-blue-500',
  },
  'Đã ký hợp đồng': {
    label: 'Đã ký hợp đồng',
    icon: <FaSignature />,
    bg: 'bg-purple-500',
    text: 'text-purple-500',
  },
  'Hoàn thành': {
    label: 'Hoàn thành',
    icon: <FaCheck />,
    bg: 'bg-green-500',
    text: 'text-green-500',
  },
  'Đã chấm dứt': {
    label: 'Đã chấm dứt',
    icon: <FaBan />,
    bg: 'bg-red-500',
    text: 'text-red-500',
  },
};

const StatusTracker: React.FC<StatusTrackerProps> = ({ currentStatus }) => {
  const currentIndex = Object.keys(statusMap).indexOf(currentStatus);

  let filteredStatuses = Object.values(statusMap).filter((status) => {
    if (status.label === 'Đã chấm dứt') {
      return status.label === currentStatus;
    }
    return status.label !== 'Hoàn thành';
  });

  if (currentStatus !== 'Đã chấm dứt') {
    const completedStatus = statusMap['Hoàn thành'];
    if (completedStatus) {
      filteredStatuses.push(completedStatus);
    }
  }

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
                      ? `${status.bg} text-white`
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
                    index <= currentIndex ? status.text : 'text-gray-700'
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
