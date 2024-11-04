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

const HouseTemplateList: React.FC = () => {
  const [houseTemplates, setHouseTemplates] = useState<HouseTemplateItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHouseTemplates = async () => {
      try {
        const data = await fetchHouseTemplates(1, 10);
        setHouseTemplates(data.Items);
      } catch (err) {
        setError('Failed to fetch house templates');
      } finally {
        setLoading(false);
      }
    };

    loadHouseTemplates();
  }, []);

  const handleTemplateClick = (id: string) => {
    navigate(`/house-template/${id}`);
  };

  const handleCreateTemplateClick = () => {
    navigate('/create-house-template');
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#123abc" />
      </div>
    );
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Danh sách mẫu nhà</h1>
        <h6
          className="text-blue-500 cursor-pointer font-bold"
          onClick={handleCreateTemplateClick}
        >
          Thêm mẫu nhà mới +
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
                src={template.ImgUrl}
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
    </div>
  );
};

export default HouseTemplateList;
