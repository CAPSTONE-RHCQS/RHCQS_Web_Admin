import React from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

interface ContractHistoryTimelineProps {
  onClose: () => void;
}

const ContractHistoryTimeline: React.FC<ContractHistoryTimelineProps> = ({ onClose }) => {
  const historyData = [
    {
      date: '12 June, 2018',
      events: [
        { time: '08:00', description: 'The order was delivered' },
        { time: '08:00', description: 'The order was delivered' },
        { time: '08:00', description: 'The order was delivered' },
        { time: '08:00', description: 'The order was delivered' },
      ],
    },
    {
      date: '12 June, 2018',
      events: [
        { time: '08:00', description: 'The order was delivered' },
        { time: '08:00', description: 'The order was delivered' },
      ],
    },
    {
      date: '12 June, 2018',
      events: [
        { time: '08:00', description: 'The order was delivered' },
      ],
    },
  ];

  return (
    <Dialog open={true} handler={onClose}>
      <DialogHeader>Lịch sử chỉnh sửa hợp đồng</DialogHeader>
      <DialogBody divider className="max-h-[30rem] overflow-y-auto">
        <div className="relative p-4">
          <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200"></div>
          {historyData.map((day, index) => (
            <div key={index} className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  <span className="text-sm">{index + 1}</span>
                </div>
                <div className="ml-4 text-lg font-semibold">{day.date}</div>
              </div>
              <div className="ml-12">
                {day.events.map((event, idx) => (
                  <div key={idx} className="mb-4 p-4 bg-gray-100 rounded-lg shadow">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="ml-4 text-gray-700">{event.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose} className="mr-1">
          Đóng
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ContractHistoryTimeline;