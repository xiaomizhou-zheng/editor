import React, { useReducer, useEffect, useCallback, useMemo } from 'react';
import isEqual from 'lodash/isEqual';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { Article, ArticleItem } from '../../model/Article';
import { WhatsNewArticleItem, WhatsNewArticle } from '../../model/WhatsNew';
import { REQUEST_STATE } from '../../model/Requests';
import { HistoryItem, articleId, ARTICLE_TYPE } from '../../model/Help';
import { createCtx } from '../../util/hooks/ctx';

import { VIEW } from '../constants';

import { useHelpArticleContext } from './helpArticleContext';
import { useWhatsNewArticleContext } from './whatsNewArticleContext';
import { useHomeContext } from './homeContext';
import { useSearchContext } from './searchContext';
import { useHeaderContext } from './headerContext';

type ViewType = keyof typeof VIEW;

interface NavigationProviderInterface {
  // Navigation data this prop is optional. ID of the article to display and the history
  navigationData?: {
    articleId: articleId;
    history: HistoryItem[];
  };
  // Setter for the navigation data. This prop is optional
  setNavigationData?(navigationData: {
    articleId: articleId;
    history: HistoryItem[];
  }): void;
}

interface NavigationContextInterface {
  articleId?: articleId;
  history?: HistoryItem[];
  historySetter?(history: HistoryItem[]): void;
  view: ViewType;
  openArticle(id: articleId): void;
  canNavigateBack: boolean;
  navigateBack?(): void;
  onGetArticle?(id: articleId): Promise<Article | WhatsNewArticle>;
  getCurrentArticle(): HistoryItem | undefined;
  getCurrentArticleItemData(): ArticleItem | WhatsNewArticleItem | undefined;
  reloadHelpArticle?(historyItem: HistoryItem): void;
  reloadWhatsNewArticle?(historyItem: HistoryItem): void;
  isOverlayVisible: boolean;
  onClose?(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ): void;
}

const DEFAULT_ARTICLE_ID = { id: '', type: ARTICLE_TYPE.HELP_ARTICLE };

export const [useNavigationContext, CtxProvider] = createCtx<
  NavigationContextInterface
>();

const getNewHistoryItem = (id: string, type: ARTICLE_TYPE) => {
  let uid = Math.floor(Math.random() * Math.pow(10, 17));
  const newHistoryItem: HistoryItem = {
    uid,
    id,
    type,
    state: REQUEST_STATE.load,
  };

  return newHistoryItem;
};

/**
 * Get a simplified version of the history. The items in this array should
 * have only the ID, UID and state === 'reload'
 */
const getSimpleHistory = (history: HistoryItem[]) =>
  history.map((historyItem) => {
    const { id, uid, type } = historyItem;
    return { id, uid, state: REQUEST_STATE.reload, type };
  });

/**
 * Get history data (list of IDs and UID)
 */
const getHistoryData = (history: HistoryItem[]) =>
  history.map((historyItem) => {
    const { id, uid } = historyItem;
    return { id, uid };
  });

/**
 * Get the last article in the history
 */
const getCurrentArticle = (history: HistoryItem[]): HistoryItem =>
  history[history.length - 1];

/**
 * Get an ArticleItem/WhatsNewArticleItem based on the last article in the history
 */
const getCurrentArticleItemSlim = (
  history: HistoryItem[],
): ArticleItem | WhatsNewArticleItem | undefined => {
  const { article, type } = getCurrentArticle(history);

  if (article) {
    if (type === ARTICLE_TYPE.HELP_ARTICLE) {
      const { body, relatedArticles, ...articleItemData } = article as Article;
      const currentArticleSlimData: ArticleItem = articleItemData;

      return currentArticleSlimData;
    } else if (type === ARTICLE_TYPE.WHATS_NEW) {
      const {
        description,
        ...whatsNewArticleItemData
      } = article as WhatsNewArticle;
      const currentWhatsNewArticleSlimData: WhatsNewArticleItem = whatsNewArticleItemData;

      return currentWhatsNewArticleSlimData;
    }
  }
};

