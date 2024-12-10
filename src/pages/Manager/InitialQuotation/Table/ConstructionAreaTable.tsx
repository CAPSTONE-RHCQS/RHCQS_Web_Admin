import React from 'react';

interface TableRow {
  stt: number;
  hangMuc: string;
  dTich: string;
  heSo: string;
  dienTich: string;
  donVi: string;
}

interface ConstructionAreaTableProps {
  tableData: TableRow[];
  totalDienTich: number;
  projectType: string;
}

const ConstructionAreaTable: React.FC<ConstructionAreaTableProps> = ({
  tableData,
  totalDienTich,
  projectType,
}) => {
  return (
    <div className="overflow-x-auto mb-4">
      {projectType === 'FINISHED' ? (
        <table className="min-w-full bg-white border border-gray-200 mt-4">
          <thead>
            <tr>
              <th colSpan={4} className="px-4 py-2 border text-left">
                <p className="text-primary">Phần hoàn thiện</p>
              </th>
            </tr>
            <tr>
              <th className="px-4 py-2 border text-center">STT</th>
              <th className="px-4 py-2 border text-center">Hạng mục</th>
              <th className="px-4 py-2 border text-center">Diện Tích</th>
              <th className="px-4 py-2 border text-center">Đơn vị</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border text-center">1</td>
              <td className="px-4 py-2 border text-left">Phần hoàn thiện</td>
              <td className="px-4 py-2 border text-center">
                <strong>{totalDienTich}</strong>
              </td>
              <td className="px-4 py-2 border text-center">
                <strong>m²</strong>
              </td>
            </tr>
          </tbody>
        </table>
      ) : projectType === 'ROUGH' ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th colSpan={6} className="px-4 py-2 border text-left">
                <p className="text-primary">Phần thô</p>
              </th>
            </tr>
            <tr>
              <th className="px-4 py-2 border text-center">STT</th>
              <th className="px-4 py-2 border text-center">Hạng mục</th>
              <th className="px-4 py-2 border text-center">D-Tích</th>
              <th className="px-4 py-2 border text-center">Hệ số</th>
              <th className="px-4 py-2 border text-center">Diện tích</th>
              <th className="px-4 py-2 border text-center">Đơn vị</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border text-center">{row.stt}</td>
                <td className="px-4 py-2 border text-left">{row.hangMuc}</td>
                <td className="px-4 py-2 border text-center">{row.dTich}</td>
                <td className="px-4 py-2 border text-center">{row.heSo}</td>
                <td className="px-4 py-2 border text-center">{row.dienTich}</td>
                <td className="px-4 py-2 border text-center">{row.donVi}</td>
              </tr>
            ))}
            <tr className='bg-gray-200'>
              <td className="px-4 py-2 border text-center" colSpan={4}>
                <strong>Tổng diện tích xây dựng theo phương án thiết kế</strong>
              </td>
              <td className="px-4 py-2 border text-center">
                <strong>{totalDienTich}</strong>
              </td>
              <td className="px-4 py-2 border text-center">
                <strong>m²</strong>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th colSpan={6} className="px-4 py-2 border text-left">
                  <p className="text-primary">Phần thô</p>
                </th>
              </tr>
              <tr>
                <th className="px-4 py-2 border text-center">STT</th>
                <th className="px-4 py-2 border text-center">Hạng mục</th>
                <th className="px-4 py-2 border text-center">D-Tích</th>
                <th className="px-4 py-2 border text-center">Hệ số</th>
                <th className="px-4 py-2 border text-center">Diện tích</th>
                <th className="px-4 py-2 border text-center">Đơn vị</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border text-center">{row.stt}</td>
                  <td className="px-4 py-2 border text-left">{row.hangMuc}</td>
                  <td className="px-4 py-2 border text-center">{row.dTich}</td>
                  <td className="px-4 py-2 border text-center">{row.heSo}</td>
                  <td className="px-4 py-2 border text-center">
                    {row.dienTich}
                  </td>
                  <td className="px-4 py-2 border text-center">{row.donVi}</td>
                </tr>
              ))}
              <tr className='bg-gray-200'>
                <td className="px-4 py-2 border text-center" colSpan={4}>
                  <strong>
                    Tổng diện tích xây dựng theo phương án thiết kế
                  </strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>{totalDienTich}</strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>m²</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <table className="min-w-full bg-white border border-gray-200 mt-4">
            <thead>
              <tr>
                <th colSpan={4} className="px-4 py-2 border text-left">
                  <p className="text-primary">Phần hoàn thiện</p>
                </th>
              </tr>
              <tr>
                <th className="px-4 py-2 border text-center">STT</th>
                <th className="px-4 py-2 border text-center">Hạng mục</th>
                <th className="px-4 py-2 border text-center">Diện Tích</th>
                <th className="px-4 py-2 border text-center">Đơn vị</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border text-center">1</td>
                <td className="px-4 py-2 border text-left">Phần hoàn thiện</td>
                <td className="px-4 py-2 border text-center">
                  <strong>{totalDienTich}</strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>m²</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ConstructionAreaTable;
