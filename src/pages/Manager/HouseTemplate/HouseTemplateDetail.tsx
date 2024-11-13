import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchHouseTemplateDetail } from '../../../api/HouseTemplate/HouseTemplateApi';
import { HouseTemplateDetail as HouseTemplateDetailType } from '../../../types/HouseTemplateTypes';
import { Typography, Alert } from '@material-tailwind/react';
import { Tab, TabList } from '@headlessui/react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import ClipLoader from 'react-spinners/ClipLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRulerCombined,
  faRulerHorizontal,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import PackageHouseList from './components/PackageHouseList';
import ExteriorImageList from './components/ExteriorImageList';

const HouseTemplateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
          console.log(data.Id);
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

  const handleEdit = () => {
    if (id) {
      navigate('/create-house-template', { state: { id } });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#5BABAC" />
      </div>
    );
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Chi tiết thiết kế mẫu nhà</h2>
        <button
          onClick={handleEdit}
          className="text-primary cursor-pointer font-bold"
        >
          Chỉnh sửa mẫu nhà
        </button>
      </div>
      {houseTemplate && (
        <>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2">
              <Zoom>
                <div className="relative">
                  <div className="mt-4 mb-4 text-center flex justify-center space-x-4">
                    <Typography className="flex items-center">
                      <FontAwesomeIcon
                        icon={faRulerCombined}
                        className="mr-2"
                      />
                      {
                        houseTemplate.SubTemplates[selectedTabIndex]
                          ?.BuildingArea
                      }
                      m²
                    </Typography>
                    <Typography className="flex items-center">
                      <FontAwesomeIcon
                        icon={faRulerHorizontal}
                        className="mr-2"
                      />
                      {houseTemplate.SubTemplates[selectedTabIndex]?.FloorArea}
                      m²
                    </Typography>
                  </div>
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
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button
                      onClick={handleNext}
                      className="bg-gray-200 p-2 rounded-full mx-2"
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                </div>
              </Zoom>
            </div>
            <div className="w-full md:w-1/2 pl-4">
              <Tab.Group
                selectedIndex={selectedTabIndex}
                onChange={setSelectedTabIndex}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2">
                    <img
                      src={houseTemplate.ImgUrl}
                      alt={houseTemplate.Name}
                      className="w-full h-full object-cover rounded-lg shadow-md"
                    />
                  </div>
                  <div className="w-full md:w-1/2 pl-6">
                    <div className="flex flex-col">
                      <Typography
                        variant="h4"
                        className="mb-3 font-bold text-gray-800"
                      >
                        {houseTemplate.Name}
                      </Typography>
                      <Typography className="mb-3 text-gray-600">
                        {houseTemplate.Description}
                      </Typography>
                      <Typography className="mb-2 text-gray-600">
                        <strong>Số tầng:</strong> {houseTemplate.NumberOfFloor}
                      </Typography>
                      <Typography className="mb-2 text-gray-600">
                        <strong>Số phòng ngủ:</strong>
                        {houseTemplate.NumberOfBed}
                      </Typography>
                      <Typography className="mb-1 text-gray-600">
                        Số mặt tiền: {houseTemplate.NumberOfFront ?? 'Không có'}
                      </Typography>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 pl-6">
                    <TabList className="flex flex-col space-y-2 mt-4">
                      {houseTemplate.SubTemplates.map((subTemplate) => (
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
                    </TabList>
                  </div>
                </div>
                <Tab.Panels className="mt-2">
                  {houseTemplate.SubTemplates.map((subTemplate) => (
                    <Tab.Panel key={subTemplate.Id} className="p-2">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tên
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Diện tích
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Hệ số
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {subTemplate.TemplateItems.map((item) => (
                            <tr key={item.Id}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                {item.Name}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                {item.Area} {item.Unit}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
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
          <div className="flex flex-wrap space-x-2 mt-2">
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
          <PackageHouseList packageHouses={houseTemplate.PackageHouses} />
          <ExteriorImageList exteriors={houseTemplate.ExteriorsUrls} />
        </>
      )}
    </div>
  );
};

export default HouseTemplateDetail;
