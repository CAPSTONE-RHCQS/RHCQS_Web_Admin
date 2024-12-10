import React from 'react';

interface ConstructionAreaTableProps {
  initQuotationInfos: { ConstructionName: string; Area: number }[];
}

const ConstructionAreaTable: React.FC<ConstructionAreaTableProps> = ({
  initQuotationInfos,
}) => {
  const totalArea = initQuotationInfos.reduce(
    (total, info) => total + info.Area,
    0,
  );

  return (
    <div className="mt-6">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-center">STT</th>
            <th className="px-4 py-2 border text-center">Hạng mục</th>
            <th className="px-4 py-2 border text-center">Diện tích</th>
            <th className="px-4 py-2 border text-center">Đơn vị</th>
          </tr>
        </thead>
        <tbody>
          {initQuotationInfos.map((info, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border text-center">{index + 1}</td>
              <td className="px-4 py-2 border text-left">
                {info.ConstructionName}
              </td>
              <td className="px-4 py-2 border text-center">
                {info.Area.toLocaleString('vi-VN')}
              </td>
              <td className="px-4 py-2 border text-center">m²</td>
            </tr>
          ))}
          <tr className='bg-gray-200'>
            <td className="px-4 py-2 border text-center font-bold" colSpan={2}>
              Tổng diện tích xây dựng
            </td>
            <td className="px-4 py-2 border text-center font-bold">
              {totalArea.toLocaleString('vi-VN')} 
            </td>
            <td className="px-4 py-2 border text-center font-bold">m²</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ConstructionAreaTable;
