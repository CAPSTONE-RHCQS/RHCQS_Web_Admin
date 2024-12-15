import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface OthersAgreementEditorProps {
  isEditing: boolean;
  othersAgreement: string;
  setOthersAgreement: (value: string) => void;
}

const OthersAgreementEditor: React.FC<OthersAgreementEditorProps> = ({
  isEditing,
  othersAgreement,
  setOthersAgreement,
}) => {
  return (
    <>
      {isEditing ? (
        <ReactQuill
          value={othersAgreement}
          onChange={setOthersAgreement}
          className="w-full h-32 mb-15"
          placeholder="Nhập nội dung thỏa thuận khác..."
        />
      ) : (
        <div
          className="text-gray-700"
          dangerouslySetInnerHTML={{ __html: othersAgreement }}
        />
      )}
    </>
  );
};

export default OthersAgreementEditor;
