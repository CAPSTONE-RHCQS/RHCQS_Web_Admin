import React from 'react';
import { FaSpinner, FaClipboardCheck, FaCheck, FaBan } from 'react-icons/fa';

interface InitialQuotationStatusTrackerProps {
  currentStatus: string;
}

const statuses = [
  { label: 'Chờ xử lý', icon: <FaSpinner /> },
  { label: 'Đang xử lý', icon: <FaSpinner /> },
  { label: 'Chờ xác nhận từ quản lý', icon: <FaClipboardCheck /> },
  { label: 'Đã xác nhận', icon: <FaCheck /> },
  { label: 'Từ chối báo giá SB', icon: <FaBan /> },
  { label: 'Đã hoàn thành', icon: <FaCheck /> },
  { label: 'Đã đóng', icon: <FaBan /> },
];

const InitialQuotationStatusTracker: React.FC<
  InitialQuotationStatusTrackerProps
> = ({ currentStatus }) => {
  const currentIndex = statuses.findIndex(
    (status) => status.label === currentStatus,
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

export default InitialQuotationStatusTracker;
