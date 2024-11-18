import React, { useState } from 'react';
import axios from 'axios';

const TrackingLog = () => {
  const [trackingIds, setTrackingIds] = useState<string>('');
  const [trackingData, setTrackingData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTrackingData = async () => {
    setLoading(true);
    setError(null);
    setTrackingData([]);
    const parsedData = parseTrackingInput(trackingIds);

    try {
      const results = await Promise.all(
        parsedData.map(async ({ ids, description }) => {
          try {
            const response = await axios.get(
              `http://localhost:3000/api/tracking/${ids}`,
            );
            console.log(response.data);
            return { id: ids, description, data: response.data };
          } catch (err) {
            return {
              id: ids,
              description,
              error: err instanceof Error ? err.message : 'Unknown error',
            };
          }
        }),
      );
      setTrackingData(results);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const parseTrackingInput = (input: string) => {
    return input.split('\n').map((line) => {
      const [ids, description] = line.split('\t');
      return { ids: ids.replace(/"/g, ''), description };
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <textarea
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={trackingIds}
          onChange={(e) => setTrackingIds(e.target.value)}
          placeholder="Nhập mỗi mã vận đơn trên một dòng"
          rows={5}
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          onClick={fetchTrackingData}
        >
          Lấy thông tin
        </button>
        {loading && <div className="text-gray-500">Loading...</div>}
        {error && <div className="text-red-500">Error: {error.message}</div>}
      </div>
      <div className="mt-4">
        {trackingData.length > 0 ? (
          <table className="w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Mã vận đơn</th>
                <th className="py-2 px-4 border-b">Chi tiết Tracking</th>
              </tr>
            </thead>
            <tbody>
              {trackingData.map((result, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{result.id}</td>
                  <td className="py-2 px-4 border-b">
                    {result.error ? (
                      <div className="text-red-500">Error: {result.error}</div>
                    ) : (
                      <table className="w-full bg-white border border-gray-200 rounded-lg shadow">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-1 px-2 border-b">Sản phẩm</th>
                            <th className="py-1 px-2 border-b">Mã đơn hàng</th>
                            <th className="py-1 px-2 border-b">Trạng thái</th>
                            <th className="py-1 px-2 border-b">Thời gian</th>
                            <th className="py-1 px-2 border-b">Ngày</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.data.trackingDetails
                            .slice(0, 1)
                            .map((detail: string, i: number) => {
                              const [, status, time, date, extraDetail] =
                                detail.split('\n');
                              return (
                                <tr key={i}>
                                  <td className="py-1 px-2 border-b">
                                    {result.description}
                                  </td>
                                  <td className="py-1 px-2 border-b">
                                    {status}
                                  </td>
                                  <td className="py-1 px-2 border-b">{time}</td>
                                  <td className="py-1 px-2 border-b">{date}</td>
                                  <td className="py-1 px-2 border-b">
                                    {extraDetail}
                                  </td>
                                </tr>
                              );
                            })}
                          {result.data.trackingDetails
                            .slice(1, 2)
                            .map((detail: string, i: number) => (
                              <tr key={i}>
                                <td className="py-1 px-2 border-b" colSpan={5}>
                                  {detail}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500">No data available</div>
        )}
      </div>
    </div>
  );
};

export default TrackingLog;
