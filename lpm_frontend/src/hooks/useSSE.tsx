import { useState, useRef } from 'react';

export interface ChatRequest {
  message: string;
  system_prompt: string;
  role_id?: string;
  enable_l0_retrieval: boolean;
  enable_l1_retrieval: boolean;
  temperature: number;
  history: ChatHistory[];
}

interface ChatHistory {
  role: 'user' | 'assistant';
  content: string;
}

// interface StreamResponse {
//   id: string;
//   object: string;
//   created: number;
//   model: string;
//   system_fingerprint: string;
//   choices: {
//     index: number;
//     delta: {
//       content?: string;
//     };
//     finish_reason: string | null;
//   }[];
// }

export const useSSE = () => {
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamContent, setStreamContent] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const streamContentRef = useRef('');

  const stopSSE = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setStreaming(false);
  };

  const sendStreamMessage = async (request: ChatRequest) => {
    setStreaming(true);
    setError(null);
    setStreamContent('');
    streamContentRef.current = ''; // Clear this as well

    // Use AbortController to cancel the request
    const controller = new AbortController();

    abortControllerRef.current = controller; // Store the controller in the ref

    const signal = controller.signal;

    try {
      const response = await fetch('/api/kernel2/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive'
        },
        body: JSON.stringify(request),
        signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error('ReadableStream not supported');
      }

      const decoder = new TextDecoder();

      let interval: NodeJS.Timeout | null = null;

      const featchStream = async () => {
        try {
          const { done, value } = await reader.read();

          if (done) {
            if (interval) clearInterval(interval);

            setStreaming(false);

            return;
          }

          const chunk = decoder.decode(value);

          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;

            if (line === 'data: [DONE]') break;

            const jsonChunk = line.slice(6).trim();

            if (!jsonChunk) continue;

            const parsedData = JSON.parse(jsonChunk);
            const content = parsedData?.choices[0].delta.content || '';

            // Use useRef to record the latest streamContent
            streamContentRef.current += content;
            setStreamContent(streamContentRef.current);
          }
        } catch {
          setStreaming(false);

          if (interval) clearInterval(interval);
        }
      };

      interval = setInterval(featchStream, 10);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';

      setError(errorMessage);
      setStreamContent(errorMessage);
      console.error('Streaming error:', err);
      setStreaming(false);
    }
  };

  return {
    stopSSE,
    sendStreamMessage,
    streaming,
    error,
    streamContent
  };
};
