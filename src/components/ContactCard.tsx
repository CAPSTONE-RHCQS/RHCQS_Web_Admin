import React from 'react';

interface ContactCardProps {
  data: { [key: string]: any };
  fields: { key: string; label: string }[];
  avatarUrl: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ data, fields, avatarUrl }) => {
  return (
    <div className="w-full max-w-xs bg-white rounded-lg shadow-md overflow-hidden flex items-center p-4 h-32">
      <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0">
        <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
      </div>
      <div className="ml-4 flex-1">
        {fields.map((field, index) => (
          <div key={field.key} className="mb-1">
            <p className={`text-gray-600 ${index === 0 ? 'font-bold text-lg' : ''}`}>
              {data[field.key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactCard;
