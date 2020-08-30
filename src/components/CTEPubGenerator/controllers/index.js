import EPubListController from './EPubListController';
import { epubState } from './EPubState';
import { epubHistory } from './EPubHistory';
import { epubData } from './EPubDataController';
import EPubController from './EPubController';
import EPubConstants from './EPubConstants';
import EPubChapterNavigator from './EPubChapterNavigator';
import EPubDownloader from './EPubDownloader';

const ePubCtrl = new EPubController();
const ePubNav = new EPubChapterNavigator();
const epubList = new EPubListController();

export const epub = {
  const: EPubConstants,
  state: epubState,
  list: epubList,
  history: epubHistory,
  data: epubData,
  ctrl: ePubCtrl,
  nav: ePubNav,
  download: EPubDownloader
};

export { default as CTEPubConstants } from './EPubConstants';
export * from './structs';
export * from './utils';
export * from './html-converters';