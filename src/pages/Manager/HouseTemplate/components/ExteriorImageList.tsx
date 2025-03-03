import React from 'react';
import { Typography } from '@material-tailwind/react';
import { ExteriorUrl } from '../../../../types/HouseTemplateTypes'; // Import đúng kiểu từ file types
import { defaultImageHouseTemplateUrl } from '../../../../utils/constants';

interface ExteriorImageListProps {
  exteriors: ExteriorUrl[];
}

const ExteriorImageList: React.FC<ExteriorImageListProps> = ({ exteriors }) => {
  return (
    <div className="mt-6">
      <Typography variant="h5" className="font-bold text-primary">
        Danh sách hình ảnh ngoại thất:
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {exteriors.map((exterior) => (
          <div
            key={exterior.Id}
            className="border p-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <img
              src={exterior.Url || defaultImageHouseTemplateUrl}
              alt={exterior.Name}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <Typography variant="h6" className="font-bold text-primary">
              {exterior.Name}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExteriorImageList;