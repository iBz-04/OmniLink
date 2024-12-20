import { ShareGPTSubmitBodyInterface } from '@type/api';
import { ConfigInterface, MessageInterface, ModelDefinition } from '@type/chat';
import { isAzureEndpoint, uuidv4 } from '@utils/api';

export const getChatCompletion = async (
  endpoint: string,
  messages: MessageInterface[],
  config: ConfigInterface,
  modelDef: ModelDefinition,
  apiKey?: string,
  customHeaders?: Record<string, string>
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  if (isAzureEndpoint(endpoint) && apiKey) {
    headers['api-key'] = apiKey;

    const modelName = modelDef.model;

    const apiVersion = '2023-03-15-preview';

    const path = `openai/deployments/${modelName}/chat/completions?api-version=${apiVersion}`;

    if (!endpoint.endsWith(path)) {
      if (!endpoint.endsWith('/')) {
        endpoint += '/';
      }
      endpoint += path;
    }
  }

  // todo: option in config
  config.user = uuidv4();

  delete (config as any).model_selection;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      messages,
      ...config,
    }),
  });
  if (!response.ok) throw new Error(await response.text());

  const data = await response.json();
  return data;
};

export const getChatCompletionStream = async (
  endpoint: string,
  messages: MessageInterface[],
  config: ConfigInterface,
  modelDef: ModelDefinition,
  apiKey?: string,
  customHeaders?: Record<string, string>
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  if (isAzureEndpoint(endpoint) && apiKey) {
    headers['api-key'] = apiKey;

    const modelName = modelDef.model;

    const apiVersion = '2023-03-15-preview';

    const path = `openai/deployments/${modelName}/chat/completions?api-version=${apiVersion}`;

    if (!endpoint.endsWith(path)) {
      if (!endpoint.endsWith('/')) {
        endpoint += '/';
      }
      endpoint += path;
    }
  }

  // todo: option in config
  config.user = uuidv4();

  delete (config as any).model_selection;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      messages,
      ...config,
      stream: true,
    }),
  });
  if (response.status === 404 || response.status === 405) {
    const text = await response.text();
    if (text.includes('model_not_found')) {
      throw new Error(
        text +
          '\nMessage from OmniLink:\nPlease ensure that you have access to the GPT-4 API!'
      );
    } else {
      throw new Error(
        'Message from OmniLink:\nInvalid API endpoint! We recommend you to check your free API endpoint.'
      );
    }
  }

  if (response.status === 429 || !response.ok) {
    const text = await response.text();
    let error = text;
    if (text.includes('insufficient_quota')) {
      error +=
        '\nMessage from OmniLink:\nWe recommend changing your API endpoint or API key';
    } else if (response.status === 429) {
      error += '\nRate limited!';
    }
    throw new Error(error);
  }

  const stream = response.body;
  return stream;
};

export const submitShareGPT = async (body: ShareGPTSubmitBodyInterface) => {
  const request = await fetch('https://sharegpt.com/api/conversations', {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const response = await request.json();
  const { id } = response;
  const url = `https://shareg.pt/${id}`;
  window.open(url, '_blank');
};
