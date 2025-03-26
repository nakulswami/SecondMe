import { getModelConfig, updateModelConfig } from '@/service/modelConfig';
import { useModelConfigStore } from '@/store/useModelConfigStore';
import { Input, message, Modal, Radio } from 'antd';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const options = [
  {
    label: 'None',
    value: ''
  },
  {
    label: 'OpenAI',
    value: 'openai'
  },
  {
    label: 'Custom',
    value: 'litellm'
  }
];

const ModelConfigModal = (props: IProps) => {
  const { open, onClose } = props;
  const modelConfig = useModelConfigStore((store) => store.modelConfig);
  const updateLocalModelConfig = useModelConfigStore((store) => store.updateModelConfig);

  const [modelType, setModelType] = useState<string>('');

  useEffect(() => {
    getModelConfig().then((res) => {
      if (res.data.code == 0) {
        const data = res.data.data || {};

        updateLocalModelConfig(data);
        setModelType(data.provider_type);
      } else {
        message.error(res.data.message);
      }
    });
  }, []);

  const renderEmpty = () => {
    return (
      <div className="flex flex-col items-center">
        <Image
          alt="SecondMe Logo"
          className="object-contain"
          height={40}
          src="/images/single_logo.png"
          width={120}
        />
        <div className="text-gray-500 text-[18px] leading-[32px]">
          Please Choose OpenAI or Custom
        </div>
      </div>
    );
  };

  const renderOpenai = useCallback(() => {
    return (
      <div className="flex flex-col w-full gap-4">
        <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
          <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
          <Input.Password
            onChange={(e) => {
              updateLocalModelConfig({ ...modelConfig, key: e.target.value });
            }}
            placeholder="Enter your OpenAI API key"
            value={modelConfig.key}
          />
          <div className="mt-2 text-sm text-gray-500">
            You can get your API key from{' '}
            <a
              className="text-blue-500 hover:underline"
              href="https://platform.openai.com/settings/organization/api-keys"
              rel="noopener noreferrer"
              target="_blank"
            >
              OpenAI API Keys page
            </a>
            .
          </div>
        </div>
      </div>
    );
  }, [modelConfig]);

  const renderCustom = useCallback(() => {
    return (
      <div className="flex flex-col w-full gap-6 p-4">
        <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
          <label className="block text-sm font-medium text-gray-700 mb-1">Chat</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-700 mb-1">Model Name</div>
              <Input
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className="w-full"
                data-form-type="other"
                onChange={(e) => {
                  updateLocalModelConfig({ ...modelConfig, chat_model_name: e.target.value });
                }}
                spellCheck="false"
                value={modelConfig.chat_model_name}
              />
            </div>

            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-700 mb-1">API Key</div>
              <Input.Password
                autoCapitalize="off"
                autoComplete="new-password"
                autoCorrect="off"
                className="w-full"
                data-form-type="other"
                onChange={(e) => {
                  updateLocalModelConfig({ ...modelConfig, chat_api_key: e.target.value });
                }}
                spellCheck="false"
                value={modelConfig.chat_api_key}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">API Endpoint</label>
            <Input
              autoComplete="off"
              className="w-full"
              onChange={(e) => {
                updateLocalModelConfig({ ...modelConfig, chat_endpoint: e.target.value });
              }}
              value={modelConfig.chat_endpoint}
            />
          </div>
        </div>

        <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
          <label className="block text-sm font-medium text-gray-700 mb-1">Embedding</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
              <Input
                className="w-full"
                onChange={(e) => {
                  updateLocalModelConfig({ ...modelConfig, embedding_model_name: e.target.value });
                }}
                value={modelConfig.embedding_model_name}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <Input.Password
                className="w-full"
                onChange={(e) => {
                  updateLocalModelConfig({ ...modelConfig, embedding_api_key: e.target.value });
                }}
                value={modelConfig.embedding_api_key}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">API Endpoint</label>
            <Input
              className="w-full"
              onChange={(e) => {
                updateLocalModelConfig({ ...modelConfig, embedding_endpoint: e.target.value });
              }}
              value={modelConfig.embedding_endpoint}
            />
          </div>
        </div>
      </div>
    );
  }, [modelConfig]);

  const handleUpdate = () => {
    // When None is selected, save an empty provider_type instead of deleting the config
    const providerType = modelType || '';

    updateModelConfig({ ...modelConfig, provider_type: providerType })
      .then((res) => {
        if (res.data.code == 0) {
          updateLocalModelConfig({ ...modelConfig, provider_type: providerType });
          onClose();
        } else {
          throw new Error(res.data.message);
        }
      })
      .catch((error: any) => {
        message.error(error.message || 'Failed to update model config');
      });
  };

  const renderMainContent = useCallback(() => {
    if (!modelType) {
      return renderEmpty();
    }

    if (modelType === 'openai') {
      return renderOpenai();
    }

    return renderCustom();
  }, [modelType, renderOpenai, renderCustom]);

  return (
    <Modal
      centered
      destroyOnClose
      okButtonProps={{ disabled: !modelType }}
      onCancel={onClose}
      onOk={handleUpdate}
      open={open}
      title={
        <div className="text-xl font-semibold leading-6 text-gray-900">
          Support Model Configuration
        </div>
      }
    >
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center gap-2">
          <p className="mb-1 text-sm text-gray-500">
            Configure models used for training data synthesis for Second Me, and as external
            reference models that Second Me can consult during usage.
          </p>
          <Radio.Group
            buttonStyle="solid"
            onChange={(e) => setModelType(e.target.value)}
            optionType="button"
            options={options}
            value={modelType ? modelType : ''}
          />
        </div>
        <div className="w-full border-t border-gray-200 mt-1 mb-2" />
        {renderMainContent()}
        <div className="w-full border-t border-gray-200 mt-4" />
      </div>
    </Modal>
  );
};

export default ModelConfigModal;
