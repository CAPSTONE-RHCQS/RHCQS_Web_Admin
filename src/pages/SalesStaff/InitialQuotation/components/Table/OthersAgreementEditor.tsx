import React from 'react';

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
        <textarea
          value={othersAgreement}
          onChange={(e) => setOthersAgreement(e.target.value)}
          className="w-full p-2 border rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập nội dung thỏa thuận khác..."
        />
      ) : (
        <p className="text-gray-700 whitespace-pre-line">{othersAgreement}</p>
      )}
    </>
  );
};

export default OthersAgreementEditor;
