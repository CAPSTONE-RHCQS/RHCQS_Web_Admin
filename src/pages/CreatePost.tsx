import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Create a New Blog Post
      </h1>
      <ReactQuill theme="snow" value={value} onChange={setValue} />
    </div>
  );
};

export default CreatePost;