const getViewForArticleId = (articleId: articleId): ViewType => {
  let view = VIEW.DEFAULT_CONTENT;

  if (articleId.type === ARTICLE_TYPE.HELP_ARTICLE) {
    if (articleId.id) {
      view = VIEW.ARTICLE;
    } else {
      view = VIEW.DEFAULT_CONTENT;
    }
  } else if (articleId.type === ARTICLE_TYPE.WHATS_NEW) {
    if (articleId.id) {
      view = VIEW.WHATS_NEW_ARTICLE;
    } else {
      view = VIEW.WHATS_NEW;
    }
  }
  return view;
};

interface navigationReducerState {
  articleId: articleId;
  history: HistoryItem[];
  view: ViewType;
}

interface navigationReducerAction<Type> {
  type: string;
  payload?: Type;
}

const navigationReducer = (
  {
    articleId: currentArticleId,
    history: currentHistory,
    view: currentView,
  }: navigationReducerState,
  action: navigationReducerAction<any>,
): navigationReducerState => {
  let newState = {
    articleId: currentArticleId,
    history: currentHistory,
    view: currentView,
  };

  if (action.type === 'newArticle' && action.payload) {
    const {
      payload: newArticleId,
    }: navigationReducerAction<articleId> = action;

    if (isEqual(newArticleId, DEFAULT_ARTICLE_ID)) {
      newState = {
        articleId: newArticleId,
        history: [],
        view: VIEW.DEFAULT_CONTENT,
      };
    } else {
      newState = {
        articleId: newArticleId,
        history: [
          ...currentHistory,
          getNewHistoryItem(newArticleId.id, newArticleId.type),
        ],
        view: getViewForArticleId(newArticleId),
      };
    }
  } else if (action.type === 'addNewHistoryItem' && action.payload) {
    const {
      payload: newArticleId,
    }: navigationReducerAction<articleId> = action;

    newState = {
      articleId: currentArticleId,
      history: [
        ...currentHistory,
        getNewHistoryItem(newArticleId.id, newArticleId.type),
      ],
      view: getViewForArticleId(currentArticleId),
    };
  } else if (action.type === 'updateHistoryItem' && action.payload) {
    const {
      payload: HistoryItemUpdate,
    }: navigationReducerAction<HistoryItem> = action;
    const index = currentHistory.findIndex(
      (historyItemTemp) => historyItemTemp.uid === HistoryItemUpdate.uid,
    );

    if (index !== -1) {
      const newHistory: HistoryItem[] = [...currentHistory];
      newHistory[index] = { ...HistoryItemUpdate };
      newState = {
        articleId: currentArticleId,
        history: newHistory,
        view: getViewForArticleId(currentArticleId),
      };
    }
  } else if (action.type === 'removeLastHistoryItem') {
    const newHistory: HistoryItem[] =
      currentHistory.length > 0 ? [...currentHistory] : [];

    if (newHistory.length > 0) {
      newHistory.splice(-1);
    }

    newState = {
      articleId: currentArticleId,
      history: newHistory,
      view: getViewForArticleId(currentArticleId),
    };
  } else if (action.type === 'removeAllHistoryItems') {
    const defaultHistory: HistoryItem[] = [];

    newState = {
      articleId: currentArticleId,
      history: defaultHistory,
      view: VIEW.DEFAULT_CONTENT,
    };
  } else if (action.type === 'updateArticleId' && action.payload) {
    const {
      payload: newArticleId,
    }: navigationReducerAction<articleId> = action;

    newState = {
      articleId: newArticleId,
      history: currentHistory,
      view: getViewForArticleId(newArticleId),
    };
  } else if (action.type === 'updateView' && action.payload) {
    const { payload: newView }: navigationReducerAction<ViewType> = action;

    newState = {
      articleId: currentArticleId,
      history: currentHistory,
      view: newView,
    };
  }

  return newState;
};

