import React from 'react';
import { Typography } from '@material-tailwind/react';
import { PackageHouse } from '../../../../types/HouseTemplateTypes';
import { defaultImageHouseTemplateUrl } from '../../../../utils/constants';

interface PackageHouseListProps {
  packageHouses: PackageHouse[];
}

const PackageHouseList: React.FC<PackageHouseListProps> = ({
  packageHouses,
}) => {
  return (
    <div className="mt-6">
      <Typography variant="h5" className="font-bold text-primary">
        Danh sách gói xây dựng nhà:
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {packageHouses.map((packageHouse) => (
          <div
            key={packageHouse.Id}
            className="border p-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <img
              src={packageHouse.ImgUrl || defaultImageHouseTemplateUrl}
              alt={packageHouse.PackageName}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <Typography variant="h6" className="font-bold text-primary">
              {packageHouse.PackageName}
            </Typography>
            <Typography className="text-gray-600">
              {packageHouse.Description}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageHouseList;