import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import PopupModal from '@components/PopupModal';
import DeleteIcon from '@icon/DeleteIcon';
import useInitialiseNewChat from '@hooks/useInitialiseNewChat';
import SettingsButton from '@components/common/SettingsButton';

const ClearConversation = () => {
  const { t } = useTranslation();

  const initialiseNewChat = useInitialiseNewChat();
  const setFolders = useStore((state) => state.setFolders);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleConfirm = () => {
    setIsModalOpen(false);
    initialiseNewChat();
    setFolders({});
  };

  return (
    <div className='w-full'>
      <SettingsButton onClick={() => setIsModalOpen(true)}>
        {t('clearConversation')}
      </SettingsButton>

      {isModalOpen && (
        <PopupModal
          setIsModalOpen={setIsModalOpen}
          title={t('warning') as string}
          message={t('clearConversationWarning') as string}
          handleConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default ClearConversation;
