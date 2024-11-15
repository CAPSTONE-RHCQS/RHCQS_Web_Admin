import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHouseTemplates } from '../../../api/HouseTemplate/HouseTemplateApi';
import { HouseTemplateItem } from '../../../types/HouseTemplateTypes';
import ClipLoader from 'react-spinners/ClipLoader';
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  IconButton,
} from '@material-tailwind/react';
import { FaBuilding, FaBed } from 'react-icons/fa';
import { getCacheBustedUrl } from '../../../utils/utils';
const HouseTemplateList: React.FC = () => {
  const [houseTemplates, setHouseTemplates] = useState<HouseTemplateItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHouseTemplates = async () => {
      try {
        const data = await fetchHouseTemplates(currentPage, 10);
        setHouseTemplates(data.Items);
        setTotalPages(data.TotalPages);
      } catch (err) {
        setError('Failed to fetch house templates');
      } finally {
        setLoading(false);
      }
    };

    loadHouseTemplates();
  }, [currentPage]);

  const handleTemplateClick = (id: string) => {
    navigate(`/house-template/${id}`);
  };

  const handleCreateTemplateClick = () => {
    navigate('/create-house-template');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#5BABAC" />
      </div>
    );
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Danh sách mẫu nhà</h1>
        <h6
          className="text-primary cursor-pointer font-bold"
          onClick={handleCreateTemplateClick}
        >
          + Thêm mẫu nhà mới
        </h6>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {houseTemplates.map((template) => (
          <Card
            key={template.Id}
            className="shadow-lg rounded-lg overflow-hidden"
          >
            <div
              onClick={() => handleTemplateClick(template.Id)}
              className="cursor-pointer"
            >
              <img
                src={getCacheBustedUrl(template.ImgUrl)}
                alt={template.Name}
                className="w-full h-48 object-cover"
              />
            </div>
            <CardBody>
              <Typography variant="h5" className="font-semibold">
                {template.Name}
              </Typography>
              <Typography className="text-gray-600 mt-2">
                {template.Description}
              </Typography>
            </CardBody>
            <CardFooter
              divider
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center">
                <IconButton variant="text" size="sm">
                  <FaBuilding style={{ color: '#008080' }} />
                </IconButton>
                <Typography className="ml-2">
                  {template.NumberOfFloor}
                </Typography>
              </div>
              <div className="flex items-center">
                <IconButton variant="text" size="sm">
                  <FaBed style={{ color: '#008080' }} />
                </IconButton>
                <Typography className="ml-2">{template.NumberOfBed}</Typography>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Trang trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default HouseTemplateList;
