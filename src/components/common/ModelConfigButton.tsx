import React, { ReactNode } from 'react';

interface ModelConfigButtonProps {
  onClick: () => void;
  children: ReactNode;
}

const ModelConfigButton: React.FC<ModelConfigButtonProps> = ({
  onClick,
  children,
}) => {
  return (
    <button
      className='text-center rounded-md btn-neutral cursor-pointer w-32 h-9 flex items-center justify-center shadow-sm transition-colors duration-200 hover:bg-neutral-light/30'
      onClick={onClick}
    >
      <span className='truncate'>{children}</span>
    </button>
  );
};

export default ModelConfigButton;
