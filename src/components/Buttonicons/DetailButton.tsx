import React from 'react';

interface DetailButtonProps {
  onClick: () => void;
}

const DetailButton: React.FC<DetailButtonProps> = ({ onClick }) => (
  <button onClick={onClick} className="text-blue-500 hover:text-primary">
    <svg
      className="fill-current"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4.5C7.30558 4.5 3.5 8.30558 3.5 13C3.5 17.6944 7.30558 21.5 12 21.5C16.6944 21.5 20.5 17.6944 20.5 13C20.5 8.30558 16.6944 4.5 12 4.5ZM12 19.5C8.41015 19.5 5.5 16.5899 5.5 13C5.5 9.41015 8.41015 6.5 12 6.5C15.5899 6.5 18.5 9.41015 18.5 13C18.5 16.5899 15.5899 19.5 12 19.5ZM12 8.5C11.1716 8.5 10.5 9.17157 10.5 10C10.5 10.8284 11.1716 11.5 12 11.5C12.8284 11.5 13.5 10.8284 13.5 10C13.5 9.17157 12.8284 8.5 12 8.5ZM12 13.5C11.1716 13.5 10.5 14.1716 10.5 15C10.5 15.8284 11.1716 16.5 12 16.5C12.8284 16.5 13.5 15.8284 13.5 15C13.5 14.1716 12.8284 13.5 12 13.5Z"
        fill="currentColor"
      />
    </svg>
  </button>
);

export default DetailButton;
