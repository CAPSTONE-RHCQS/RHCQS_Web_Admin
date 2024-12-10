import { FaTimes } from 'react-icons/fa';

const RejectDialog: React.FC<{
  note: string;
  onClose: () => void;
}> = ({ note, onClose }) => {
  return (
    <div className="fixed bottom-50 right-13 bg-white p-4 rounded-lg shadow-lg z-50">
      <h2 className="text-lg text-primary font-bold mb-2">Lý do từ chối</h2>
      <p className="mb-2">{note}</p>
      <div className="absolute top-[-2px] right-[-3px] z-50">
        <button
          onClick={onClose}
          className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center"
        >
          <FaTimes className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default RejectDialog;
