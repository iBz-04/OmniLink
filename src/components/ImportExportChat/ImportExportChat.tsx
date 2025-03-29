import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import ExportIcon from '@icon/ExportIcon';
import PopupModal from '@components/PopupModal';
import SettingsButton from '@components/common/SettingsButton';

import ImportChat from './ImportChat';
import ExportChat from './ExportChat';
import ImportChatOpenAI from './ImportChatOpenAI';

const ImportExportChat = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className='w-full'>
      <SettingsButton
        onClick={() => setIsModalOpen(true)}
        ariaLabel={t('import.export') as string}
      >
        {t('import.export')}
      </SettingsButton>

      {isModalOpen && (
        <PopupModal
          title={`${t('import')} / ${t('export')} ${t('data')}`}
          setIsModalOpen={setIsModalOpen}
          cancelButton={false}
        >
          <div className='p-6'>
            <ImportChat />
            <ExportChat />
            <div className='border-t my-3 border-custom-white' />
            <ImportChatOpenAI setIsModalOpen={setIsModalOpen} />
          </div>
        </PopupModal>
      )}
    </div>
  );
};

export default ImportExportChat;
