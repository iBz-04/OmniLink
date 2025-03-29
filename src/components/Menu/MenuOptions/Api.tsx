import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import PersonIcon from '@icon/PersonIcon';
import ApiMenu from '@components/ApiMenu';
import SettingsButton from '@components/common/SettingsButton';

const Config = () => {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className='w-full'>
      <SettingsButton onClick={() => setIsModalOpen(true)} id='api-menu'>
        <div className='flex items-center justify-center gap-2 w-full'>
          <PersonIcon />
          <span>{t('api')}</span>
        </div>
      </SettingsButton>

      {isModalOpen && <ApiMenu setIsModalOpen={setIsModalOpen} />}
    </div>
  );
};

export default Config;
