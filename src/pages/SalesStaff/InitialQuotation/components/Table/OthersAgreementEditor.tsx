import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { addClassesToHtml } from '../../../../../utils/htmlUtils';

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
          theme="snow"
          value={othersAgreement}
          onChange={setOthersAgreement}
          className="w-full h-32 mb-15"
          placeholder="Nhập nội dung thỏa thuận khác..."
          modules={{
            toolbar: {
              container: [
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ size: [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [
                  { list: 'ordered' },
                  { list: 'bullet' },
                  { indent: '-1' },
                  { indent: '+1' },
                ],
                ['link', 'image', 'video'],
                ['code-block'],
                ['clean'],
              ],
            },
            clipboard: {
              matchVisual: false,
            },
          }}
          formats={[
            'header',
            'font',
            'size',
            'bold',
            'italic',
            'underline',
            'strike',
            'blockquote',
            'list',
            'bullet',
            'indent',
            'link',
            'image',
            'video',
            'code-block',
          ]}
        />
      ) : (
        <div
          className="text-gray-700"
          dangerouslySetInnerHTML={{ __html: addClassesToHtml(othersAgreement) }}
        />
      )}
    </>
  );
};

export default OthersAgreementEditor;
