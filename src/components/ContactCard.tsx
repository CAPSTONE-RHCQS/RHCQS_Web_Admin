import React from 'react';

interface ContactCardProps {
  data: { [key: string]: any };
  fields: { key: string; label: string }[];
  avatarUrl: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ data, fields, avatarUrl }) => {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden flex items-center p-4">
      <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0">
        <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
      </div>
      <div className="ml-4 text-right">
        {fields.map((field, index) => (
          <div key={field.key}>
            <p className={`text-gray-600 ${index === 0 ? 'font-bold text-xl' : ''}`}>
              {field.key === 'priceQuote' ? data[field.key].toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : data[field.key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactCard;
