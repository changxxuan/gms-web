<!-- <template>
  <div>
    <TChatList :data="[
          {
            avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
            role: 'user',
            content: [
              {
                type: 'text',
                data: '南极的自动提款机叫什么名字？',
              },
            ],
          },
          {
            avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
            role: 'assistant',
            content: [
              {
                type: 'text',
                data: '它叫 McMurdo Station ATM，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。',
              },
            ],
          },
        ]"/>
    <TChatActionbar  :comment="comment"
      content="它叫 McMurdo Station ATM，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。"
      :action-bar="['replay', 'copy', 'good', 'bad', 'share']"
      @actions="handleActions"/>
  </div>
</template>

<script setup lang="ts">
import {
  ChatList as TChatList,
  ChatActionbar as TChatActionbar,
  ChatMarkdown as TChatMarkdown,
} from '@tdesign-vue-next/chat';

import { ref } from 'vue';
const comment = ref('');
const handleActions = (type, options) => {
  console.log(type, options);
  comment.value = type;
};
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style> -->


<template>
  <div  class="chatbot">
    <t-button variant="outline" size="small" :disabled="hasHistory" @click="loadHistory"> 加载历史消息 </t-button>
    <t-chatbot
      ref="chatRef"
      :chat-service-config="chatServiceConfig"
      :message-props="messageProps"
      :default-messages="defaultMessages"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ComputedRef } from 'vue';
import type { SSEChunkData, AIMessageContent, ChatServiceConfig, ChatRequestParams, ChatMessagesData, TdChatbotApi } from '@tdesign-vue-next/chat';

/**
 * 快速开始示例
 *
 * 学习目标：
 * - 了解 Chatbot 组件的最小配置
 * - 理解 endpoint 和 onMessage 的作用
 * - 实现一个基于SSE流式传输的最简可用的对话界面
 */

// // 聊天服务配置
// const chatServiceConfig: ChatServiceConfig = {
//   // 对话服务地址
//   endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal',
//   // 开启流式传输
//   stream: true,
//   // 解析后端返回的数据，转换为组件所需格式
//   onMessage: (chunk: SSEChunkData): AIMessageContent => {
//     const { ...rest } = chunk.data as any;
//     return {
//       type: 'markdown',
//       data: rest?.msg || '',
//     };
//   },
// };

const chatRef = ref<TdChatbotApi | null>(null);
const hasHistory = ref(false);

// 初始化消息
const defaultMessages: ComputedRef<ChatMessagesData[]> = computed(() => hasHistory.value ? [] : [
  {
    id: 'welcome',
    role: 'assistant',
    content: [
      {
        type: 'text',
        status: 'complete',
        data: 'Hi! I am checking in to assist you with planning the next sprint. Shall we get started?',
      },
      {
        type: 'suggestion',
        status: 'complete',
        data: [
          {
            title: 'Sprint 是什么？',
            prompt: '请介绍一下 Sprint 的作用和规则',
          }
        ],
      },
    ],
  },
]);

// 模拟历史消息数据（通常从后端接口获取）
const historyMessages: ChatMessagesData[] = [
  {
    id: 'history-1',
    role: 'user',
    datetime: '2024-01-01 10:00:00',
    content: [
      {
        type: 'text',
        data: 'Sprint 是什么？',
      },
    ],
  },
  {
    id: 'history-2',
    role: 'assistant',
    datetime: '2024-01-01 10:00:05',
    status: 'complete',
    content: [
      {
        type: 'markdown',
        data: '目标拆解为 **Story → Epic → Initiative → Goal** 之后，将一个或多个Story添加到Sprint中\n\n- 一个标准的 Sprint 周期为 10 个工作日，工作量总共为 **8 到 9 天**\n- **开始日期始终为星期一，结束日期为星期日**\n- **使用 `YYMMDD-YYMMDD`（开始日期 - 结束日期）的格式**',
      },
    ],
  },
  // {
  //   id: 'history-3',
  //   role: 'user',
  //   datetime: '2024-01-01 10:01:00',
  //   content: [
  //     {
  //       type: 'text',
  //       data: '如何安装 TDesign React？',
  //     },
  //   ],
  // },
  // {
  //   id: 'history-4',
  //   role: 'assistant',
  //   datetime: '2024-01-01 10:01:03',
  //   status: 'complete',
  //   content: [
  //     {
  //       type: 'markdown',
  //       data: '安装 TDesign React 非常简单：\n\n```bash\nnpm install tdesign-react\n```',
  //     },
  //   ],
  // },
];

// 加载历史消息
const loadHistory = () => {
  chatRef.value?.setMessages(historyMessages, 'prepend');
  hasHistory.value = true;
};

// 消息配置：处理建议问题点击
const messageProps = {
  user: {
    variant: 'base',
    placement: 'right',
  },
  assistant: {
    animation: 'moving',
    avatar: "https://kanjian-content.oss-cn-hongkong.aliyuncs.com/star/images/png/2025-06-18/star 2-1750242759793.png",
    handleActions: {
      // 点击建议问题时，填充到输入框
      suggestion: ({ content }) => {
        chatRef.value?.addPrompt(content.prompt);
      },
    },
  },
};

const chatServiceConfig: ChatServiceConfig = {
  // 对话服务地址
  // endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal',
  endpoint: '/api/chat',
  // 是否开启流式传输
  stream: false,
  // 转换请求数据格式,匹配后端期望的格式
  onRequest: (params: ChatRequestParams) => {
    // 获取用户输入的消息
    const userMessage = params.prompt || '';

    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage
      })
    } as any;
  },
  // 非流式模式下,使用 onComplete 处理响应
  onComplete: (isAborted, _params, result) => {
    console.log('onComplete 触发');
    console.log('isAborted:', isAborted);
    console.log('result:', result);

    // 解析返回数据
    const responseData = result || {};
    const message = responseData.reply || responseData.msg || responseData.message || responseData.data || '';

    return {
      type: 'markdown',
      data: message,
    } as AIMessageContent;
  },
  // 解析返回数据，转换为组件所需格式
  onMessage: (chunk: SSEChunkData) => {
    console.log('onMessage 触发');
    console.log('收到响应:');
    const { ...rest } = chunk.data as any;
    console.log(rest);
    return {
      type: 'markdown',
      data: rest?.msg || rest?.message || '',
    } as AIMessageContent;
  },
  // 错误处理
  onError: async (err: any) => {
    console.error('请求错误:', err);

    if (chatRef.value) {
      try {
        // 1. 先终止当前的请求/消息
        await chatRef.value.abortChat();

        console.log('已终止当前请求');

        // 2. 添加错误消息
        await chatRef.value.sendAIMessage({
          content: [
            {
              type: 'text',
              // data: err?.message || 'Oops! An error occurred. Please try again.',
              data: 'Oops! An error occurred. Please try again.',
              status: 'error',
            }
          ],
          sendRequest: false,
        });

        console.log('错误消息已添加');
      } catch (error) {
        console.error('处理错误消息失败:', error);
      }
    }
  },
};
</script>

<style>
.chatbot {
  width: 90vw;
  height: 90vh;
  /* 使用 CSS 变量覆盖组件默认间距 */
  --td-chat-item-gap: 0;
  --td-chat-item-content-max-width: 100%;
}
.t-chat__item__content {
  max-width: 100%;
}
</style>
