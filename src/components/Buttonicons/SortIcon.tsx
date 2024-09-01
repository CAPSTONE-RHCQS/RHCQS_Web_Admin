import React from 'react';

const SortIcon = ({ onClick }: { onClick: () => void }) => (
  <svg
    onClick={onClick}
    className="inline fill-current cursor-pointer ml-2 relative bottom- 0.5"
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill="#5f6368"
  >
    <path d="M324-432v-294L219-621l-51-51 192-192 192 192-51 51-105-105v294h-72ZM600-96 408-288l51-51 105 105v-294h72v294l105-105 51 51L600-96Z" />
  </svg>
);

export default SortIcon;