export const NavigationContextProvider: React.FC<NavigationProviderInterface> = ({
  navigationData = {
    articleId: DEFAULT_ARTICLE_ID,
    history: [],
  },
  setNavigationData,
  children,
}) => {
  const { onGetHelpArticle } = useHelpArticleContext();
  const { onGetWhatsNewArticle } = useWhatsNewArticleContext();
  const { homeContent, homeOptions } = useHomeContext();
  const { onSearch, isSearchResultVisible, searchValue } = useSearchContext();
  const { onCloseButtonClick } = useHeaderContext();
  const { articleId: propsArticleId, history: propsHistory } = navigationData;

  const [
    { articleId: currentArticleId, history: currentHistory, view: currentView },
    dispatchNavigationAction,
  ] = useReducer(navigationReducer, {
    articleId: propsArticleId,
    history:
      !isEqual(propsArticleId, DEFAULT_ARTICLE_ID) && propsHistory.length === 0
        ? [getNewHistoryItem(propsArticleId.id, propsArticleId.type)]
        : propsHistory,
    view: VIEW.DEFAULT_CONTENT,
  });
  const isOverlayVisible = useMemo((): boolean => {
    return (
      currentView === VIEW.ARTICLE ||
      currentView === VIEW.SEARCH ||
      currentView === VIEW.WHATS_NEW ||
      currentView === VIEW.WHATS_NEW_ARTICLE
    );
  }, [currentView]);
  const isDefaultContentDefined = useMemo((): boolean => {
    return homeContent !== undefined || homeOptions !== undefined;
  }, [homeContent, homeOptions]);
  const canNavigateBack = useMemo((): boolean => {
    /**
     * - If default content isn't defined and the history only has one article,
     * we should not display the back button
     */
    if (
      (currentHistory.length === 1 && !isDefaultContentDefined) ||
      (currentView === VIEW.WHATS_NEW && !isDefaultContentDefined)
    ) {
      return false;
    }

    /**
     * if an overlay is visible return true to display the back buton
     */
    return isOverlayVisible;
  }, [
    currentHistory.length,
    isDefaultContentDefined,
    isOverlayVisible,
    currentView,
  ]);

  const fetchArticleData = useCallback(
    async (historyItem: HistoryItem) => {
      try {
        let article;
        switch (historyItem.type) {
          case ARTICLE_TYPE.HELP_ARTICLE:
            if (!onGetHelpArticle) {
              throw new Error('onGetHelpArticle prop not defined');
            }

            article = await onGetHelpArticle({
              id: historyItem.id,
              type: historyItem.type,
            });
            break;

          case ARTICLE_TYPE.WHATS_NEW:
            if (!onGetWhatsNewArticle) {
              throw new Error('onGetWhatsNewArticle prop not defined');
            }

            if (historyItem.id === '') {
              break;
            }

            article = await onGetWhatsNewArticle({
              id: historyItem.id,
              type: historyItem.type,
            });

            break;

          default:
            throw new Error('onGetHelpArticle prop not defined');
            break;
        }

        return {
          ...historyItem,
          ...(article && { article }),
          state: REQUEST_STATE.done,
        };
      } catch (error) {
        return { ...historyItem, state: REQUEST_STATE.error };
      }
    },
    [onGetHelpArticle, onGetWhatsNewArticle],
  );

  const reloadArticle = useCallback(async (historyItem: HistoryItem) => {
    let historyItemToReload = { ...historyItem };

    if (
      historyItem.type === ARTICLE_TYPE.HELP_ARTICLE ||
      historyItem.type === ARTICLE_TYPE.WHATS_NEW
    ) {
      historyItemToReload.state = REQUEST_STATE.loading;
    } else {
      historyItemToReload.state = REQUEST_STATE.error;
    }

    dispatchNavigationAction({
      type: 'updateHistoryItem',
      payload: historyItemToReload,
    });
  }, []);

  const navigateBack = useCallback(async () => {
    /**
     * If the user is in the search screen, just clean the search. That will make the search results
     * overlay disapear and show the last element in the history or (if is defined) the default content
     * */
    if (currentView === VIEW.SEARCH && onSearch) {
      if (searchValue !== '') {
        onSearch('');
        return;
      } else {
        dispatchNavigationAction({
          type: 'updateView',
          payload: currentArticleId.type,
        });
        return;
      }
    }

    //  if the history is not empty and ...
    if (currentHistory.length > 0) {
      // the history has more than one article, navigate back through the history
      if (currentHistory.length > 1) {
        // Remove last element
        dispatchNavigationAction({
          type: 'removeLastHistoryItem',
        });
      } else if (currentHistory.length === 1) {
        // but if the history only has one item, clear the history
        dispatchNavigationAction({
          type: 'removeAllHistoryItems',
        });
      }
    }
  }, [
    currentView,
    onSearch,
    currentHistory.length,
    searchValue,
    currentArticleId.type,
  ]);

  const onClose = useCallback(
    (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void => {
      if (onCloseButtonClick) {
        dispatchNavigationAction({
          type: 'removeAllHistoryItems',
        });
        onCloseButtonClick(event, analyticsEvent);
      }
    },
    [onCloseButtonClick],
  );

  const onOpenArticle = useCallback((newArticleId: articleId) => {
    dispatchNavigationAction({
      type: 'addNewHistoryItem',
      payload: newArticleId,
    });
  }, []);

  useEffect(() => {
    if (isSearchResultVisible) {
      dispatchNavigationAction({
        type: 'updateView',
        payload: VIEW.SEARCH,
      });
    }
  }, [isSearchResultVisible]);

  useEffect(() => {
    const lastHistoryItem =
      currentHistory.length > 0
        ? getCurrentArticle(currentHistory)
        : getNewHistoryItem(DEFAULT_ARTICLE_ID.id, DEFAULT_ARTICLE_ID.type);

    /**
     * If the propsArticleId.id (host articleId) is different from currentArticleId.id (internal articleId)
     * */
    if (!isEqual(propsArticleId, currentArticleId)) {
      /**
       * If propsArticleId and lastHistoryItem are the same, we just need to update the articleId
       * because is out of sync
       */
      if (
        propsArticleId.id === lastHistoryItem.id &&
        propsArticleId.type === lastHistoryItem.type
      ) {
        dispatchNavigationAction({
          type: 'updateArticleId',
          payload: propsArticleId,
        });
      } else {
        /**
         * Otherwise we need to add a new article
         */
        dispatchNavigationAction({
          type: 'newArticle',
          payload: propsArticleId,
        });
      }
    } else {
      if (setNavigationData) {
        const simpleHistory = getSimpleHistory(currentHistory);

        if (
          currentArticleId.id !== lastHistoryItem.id ||
          currentArticleId.type !== lastHistoryItem.type
        ) {
          /**
           * If the propsArticleId.id (host articleId) is equal to currentArticleId.id (internal articleId)
           * and the id from the last history item is different from currentArticleId.id, it means the history
           * changed
           * */
          if (setNavigationData) {
            setNavigationData({
              articleId: { id: lastHistoryItem.id, type: lastHistoryItem.type },
              history: simpleHistory,
            });
          }
        } else if (
          !isEqual(getHistoryData(propsHistory), getHistoryData(currentHistory))
        ) {
          setNavigationData({
            articleId: propsArticleId,
            history: simpleHistory,
          });
        }
      }
    }
  }, [
    currentArticleId,
    propsArticleId,
    currentHistory,
    setNavigationData,
    propsHistory,
  ]);

  useEffect(() => {
    const requestNewArticle = async (historyItem: HistoryItem) => {
      const historyItemUpdate = await fetchArticleData(historyItem);
      dispatchNavigationAction({
        type: 'updateHistoryItem',
        payload: historyItemUpdate,
      });
    };

    /**
     * If the last history item state is "loading" or "reload", we need to request the article (fetch article from API)
     */
    const lastHistoryItem = getCurrentArticle(currentHistory);
    if (
      lastHistoryItem?.state === REQUEST_STATE.load ||
      lastHistoryItem?.state === REQUEST_STATE.reload
    ) {
      requestNewArticle(lastHistoryItem);
      dispatchNavigationAction({
        type: 'updateHistoryItem',
        payload: { ...lastHistoryItem, state: REQUEST_STATE.loading },
      });
    }
  }, [currentArticleId, currentHistory, fetchArticleData]);

  return (
    <CtxProvider
      value={{
        view: currentView,
        articleId: currentArticleId,
        openArticle: onOpenArticle,
        history: currentHistory,
        getCurrentArticle: () => getCurrentArticle(currentHistory),
        getCurrentArticleItemData: () =>
          getCurrentArticleItemSlim(currentHistory),
        reloadHelpArticle: onGetHelpArticle && reloadArticle,
        reloadWhatsNewArticle: onGetWhatsNewArticle && reloadArticle,
        canNavigateBack,
        navigateBack,
        isOverlayVisible,
        onClose,
      }}
    >
      {children}
    </CtxProvider>
  );
};
