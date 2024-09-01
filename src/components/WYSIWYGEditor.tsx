import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface WYSIWYGEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({ value, onChange }) => {
  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <div className="bg-white p-4 w-full ">
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default WYSIWYGEditor;
