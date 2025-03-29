import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import useStore from '@store/store';
import ConfigMenu from '@components/ConfigMenu';
import { ChatInterface, ConfigInterface } from '@type/chat';
import { _defaultChatConfig } from '@constants/chat';
import { ModelSelect } from '@components/ConfigMenu/ModelSelect';
import ModelConfigButton from '@components/common/ModelConfigButton';

const ModelConfigBar = React.memo(() => {
  const { t } = useTranslation('model');
  const config = useStore(
    (state) =>
      state.chats &&
      state.chats.length > 0 &&
      state.currentChatIndex >= 0 &&
      state.currentChatIndex < state.chats.length
        ? state.chats[state.currentChatIndex].config
        : undefined,
    shallow
  );
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const setConfig = (config: ConfigInterface) => {
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    updatedChats[currentChatIndex].config = config;
    setChats(updatedChats);
  };

  // for migrating from old ChatInterface to new ChatInterface (with config)
  useEffect(() => {
    const chats = useStore.getState().chats;
    if (chats && chats.length > 0 && currentChatIndex !== -1 && !config) {
      const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
      updatedChats[currentChatIndex].config = { ..._defaultChatConfig };
      setChats(updatedChats);
    }
  }, [currentChatIndex]);

  return config ? (
    <>
      <div className='sticky top-0 z-50 border-b border-neutral-base bg-neutral-dark text-custom-white backdrop-filter backdrop-blur-sm bg-opacity-90'>
        <div className='flex items-center justify-center flex-wrap gap-2 py-2 px-3'>
          <div className='flex items-center'>
            <ModelSelect
              _model={config.model_selection}
              _setModel={(ac) => {
                const newModel = (ac.valueOf() as number) || 0;
                const updatedConfig = {
                  ...config,
                  model_selection: newModel as number,
                };
                setConfig(updatedConfig);
              }}
              showHidden={false}
            />
          </div>
          
          <ModelConfigButton onClick={() => setIsModalOpen(true)}>
            {t('token.label')}: {config.max_tokens}
          </ModelConfigButton>
          
          <ModelConfigButton onClick={() => setIsModalOpen(true)}>
            {t('temperature.label')}: {config.temperature}
          </ModelConfigButton>
          
          <ModelConfigButton onClick={() => setIsModalOpen(true)}>
            {t('topP.label')}: {config.top_p}
          </ModelConfigButton>
        </div>
      </div>
      {isModalOpen && (
        <ConfigMenu
          setIsModalOpen={setIsModalOpen}
          config={config}
          setConfig={setConfig}
        />
      )}
    </>
  ) : (
    <></>
  );
});

export default ModelConfigBar;
