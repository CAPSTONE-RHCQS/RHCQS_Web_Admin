import React from 'react';
import { FaCog, FaFileContract, FaCheck, FaBan } from 'react-icons/fa';

interface ContractStatusTrackerProps {
  currentStatus: string;
}

const contractStatuses = [
  { label: 'Đang xử lý', icon: <FaCog /> },
  { label: 'Hoàn thành', icon: <FaFileContract /> },
  { label: 'Đã thanh toán', icon: <FaCheck /> },
  { label: 'Chấm dứt hợp đồng', icon: <FaBan /> },
];

const ContractStatusTracker: React.FC<ContractStatusTrackerProps> = ({
  currentStatus,
}) => {
  const currentIndex = contractStatuses.findIndex(
    (status) => status.label === currentStatus,
  );

  return (
    <div className="py-3 flex items-center justify-center w-full">
      <div className="w-full max-w-4xl flex items-center justify-between px-4">
        {contractStatuses.map((status, index) => (
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
            {index < contractStatuses.length - 1 && (
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

export default ContractStatusTracker;
