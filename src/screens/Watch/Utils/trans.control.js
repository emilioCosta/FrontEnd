import _ from 'lodash';
import { isMobile } from 'react-device-detect';
import { api } from 'utils';
import { timeStrToSec, colorMap } from './helpers';
import { videoControl } from './player.control';
import { promptControl } from './prompt.control';
import { preferControl } from './preference.control';
import { uEvent } from './UserEventController';
import {
  CC_COLOR_WHITE,
  CC_COLOR_BLACK,
  CC_OPACITY_75,
  CC_POSITION_BOTTOM,
  CC_FONT_SANS_SERIF,
  CC_SIZE_100,
  WEBVTT_SUBTITLES,
  WEBVTT_DESCRIPTIONS,
  ENGLISH,
  ARRAY_EMPTY,
  // PROFANITY_LIST,
  TRANSCRIPT_VIEW,
  LINE_VIEW,
  HIDE_TRANS,
  CO_CHANGE_VIDEO,
  BULK_EDIT_MODE,
} from './constants.util';
// import { adSample } from './data'

/**
 * @description The handlers for caption setting events
 *
 */
export const transControl = {
  externalFunctions: {},

  /**
   * @param {Function}
   * setTranscriptions, setCurrTrans, setTranscript, setCaptions, setCurrCaption, setDescriptions, setCurrDescription,
   * setOpenCC, setCurrEditing, setOpenAD, setTransView
   * cc_setColor, cc_setBG, cc_setSize, cc_setOpacity, cc_setPosition, cc_setFont
   */
  init(props) {
    // console.log('externalFunctions', externalFunctions)
    const {
      setCurrTrans,
      setTranscriptions,
      setTranscript,
      setCaptions,
      setCurrCaption,
      setDescriptions,
      setCurrDescription,
      setCurrEditing,
      setBulkEditing,
      setOpenCC,
      setOpenAD,
      setTransView,
      cc_setColor,
      cc_setBG,
      cc_setSize,
      cc_setOpacity,
      cc_setPosition,
      cc_setFont,
    } = props;

    this.externalFunctions = {
      setCurrTrans,
      setTranscriptions,
      setTranscript,
      setCaptions,
      setCurrCaption,
      setDescriptions,
      setCurrDescription,
      setCurrEditing,
      setBulkEditing,
      setOpenCC,
      setOpenAD,
      setTransView,
      cc_setColor,
      cc_setBG,
      cc_setSize,
      cc_setOpacity,
      cc_setPosition,
      cc_setFont,
    };
  },

  clear(opt = CO_CHANGE_VIDEO) {
    if (opt === CO_CHANGE_VIDEO) {
      this.transcriptions_ = [];
      this.currTrans_ = {};

      this.descriptions_ = [];
      this.currDescription_ = {};
      this.prevDescription_ = null;

      this.captions_ = [];
      this.currCaption_ = {};
      this.prevCaption_ = null;

      this.transcript_ = [];
      this.currTranscript_ = {};
      this.currEditing_ = {};
      this.isEditing = false;
      this.editText = '';
      this.isMourseOverTrans = false;
    }
  },

  /**
   * Transcriptions
   * Action handlers for transcriptions
   * **************************************************************************************************
   */
  transcriptions_: [],
  currTrans_: {},

  /**
   * Function used to initialize transcriptions of the video
   */
  transcriptions(trans) {
    if (trans === undefined) return this.transcriptions_;

    const { setTranscriptions } = this.externalFunctions;
    if (setTranscriptions) {
      setTranscriptions(trans);
      this.transcriptions_ = trans;
      // console.log('trans', trans)

      // Set the default current-transcription to be English
      const currTrans = this.findTransByLanguage(ENGLISH); // trans.find(tran => tran.language === 'en-US')
      uEvent.registerLanguage(ENGLISH);
      if (currTrans) {
        this.currTrans(currTrans);
      } else {
        this.transcript(ARRAY_EMPTY);
        if (!isMobile) this.transView(HIDE_TRANS, { updatePrefer: false });
      }
    }
  },

  /**
   * Function called for setting current transcription (aka language)
   */
  async currTrans(tran) {
    if (tran === undefined) return this.currTrans_;
    if (!tran.id) return this.currTrans_;

    // Set current transcription
    const { setCurrTrans } = this.externalFunctions;
    if (setCurrTrans) setCurrTrans(tran);
    this.currTrans_ = tran;
    // console.log('currTrans', tran)

    // Get and set corresponding captions
    const { data = [] } = await api.getCaptionsByTranscriptionId(tran.id);
    this.captions(data);
    const descriptions = []; // adSample // need to modify
    this.descriptions(descriptions);
    let transcript = this.unionTranscript(this.captions(), this.descriptions());
    if (transcript.length === 0) transcript = ARRAY_EMPTY;
    this.transcript(transcript);
  },

  /**
   * Descriptions
   * Action handlers for descriptions
   * **************************************************************************************************
   */
  descriptions_: [],
  currDescription_: {},
  prevDescription_: null,

  /**
   * Function called for get or set audio descriptions
   * @todo how??
   */
  descriptions(des) {
    if (des === undefined) return this.descriptions_;
    const parsedDes = _.map(des, (d) => ({ ...d, kind: WEBVTT_DESCRIPTIONS }));

    const { setDescriptions } = this.externalFunctions;
    if (setDescriptions) {
      // if (des.length === 0) des = ARRAY_EMPTY
      setDescriptions(parsedDes);
      this.descriptions_ = parsedDes;
    }
  },

  findDescription(now) {
    const next = this.findCurrent(this.descriptions_, null, now);
    this.prevDescription_ = next;
    return next;
  },
  /**
   * Function called for setting current description
   */
  updateDescription(desciption) {
    const { setCurrDescription } = this.externalFunctions;
    if (setCurrDescription) {
      setCurrDescription(desciption);
      this.currDescription_ = desciption;
    }
  },

  /**
   * Captions
   * Action handlers for captions
   * **************************************************************************************************
   */
  captions_: [],
  // caption of current time
  currCaption_: {},
  // the preverious
  prevCaption_: null,

  /**
   * Function called for setting captions array
   */
  captions(cap) {
    if (cap === undefined) return this.captions_;
    let parsedCap = _.map(cap, (c) => ({ ...c, kind: WEBVTT_SUBTITLES }));
    const { setCaptions } = this.externalFunctions;
    if (setCaptions) {
      if (parsedCap.length === 0) parsedCap = ARRAY_EMPTY;
      this.captions_ = parsedCap;
      setCaptions(parsedCap);
      this.prevCaption_ = null;
    }
  },

  /**
   * Function Used to find the caption based on current time
   */
  findCaption(now) {
    const deterFunc = (item, prev) => {
      return (
        item.kind === WEBVTT_SUBTITLES ||
        !prev ||
        item.kind !== prev.kind ||
        (item.kind === WEBVTT_DESCRIPTIONS && item !== prev)
      );
    };
    const next = this.findCurrent(this.captions_, this.prevCaption_, now, deterFunc);
    this.prevCaption_ = next;
    return next;
  },

  /**
   * Function used to update the current caption
   */
  updateCaption(currCaption) {
    // if (!this.openCC_) return null;
    const { setCurrCaption } = this.externalFunctions;
    // console.log('currCaption', currCaption.begin, currCaption.text)
    if (Boolean(currCaption) && Boolean(setCurrCaption)) {
      // setCurrCaption(currCaption)
      this.currCaption_ = currCaption;
    }
  },

  /**
   * Transcript
   * Action handlers for transcript
   * **************************************************************************************************
   */
  //
  transcript_: [],
  currTranscript_: {},
  // item that is being edited
  currEditing_: {},
  isEditing: false,
  editText: '',
  // true if mouse over trans box
  isMourseOverTrans: false,

  transcript(transcript_) {
    if (transcript_ === undefined) return this.transcript_;
    const { setTranscript, setCurrCaption } = this.externalFunctions;
    this.transcript_ = transcript_;
    if (setTranscript) setTranscript(transcript_);
    this.currCaption_ = transcript_[0] || null;
    setCurrCaption(this.currCaption_);
  },

  updateTranscript(now) {
    if (this.transcript_ === ARRAY_EMPTY) return null;
    const next = this.findCurrent(this.transcript_, this.prevCaption_, now);
    if (next && next.id) {
      // pause video if it's AD
      if (next.kind === WEBVTT_DESCRIPTIONS) {
        this.updateDescription(next);
        if (preferControl.pauseWhileAD() && this.prevCaption_ !== next) videoControl.pause();
      }

      // determine whether should scroll smoothly
      const smoothScroll =
        this.prevCaption_ && next && Math.abs(this.prevCaption_.index - next.index) === 1;

      this.prevCaption_ = next;
      this.updateCaption(next);
      if (preferControl.autoScroll()) {
        this.scrollTransToView(next.id, smoothScroll);
      }
    }
    return next || null;
  },

  /**
   * Function called when editing selected caption
   */
  edit(caption, innerText) {
    // if no param caption, edit current caption
    const currCap = caption || this.currCaption_;
    const { setCurrEditing } = this.externalFunctions;
    this.isEditing = Boolean(currCap);
    if (setCurrEditing) {
      setCurrEditing(currCap);
      this.currEditing_ = currCap;
      if (currCap) this.editText = innerText || currCap.text;
      if (preferControl.pauseWhileEditing()) videoControl.pause();
      if (preferControl.showCaptionTips()) {
        promptControl.editCaptionTips();
        preferControl.showCaptionTips(false);
      }
    }
  },
  /**
   * Function called for editing current caption
   */
  editCurrent() {
    const id = this.currCaption_.id;
    const currTextArea = document.getElementById(`caption-line-textarea-${id}`);
    if (currTextArea) {
      currTextArea.focus();
      promptControl.editCaptionUsingKeyboard();
    }
  },

  /**
   * Functon called for input change as editing captions
   */
  handleChange(text) {
    this.editText = text;
  },

  /**
   * Function called when save caption
   */
  async handleSaveEditing() {
    const { setCurrEditing } = this.externalFunctions;
    const text = this.editText;
    /**
     * @todo check PROFANITY_LIST
     */
    if (!text || (this.currEditing_ && this.currEditing_.text === text)) {
      this.editText = '';
      promptControl.closePrompt();
      return this.edit(null);
    }
    promptControl.savingCaption();
    this.isEditing = false;

    if (setCurrEditing) {
      const { id } = this.currEditing_;
      // send user event
      uEvent.edittrans(videoControl.currTime(), this.currEditing_.text, text);
      // update new text
      this.currEditing_.text = text;
      setCurrEditing(null);
      try {
        await api.updateCaptionLine({ id, text });
        if (this.captions_.length > 0) {
          this.captions(this.captions_);
        }
        promptControl.savedCaption();
      } catch (error) {
        promptControl.savedCaption(false);
      }
    }
  },

  handleCancelEditing() {
    const { setCurrEditing } = this.externalFunctions;
    if (setCurrEditing) {
      setCurrEditing(null);
      this.isEditing = false;
    }
  },

  /**
   * Function called when mouse over the transcription area
   * To prevent scrolling
   */
  handleMourseOver(bool) {
    this.isMourseOverTrans = bool;
  },
  /**
   * Function called when blurring on current editing caption
   */
  handleBlur() {
    // this.isEditing = false
    // this.edit(null)
  },

  /**
   * Function that scrolls the captions
   */
  scrollTransToView(id, smoothScroll = true) {
    if (this.isMourseOverTrans || this.isEditing) return;
    let capId = id;
    if (id === undefined && Boolean(this.currTrans_)) {
      capId = this.currTrans_.id;
    }
    if (!capId) return;
    const capElem = document.getElementById(`caption-line-${capId}`);
    if (!capElem || !capElem.offsetTop) return;

    const tranBox = document.getElementById('watch-trans-container');
    const isTwoScreen = videoControl.isTwoScreen();

    const shouldSmoothScroll = smoothScroll && tranBox.scrollTop - capElem.offsetTop < 0;

    if (!shouldSmoothScroll) tranBox.style.scrollBehavior = 'auto';
    capElem.classList.add('curr-line');
    const scrollTop =
      window.innerWidth < 900 || !isTwoScreen ? capElem.offsetTop - 50 : capElem.offsetTop - 80;
    // if (preferControl.defaultTransView() === TRANSCRIPT_VIEW) scrollTop -= 400
    tranBox.scrollTop = scrollTop;
    if (!shouldSmoothScroll) tranBox.style.scrollBehavior = 'smooth';
  },

  /**
   * Handlers for bulk editing
   * **************************************************************************************************
   */
  bulkEditing_: false,
  transcriptCpy_: [],
  setTransCpy() {},
  bulkEdit(bool) {
    const { setBulkEditing } = this.externalFunctions;
    let bulkEditing = false;
    if (bool === undefined) {
      bulkEditing = !this.bulkEditing_;
    } else {
      bulkEditing = Boolean(bool);
    }

    setBulkEditing(bulkEditing);
    this.bulkEditing_ = bulkEditing;
    if (bulkEditing) {
      videoControl.mode(BULK_EDIT_MODE, { sendUserAction: false });
      this.transcriptCpy_ = _.cloneDeep(this.transcript_);
    } else {
      videoControl.mode(null, { restore: true, sendUserAction: false });
    }
  },

  bulkEditOnChange(index, key, value) {
    this.transcriptCpy_[index][key] = value;
  },

  bulkEditOnSave() {
    this.transcript(this.transcriptCpy_);
    this.bulkEdit(false);
  },

  bulkEditOnMergeDown(index) {
    if (this.transcriptCpy_[index + 1]) {
      this.transcriptCpy_[index].text += ` ${this.transcriptCpy_[index + 1].text}`;
      this.transcriptCpy_[index].end = this.transcriptCpy_[index + 1].end;

      this.bulkEditOnDelete(index + 1);
    }
  },

  bulkEditOnDelete(index) {
    // $(`#bulk-edit-capline-${index}`).fadeOut(() => {
    //   // _.remove(this.transcriptCpy_, (val, idx) => idx === index )
    //   // this.transcriptCpy_ = [ ...this.transcriptCpy_ ]
    //   // this.setTransCpy(this.transcriptCpy_)
    // })
    _.remove(this.transcriptCpy_, (val, idx) => idx === index);
    this.transcriptCpy_ = [...this.transcriptCpy_];
    this.setTransCpy(this.transcriptCpy_);
  },

  bulkEditOnInsert(index, kind = 'subtitles') {
    this.transcriptCpy_ = [
      ...this.transcriptCpy_.slice(0, index),
      {
        kind,
        index,
        id: '',
        begin: '00:00:00.00',
        end: '00:00:00.00',
        text: '',
        upVote: 0,
        downVote: 0,
        transcriptionId: this.transcriptCpy_[0].transcriptionId,
      },
      ...this.transcriptCpy_.slice(index),
    ];
    this.setTransCpy(this.transcriptCpy_);
  },

  /**
   * Handlers for open or close events
   * **************************************************************************************************
   */

  // Set current language
  setLanguage(language) {
    const currTrans = this.findTransByLanguage(language);
    if (currTrans) {
      this.currTrans(currTrans);
    }
    uEvent.langchange(videoControl.currTime(), language);
    uEvent.registerLanguage(language);
  },

  // Close or open CC
  openCC_: preferControl.cc(),
  closedCaption(bool) {
    const { setOpenCC } = this.externalFunctions;
    if (setOpenCC) {
      setOpenCC(bool);
      this.openCC_ = bool;
      preferControl.cc(bool);
    }
  },
  handleOpenCC() {
    this.closedCaption(!this.openCC_);
  },

  // Close or open AD
  openAD_: preferControl.ad(),
  audioDescription(bool) {
    const { setOpenAD } = this.externalFunctions;
    if (setOpenAD) {
      setOpenAD(bool);
      this.openAD_ = bool;
      preferControl.ad(bool);
    }
  },
  handleOpenAD() {
    this.audioDescription(!this.openAD_);
  },

  // Switch trancript view,
  TRANS_VIEW: preferControl.defaultTransView(),
  LAST_TRANS_VIEW: preferControl.defaultTransView(),
  transView(view, config = {}) {
    const { setTransView } = this.externalFunctions;
    const { sendUserAction = true, updatePrefer = true } = config;
    if (setTransView) {
      this.LAST_TRANS_VIEW = this.TRANS_VIEW;
      this.TRANS_VIEW = view;
      setTransView(view);
      setTimeout(() => {
        if (this.currCaption_ && this.currCaption_.id)
          this.scrollTransToView(this.currCaption_.id, false);
      }, 200);
      if (updatePrefer) preferControl.defaultTransView(view);
    }

    if (sendUserAction) uEvent.transviewchange(videoControl.currTime(), view);
  },
  handleTransViewSwitch() {
    const view = this.TRANS_VIEW;
    if (view === HIDE_TRANS) {
      if (isMobile) {
        this.transView(TRANSCRIPT_VIEW);
      } else {
        this.transView(LINE_VIEW);
      }
    } else if (view === TRANSCRIPT_VIEW) {
      this.transView(HIDE_TRANS);
    } else {
      this.transView(TRANSCRIPT_VIEW);
    }
  },
  handleOpenTrans() {
    const view = preferControl.defaultTransView();
    if (view === HIDE_TRANS) {
      this.transView(TRANSCRIPT_VIEW);
    } else {
      this.transView(HIDE_TRANS);
    }
  },

  /**
   * Functions for closed caption style setting
   * **************************************************************************************************
   */

  cc_color: CC_COLOR_WHITE, // cc_setColor
  cc_bg: CC_COLOR_BLACK, // cc_setBG
  cc_size: CC_SIZE_100, // cc_setSize
  cc_opacity: CC_OPACITY_75, // cc_setOpacity
  cc_font: CC_FONT_SANS_SERIF, // cc_setFont
  cc_position: CC_POSITION_BOTTOM, // cc_setPosition

  getCCStyle(options) {
    const {
      cc_color = CC_COLOR_WHITE,
      cc_bg = CC_COLOR_BLACK,
      cc_size = CC_SIZE_100,
      cc_opacity = CC_OPACITY_75,
      cc_font = CC_FONT_SANS_SERIF,
      cc_position = CC_POSITION_BOTTOM,
    } = options;

    const ccStyle = {
      backgroundColor: colorMap(cc_bg, cc_opacity),
      color: cc_color,
      fontSize: `${cc_size + 0.25}rem`, // +.25 to get a larger default font size
      fontFamily: cc_font,
    };

    const ccContainerStyle = {};

    if (cc_position === 'top') {
      ccContainerStyle.top = '.7em';
    } else {
      // cc_position === 'bottom'
      ccContainerStyle.bottom = '.7em';
    }

    return { ccStyle, ccContainerStyle };
  },

  ccColor(value) {
    if (value === undefined) return this.cc_color;
    const { cc_setColor } = this.externalFunctions;
    if (cc_setColor) {
      cc_setColor(value);
      this.cc_color = value;
    }
  },
  ccBG(value) {
    if (value === undefined) return this.cc_bg;
    const { cc_setBG } = this.externalFunctions;
    if (cc_setBG) {
      cc_setBG(value);
      this.cc_bg = value;
    }
  },
  ccOpacity(value) {
    if (value === undefined) return this.cc_opacity;
    const { cc_setOpacity } = this.externalFunctions;
    if (cc_setOpacity) {
      cc_setOpacity(value);
      this.cc_opacity = value;
    }
  },
  ccSize(value) {
    if (value === undefined) return this.cc_size;
    const { cc_setSize } = this.externalFunctions;
    if (cc_setSize) {
      cc_setSize(value);
      this.cc_size = value;
    }
  },
  ccIncreaseSize() {
    if (!this.openCC_) return;
    const size = this.ccSize();
    if (size + 0.25 <= 2) this.ccSize(size + 0.25);
  },
  ccDecreaseSize() {
    if (!this.openCC_) return;
    const size = this.ccSize();
    if (size - 0.25 >= 0.75) this.ccSize(size - 0.25);
    // console.log('size - .25', size - .25)
  },
  ccFont(value) {
    if (value === undefined) return this.cc_font;
    const { cc_setFont } = this.externalFunctions;
    if (cc_setFont) {
      cc_setFont(value);
      this.cc_font = value;
    }
  },
  ccPosition(value) {
    if (value === undefined) return this.cc_position;
    const { cc_setPosition } = this.externalFunctions;
    if (cc_setPosition) {
      cc_setPosition(value);
      this.cc_position = value;
    }
  },

  /**
   * Internal Helper Functions
   * **************************************************************************************************
   */

  /**
   * Function used to union two caption arrays
   * Merging is based on the { begin, end } of each entry in the arrays
   */
  unionTranscript(captions, source) {
    let union = _.concat(
      captions === ARRAY_EMPTY ? [] : captions,
      source === ARRAY_EMPTY ? [] : source,
    );
    // console.error(union)
    union = _.sortBy(union, (item) => timeStrToSec(item.begin));
    union = _.map(union, (item, index) => ({ ...item, index }));
    return union;
  },

  /**
   * Function used to find the transcription that matches the language
   */
  findTransByLanguage(language) {
    const transcriptions = this.transcriptions_;
    return _.find(transcriptions, { language });
  },

  /**
   * Find item based on current time
   */
  findCurrent(array = [], prev = {}, now = 0, deterFunc) {
    let next = prev;
    const isCurrent = (item) => {
      if (!item) return false;
      const end = timeStrToSec(item.end);
      const begin = timeStrToSec(item.begin);
      let deter = true;
      if (deterFunc) deter = deterFunc(item, prev);
      return begin <= now && now <= end && deter;
    };

    // if (isCurrent(prev)) {
    //   next = prev
    // }

    // if it's the first time to find captions
    if (!prev) {
      next = _.find(array, isCurrent) || null;

      // if looking for caption that is after the current one
    } else if (now > timeStrToSec(prev.begin)) {
      next = _.find(array, isCurrent, prev.index + 1) || prev;

      // if looking for caption that is prior to the current one
    } else if (now < timeStrToSec(prev.end)) {
      next = _.findLast(array, isCurrent, prev.index - 1) || prev;
    }

    if (next) this.prev = next;
    // if (next) console.error(next.kind)
    // else console.error('null')
    return next;
  },
};
