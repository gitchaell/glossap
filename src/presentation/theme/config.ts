import { config as defaultConfig } from '@gluestack-ui/config';

export const config = {
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    fonts: {
      ...defaultConfig.tokens.fonts,
      heading: 'GoogleSans-Bold',
      body: 'GoogleSans',
      mono: 'GoogleSansCode',
    },
  },
};
