import React from 'react';
import { FaDownload, FaShareAlt } from 'react-icons/fa';

const ContractDetail = () => {
  const tableData = [
    {
      stt: 1,
      hangMuc: 'Móng',
      dTich: '90',
      heSo: '0.5',
      dienTich: '45',

      donVi: 'm²',
    },

    {
      stt: 2,
      hangMuc: 'Hầm (DTSD >= 70m2: độ sâu 1,0m -> 1,3m)',
      dTich: '90',
      heSo: '1.5',

      dienTich: '135',
      donVi: 'm²',
    },
    {
      stt: 3,
      hangMuc: 'Trệt',

      dTich: '90',
      heSo: '1',

      dienTich: '90',

      donVi: 'm²',
    },
    {
      stt: 4,
      hangMuc: 'Sân',
      dTich: '10',

      heSo: '0.7',

      dienTich: '7',

      donVi: 'm²',
    },
    {
      stt: 5,

      hangMuc: 'Lầu 1',

      dTich: '90',

      heSo: '1',

      dienTich: '90',

      donVi: 'm²',
    },
    {
      stt: 6,
      hangMuc: 'Thông Tầng Lầu 1 (Thông tầng > 8m2)',

      dTich: '1',

      heSo: '0.5',
      dienTich: '0.5',

      donVi: 'm²',
    },
    {
      stt: 7,
      hangMuc: 'Sân thượng có mái che',

      dTich: '45',

      heSo: '1',
      dienTich: '45',

      donVi: 'm²',
    },

    {
      stt: 8,
      hangMuc: 'Sân thượng không mái che',

      dTich: '45',

      heSo: '0.5',

      dienTich: '22.5',
      donVi: 'm²',
    },

    {
      stt: 9,
      hangMuc: 'Mái che (Mái BTCT)',
      dTich: '45',

      heSo: '0.5',
      dienTich: '22.5',

      donVi: 'm²',
    },
  ];

  const totalDienTich = tableData.reduce(
    (total, row) => total + parseFloat(row.dienTich),

    0,
  );

  const donGia = 3350000;
  const thanhTien = totalDienTich * donGia;

  const comboSoLuong = 1;

  const comboDonGia = 18000000;

  const comboThanhTien = comboSoLuong * comboDonGia;

  const phanThoTietKiem = 1532625000;
  const giaTriHopDong = phanThoTietKiem + comboThanhTien;

  const handleDownload = () => {
    // Logic tải về hợp đồng
    alert('Tải về hợp đồng');
  };

  const handleShare = () => {
    // Logic chia sẻ hợp đồng

    alert('Chia sẻ hợp đồng');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Thông tin chi tiết hợp đồng</h2>

        <div className="flex space-x-2">
          <button
            onClick={handleDownload}
            className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
          >
            <FaDownload className="text-lg" />
          </button>

          <button
            onClick={handleShare}
            className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
          >
            <FaShareAlt className="text-lg" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-lg">
          <strong>TÊN KHÁCH HÀNG:</strong> ĐỒ
        </p>

        <p className="text-lg">
          <strong>ĐỊA CHỈ THI CÔNG:</strong> HCM
        </p>

        <p className="text-lg">
          <strong>Được tạo lúc:</strong> 11:06:49 01/09/2024
        </p>

        <p className="text-lg">
          <strong>ĐƠN GIÁ THI CÔNG PHẦN THÔ TIẾT KIỆM:</strong> 3,350,000
          đồng/m²
        </p>

        <p className="text-lg">
          <strong>DIỆN TÍCH XÂY DỰNG THEO PHƯƠNG ÁN THIẾT KẾ:</strong>
        </p>
      </div>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
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

                <td className="px-4 py-2 border text-center">{row.hangMuc}</td>
                <td className="px-4 py-2 border text-center">{row.dTich}</td>
                <td className="px-4 py-2 border text-center">{row.heSo}</td>
                <td className="px-4 py-2 border text-center">{row.dienTich}</td>

                <td className="px-4 py-2 border text-center">{row.donVi}</td>
              </tr>
            ))}
            <tr>
              <td className="px-4 py-2 border text-center" colSpan={4}>
                <strong>Tổng diện tích xây dựng theo thiết kế:</strong>
              </td>

              <td className="px-4 py-2 border text-center">{totalDienTich}</td>
              <td className="px-4 py-2 border text-center">m²</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-lg mb-4">
        <strong>GIÁ TRỊ HỢP ĐỒNG XÂY DỰNG TRƯỚC THUẾ:</strong>
      </p>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-center">
                Tổng diện tích xây dựng
              </th>

              <th className="px-4 py-2 border text-center">x</th>

              <th className="px-4 py-2 border text-center">Đơn giá</th>

              <th className="px-4 py-2 border text-center">=</th>

              <th className="px-4 py-2 border text-center">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border text-center">
                {totalDienTich} m²
              </td>

              <td className="px-4 py-2 border text-center">x</td>

              <td className="px-4 py-2 border text-center">
                {donGia.toLocaleString()} đồng/m²
              </td>

              <td className="px-4 py-2 border text-center">=</td>

              <td className="px-4 py-2 border text-center">
                {thanhTien.toLocaleString()} đồng
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-lg mb-4">
        <strong>CÁC CHI PHÍ KHÁC:</strong>
      </p>

      <p className="text-lg mb-4">
        <strong>Combo Giấy Phép</strong>
      </p>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-center">Số lượng</th>
              <th className="px-4 py-2 border text-center">x</th>

              <th className="px-4 py-2 border text-center">Đơn giá</th>

              <th className="px-4 py-2 border text-center">=</th>
              <th className="px-4 py-2 border text-center">Thành tiền</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="px-4 py-2 border text-center">{comboSoLuong}</td>
              <td className="px-4 py-2 border text-center">x</td>

              <td className="px-4 py-2 border text-center">
                {comboDonGia.toLocaleString()} đồng
              </td>
              <td className="px-4 py-2 border text-center">=</td>
              <td className="px-4 py-2 border text-center">
                {comboThanhTien.toLocaleString()} đồng
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-lg mb-4">
        <strong>TỔNG HỢP GIÁ TRỊ HỢP ĐỒNG:</strong>
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-center">Hạng mục</th>

              <th className="px-4 py-2 border text-center">Thành tiền</th>
              <th className="px-4 py-2 border text-center">Đơn vị tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border text-center">
                Phần Thô Tiết Kiệm
              </td>
              <td className="px-4 py-2 border text-center">
                {phanThoTietKiem.toLocaleString()} VNĐ
              </td>

              <td className="px-4 py-2 border text-center">VNĐ</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border text-center">Combo Giấy Phép</td>
              <td className="px-4 py-2 border text-center">
                {comboThanhTien.toLocaleString()} VNĐ
              </td>

              <td className="px-4 py-2 border text-center">VNĐ</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border text-center">
                <strong>GIÁ TRỊ HỢP ĐỒNG</strong>
              </td>

              <td className="px-4 py-2 border text-center">
                <strong>{giaTriHopDong.toLocaleString()} VNĐ</strong>
              </td>

              <td className="px-4 py-2 border text-center">VNĐ</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractDetail;
