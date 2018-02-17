import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options'

function loadStories() {
  require('./stories/index.js');
  // You can require as many stories as you need.
}
setOptions({
  name: 'Sawa Carousel',
  url: 'https://github.com/michalczaplinski/sawa',
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: false,
  showSearchBox: false,
  downPanelInRight: false,
  sortStoriesByKind: false,
})

configure(loadStories, module);