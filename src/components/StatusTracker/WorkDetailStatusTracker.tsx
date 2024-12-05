import React from 'react';
import {
  FaUser,
  FaTimes,
  FaCheck,
  FaEdit,
  FaClipboard,
  FaBan,
  FaClock,
  FaPaintBrush,
  FaPaintRoller,
  FaUserCheck,
} from 'react-icons/fa';

interface WorkDetailStatusTrackerProps {
  currentStatus: string;
}

const statuses = [
  {
    key: 'Pending',
    label: 'Đang chờ',
    icon: <FaClock />,
    backgroundColor: 'bg-blue-500',
    textColor: 'text-blue-500',
  },
  {
    key: 'Processing',
    label: 'Đang thiết kế',
    icon: <FaPaintBrush />,
    backgroundColor: 'bg-yellow-800',
    textColor: 'text-yellow-800',
  },
  {
    key: 'Reviewing',
    label: 'Chờ xác nhận quản lý',
    icon: <FaUser />,
    backgroundColor: 'bg-purple-300',
    textColor: 'text-purple-300',
  },
  {
    key: 'Approved',
    label: 'Quản lý đã xác nhận',
    icon: <FaUserCheck />,
    backgroundColor: 'bg-teal-300',
    textColor: 'text-teal-300',
  },
  {
    key: 'Updating',
    label: 'Đang chỉnh sửa',
    icon: <FaEdit />,
    backgroundColor: 'bg-blue-500',
    textColor: 'text-blue-500',
  },
  {
    key: 'Accepted',
    label: 'Chấp nhận bản vẽ',
    icon: <FaCheck />,
    backgroundColor: 'bg-lime-600',
    textColor: 'text-lime-600',
  },
  {
    key: 'Finalized',
    label: 'Hoàn thành',
    icon: <FaClipboard />,
    backgroundColor: 'bg-green-400',
    textColor: 'text-green-400',
  },
  {
    key: 'Ended',
    label: 'Bị đóng',
    icon: <FaBan />,
    backgroundColor: 'bg-red-400',
    textColor: 'text-red-400',
  },
];

const getStatusProperties = (statusKey: string) => {
  const status = statuses.find((s) => s.key === statusKey);
  return (
    status || {
      label: 'Không xác định',
      icon: <FaTimes />,
      backgroundColor: '#D3D3D3',
    }
  );
};

const WorkDetailStatusTracker: React.FC<WorkDetailStatusTrackerProps> = ({
  currentStatus,
}) => {
  const { label: translatedStatus, backgroundColor } =
    getStatusProperties(currentStatus);
  const currentIndex = statuses.findIndex(
    (status) => status.label === translatedStatus,
  );

  return (
    <div className="py-3 flex items-center justify-center w-full">
      <div className="w-full max-w-6xl flex items-center justify-between px-1">
        {statuses.map((status, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center px-1">
              <div
                className={`flex flex-col items-center transition-transform transform ${
                  index === currentIndex ? 'scale-125' : 'hover:scale-110'
                }`}
              >
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                    index <= currentIndex
                      ? `${status.backgroundColor} text-white`
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
                    index <= currentIndex ? status.textColor : 'text-gray-700'
                  } font-semibold`}
                >
                  {status.label}
                </span>
              </div>
            </div>
            {index < statuses.length - 1 && (
              <div
                className="flex-1 h-2 flex items-center"
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
