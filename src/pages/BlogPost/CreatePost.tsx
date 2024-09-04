import React, { useState } from 'react';
import WYSIWYGEditor from '../../components/WYSIWYGEditor';

const CreatePost: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Create a New Blog Post
      </h1>
      <div className="flex flex-col md:flex-row w-full h-full">
        <div className="w-full md:w-1/2 p-2 h-full">
          <div className="bg-white p-4 h-full rounded-lg">
            <WYSIWYGEditor value={value} onChange={setValue} />
          </div>
        </div>
        <div className="w-full md:w-1/2 p-2 h-full">
          <div className="bg-white p-4 h-full rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Preview</h2>
            <div
              dangerouslySetInnerHTML={{ __html: value }}
              className="h-full overflow-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
