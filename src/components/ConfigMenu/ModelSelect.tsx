import React from 'react';
import DownChevronArrow from '@icon/DownChevronArrow';
import useHideOnOutsideClick from '@hooks/useHideOnOutsideClick';
import useStore from '@store/store';
import { StoreState } from '@store/store';
import { useTranslation } from 'react-i18next';

export const ModelSelect = ({
  _model,
  _setModel,
  showHidden,
}: {
  _model: number;
  _setModel: (value: React.SetStateAction<number>) => void;
  showHidden: boolean;
}) => {
  const { t } = useTranslation('model');
  const modelDefs = useStore((state) => state.modelDefs);
  
  // Get visible model definitions
  const visibleModelDefs = showHidden 
    ? modelDefs 
    : modelDefs.filter((m) => m.swap_visible);

  return (
    <div className="inline-flex items-center">
      <select
        className="bg-neutral-light text-custom-white border-0 rounded-md h-9 px-3 w-32 shadow-sm cursor-pointer focus:ring-2 focus:ring-accent-dark transition-colors duration-200"
        value={_model}
        onChange={(e) => {
          _setModel(Number(e.target.value));
        }}
      >
        {visibleModelDefs.map((modelDef, index) => (
          <option key={index} value={index}>
            {modelDef.name}
          </option>
        ))}
      </select>
    </div>
  );
};
