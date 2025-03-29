import React, { ReactNode } from 'react';

interface SettingsButtonProps {
  onClick: () => void;
  children: ReactNode;
  id?: string;
  ariaLabel?: string;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({
  onClick,
  children,
  id,
  ariaLabel,
}) => {
  return (
    <button
      className="btn btn-neutral bg-neutral-light hover:bg-neutral-light/70 transition-colors duration-200 rounded-lg shadow-sm w-full h-10 flex items-center justify-center px-4 text-center"
      id={id}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <div className="w-full text-center">{children}</div>
    </button>
  );
};

export default SettingsButton; 