import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchHouseTemplateDetail } from '../../../api/HouseTemplate/HouseTemplateApi';
import { HouseTemplateDetail as HouseTemplateDetailType } from '../../../types/HouseTemplateTypes';
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Spinner,
  Alert,
} from '@material-tailwind/react';
import { Tab } from '@headlessui/react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import ClipLoader from 'react-spinners/ClipLoader';

const HouseTemplateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [houseTemplate, setHouseTemplate] =
    useState<HouseTemplateDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [selectedDrawingIndex, setSelectedDrawingIndex] = useState<number>(-1);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  useEffect(() => {
    const loadHouseTemplateDetail = async () => {
      try {
        if (id) {
          const data = await fetchHouseTemplateDetail(id);
          setHouseTemplate(data);
        }
      } catch (err) {
        setError('Failed to fetch house template detail');
      } finally {
        setLoading(false);
      }
    };

    loadHouseTemplateDetail();
  }, [id]);

  useEffect(() => {
    setSelectedDrawingIndex(-1);
  }, [selectedTabIndex]);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleNext = () => {
    if (houseTemplate) {
      const maxIndex =
        houseTemplate.SubTemplates[selectedTabIndex]?.Designdrawings.length - 1;
      setSelectedDrawingIndex((prevIndex) =>
        prevIndex < maxIndex ? prevIndex + 1 : 0,
      );
    }
  };

  const handlePrev = () => {
    if (houseTemplate) {
      const maxIndex =
        houseTemplate.SubTemplates[selectedTabIndex]?.Designdrawings.length - 1;
      setSelectedDrawingIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : maxIndex,
      );
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#123abc" />
      </div>
    );
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <div className="container mx-auto p-4">
      {houseTemplate && (
        <>
          <div className="flex">
            <div className="w-1/2">
              <Zoom>
                <div className="relative">
                  <div className="w-full h-96 overflow-hidden flex justify-center items-center">
                    <img
                      src={
                        selectedDrawingIndex === -1
                          ? houseTemplate.SubTemplates[selectedTabIndex]?.Url
                          : houseTemplate.SubTemplates[selectedTabIndex]
                              ?.Designdrawings[selectedDrawingIndex]?.Url
                      }
                      alt={houseTemplate.Name}
                      className={`object-cover ${isZoomed ? 'zoomed' : ''}`}
                      onClick={toggleZoom}
                      style={{
                        width: isZoomed ? '150%' : '100%',
                        height: isZoomed ? '150%' : '100%',
                        transition: 'width 0.3s ease, height 0.3s ease',
                      }}
                    />
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={handlePrev}
                      className="bg-gray-200 p-2 rounded-full mx-2"
                    >
                      &lt;
                    </button>
                    <button
                      onClick={handleNext}
                      className="bg-gray-200 p-2 rounded-full mx-2"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              </Zoom>
            </div>
            <div className="w-1/2 pl-4">
              <Typography variant="h5" className="mb-2">
                {houseTemplate.Name}
              </Typography>
              <Tab.Group
                selectedIndex={selectedTabIndex}
                onChange={setSelectedTabIndex}
              >
                <Tab.List className="flex flex-wrap space-x-1">
                  {houseTemplate.SubTemplates.map((subTemplate, index) => (
                    <Tab
                      key={subTemplate.Id}
                      className={({ selected }) =>
                        `px-4 py-2 text-sm font-medium text-center text-green-900 rounded-lg transition-colors duration-300
                        ${
                          selected
                            ? 'bg-primaryGreenButton text-white shadow-lg'
                            : 'bg-secondGreenButton hover:bg-gray-200'
                        }`
                      }
                    >
                      Diện tích: {subTemplate.Size}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels className="mt-2">
                  {houseTemplate.SubTemplates.map((subTemplate) => (
                    <Tab.Panel key={subTemplate.Id} className="p-3">
                      <Typography>
                        Diện tích xây dựng: {subTemplate.BuildingArea} m²
                      </Typography>
                      <Typography>
                        Diện tích sàn: {subTemplate.FloorArea} m²
                      </Typography>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tên
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Diện tích
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Hệ số
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {subTemplate.TemplateItems.map((item) => (
                            <tr key={item.Id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {item.Name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {item.Area} {item.Unit}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {item.Coefficient}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => setSelectedDrawingIndex(-1)}
              className={`w-16 h-16 border-2 rounded-lg overflow-hidden transition-colors duration-300 ${
                selectedDrawingIndex === -1
                  ? 'border-customRed'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img
                src={houseTemplate.SubTemplates[selectedTabIndex]?.Url}
                alt={houseTemplate.Name}
                className="w-full h-full object-cover"
              />
            </button>
            {houseTemplate.SubTemplates[selectedTabIndex]?.Designdrawings.map(
              (drawing, index) => (
                <button
                  key={drawing.Id}
                  onClick={() => setSelectedDrawingIndex(index)}
                  className={`w-16 h-16 border-2 rounded-lg overflow-hidden transition-colors duration-300 ${
                    selectedDrawingIndex === index
                      ? 'border-customRed'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={drawing.Url}
                    alt={drawing.Name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ),
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HouseTemplateDetail;
