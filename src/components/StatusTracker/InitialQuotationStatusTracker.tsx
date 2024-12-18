import React from 'react';
import {
  FaSpinner,
  FaCheck,
  FaBan,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaUserCheck,
  FaTimes,
  FaEdit,
} from 'react-icons/fa';

interface InitialQuotationStatusTrackerProps {
  currentStatus: string;
}

const statuses = [
  {
    label: 'Chờ xử lý',
    icon: <FaClock />,
    bgColor: '#2196F3',
    labelColor: '#2196F3',
  },
  {
    label: 'Đang xử lý',
    icon: <FaSpinner />,
    bgColor: '#FFA500',
    labelColor: '#FFA500',
  },
  {
    label: 'Chờ xác nhận quản lý',
    icon: <FaUser />,
    bgColor: '#9370DB',
    labelColor: '#9370DB',
  },
  {
    label: 'Quản lý đã xác nhận',
    icon: <FaUserCheck />,
    bgColor: '#5BABAC',
    labelColor: '#5BABAC',
  },
  {
    label: 'Từ chối báo giá',
    icon: <FaTimes />,
    bgColor: '#FF6347',
    labelColor: '#FF6347',
  },
  {
    label: 'Đang chỉnh sửa',
    icon: <FaEdit />,
    bgColor: '#1E90FF',
    labelColor: '#1E90FF',
  },
  {
    label: 'Hoàn thành',
    icon: <FaCheckCircle />,
    bgColor: '#32CD32',
    labelColor: '#32CD32',
  },
  {
    label: 'Đã đóng',
    icon: <FaBan />,
    bgColor: '#EF5350',
    labelColor: '#EF5350',
  },
  {
    label: 'Đã chấm dứt',
    icon: <FaBan />,
    bgColor: '#EF5350',
    labelColor: '#EF5350',
  },
];

const InitialQuotationStatusTracker: React.FC<
  InitialQuotationStatusTrackerProps
> = ({ currentStatus }) => {
  const currentIndex = statuses.findIndex(
    (status) => status.label === currentStatus,
  );

  return (
    <div className="py-3 mb-2 flex items-center justify-center w-full">
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
                    index === currentIndex
                      ? 'ring-4 ring-offset-2 ring-blue-'
                      : ''
                  }}`}
                  style={{
                    backgroundColor:
                      index <= currentIndex ? status.bgColor : '#E5E5E5',
                    color: index <= currentIndex ? '#FFFFFF' : '#gray-700',
                  }}
                >
                  {status.icon}
                </div>
                <span
                  className="mt-2 text-xs md:text-sm"
                  style={{
                    color:
                      index <= currentIndex ? status.labelColor : '#gray-700',
                    fontWeight: index <= currentIndex ? 'bold' : 'normal',
                  }}
                >
                  {status.label}
                </span>
              </div>
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

export default InitialQuotationStatusTracker;
