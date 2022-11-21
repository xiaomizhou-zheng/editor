/** @jsx jsx */
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  createRef,
  memo,
} from 'react';
import { jsx } from '@emotion/react';
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom';
import { FormattedMessage, MessageDescriptor } from 'react-intl-next';
import { getEmojiVariation } from '../../api/EmojiRepository';
import {
  EmojiProvider,
  OnEmojiProviderChange,
  supportsUploadFeature,
} from '../../api/EmojiResource';
import { customCategory, frequentCategory } from '../../util/constants';
import {
  containsEmojiId,
  isPromise /*, isEmojiIdEqual, isEmojiLoaded*/,
  isEmojiDescription,
} from '../../util/type-helpers';
import {
  EmojiDescription,
  EmojiId,
  EmojiSearchResult,
  EmojiUpload,
  OnEmojiEvent,
  OptionalEmojiDescription,
  OptionalEmojiDescriptionWithVariations,
  SearchOptions,
  SearchSort,
  ToneSelection,
} from '../../types';
import { getToneEmoji } from '../../util/filters';
import { uploadEmoji } from '../common/UploadEmoji';
import { createRecordSelectionDefault } from '../common/RecordSelectionDefault';
import { CategoryId } from './categories';
import CategorySelector from './CategorySelector';
import EmojiPickerFooter from './EmojiPickerFooter';
import EmojiPickerList from './EmojiPickerList';
import {
  AnalyticsEventPayload,
  CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  createAndFireEventInElementsChannel,
  categoryClickedEvent,
  closedPickerEvent,
  deleteBeginEvent,
  deleteCancelEvent,
  deleteConfirmEvent,
  openedPickerEvent,
  pickerClickedEvent,
  pickerSearchedEvent,
  selectedFileEvent,
  uploadBeginButton,
  uploadCancelButton,
  uploadConfirmButton,
  toneSelectorClosedEvent,
  ufoExperiences,
} from '../../util/analytics';
import { emojiPicker } from './styles';
import LegacyEmojiContextProvider from '../../context/LegacyEmojiContextProvider';
import { useDidMount } from '../hooks';

const FREQUENTLY_USED_MAX = 16;

export interface PickerRefHandler {
  (ref: any): any;
}

export interface Props {
  /**
   * EmojiResource instance that handles emoji meta data.
   */
  emojiProvider: EmojiProvider;
  /**
   * Callback to be executed when user selects an emoji.
   */
  onSelection?: OnEmojiEvent;
  /**
   * Callback performed when picker reference is being set.
   */
  onPickerRef?: PickerRefHandler;
  /**
   * Flag to disable tone selector.
   */
  hideToneSelector?: boolean;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
}

const EmojiPickerComponent = ({
  emojiProvider,
  onSelection,
  onPickerRef,
  hideToneSelector,
  createAnalyticsEvent,
}: Props) => {
  const [filteredEmojis, setFilteredEmojis] = useState<EmojiDescription[]>([]);
  const [searchEmojis, setSearchEmojis] = useState<EmojiDescription[]>([]);
  const [frequentlyUsedEmojis, setFrequentlyUsedEmojis] = useState<
    EmojiDescription[]
  >([]);
  const [query, setQuery] = useState<string>('');
  const [dynamicCategories, setDynamicCategories] = useState<CategoryId[]>([]);
  const [selectedTone, setSelectedTone] = useState(
    !hideToneSelector ? emojiProvider.getSelectedTone() : undefined,
  );
  const [loading, setLoading] = useState(true);
  const [uploadSupported, setUploadSupported] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<
    EmojiDescription | undefined
  >();
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [disableCategories, setDisableCategories] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<
    MessageDescriptor | undefined
  >();
  const [emojiToDelete, setEmojiToDelete] = useState<
    EmojiDescription | undefined
  >();
  const [toneEmoji, setToneEmoji] = useState<
    OptionalEmojiDescriptionWithVariations | undefined
  >();

  const emojiPickerList = useMemo(() => createRef<EmojiPickerList>(), []);
  const openTime = useRef(0);
  const isMounting = useRef(true);
  const didMount = useDidMount();
  const updateAfterDidMount = useRef(true);
  const previousEmojiProvider = useRef(emojiProvider);
  const currentUser = useMemo(() => {
    return emojiProvider.getCurrentUser();
  }, [emojiProvider]);

  const fireAnalytics = useCallback(
    (analyticsEvent: AnalyticsEventPayload) => {
      if (createAnalyticsEvent) {
        createAndFireEventInElementsChannel(analyticsEvent)(
          createAnalyticsEvent,
        );
      }
    },
    [createAnalyticsEvent],
  );

  const onEmojiActive = useCallback(
    (emojiId?: EmojiId, emoji?: EmojiDescription) => {
      if (!selectedEmoji || selectedEmoji.id !== emojiId?.id) {
        setSelectedEmoji(emoji);
      }
    },
    [selectedEmoji],
  );

  const onCategoryActivated = useCallback(
    (category: CategoryId | null) => {
      if (activeCategory !== category) {
        setActiveCategory(category);
      }
    },
    [activeCategory],
  );

  const calculateElapsedTime = () => {
    return Date.now() - openTime.current;
  };

  const onUploadSupported = useCallback((supported: boolean) => {
    setUploadSupported(supported);
  }, []);

  const onDynamicCategoryChange = useCallback((categories: CategoryId[]) => {
    setDynamicCategories(categories);
  }, []);

  const onUploadCancelled = useCallback(() => {
    batchedUpdates(() => {
      setUploading(false);
      setUploadErrorMessage(undefined);
    });
    fireAnalytics(uploadCancelButton());
  }, [fireAnalytics]);

  const getDynamicCategories = useCallback((): Promise<CategoryId[]> => {
    if (!emojiProvider.calculateDynamicCategories) {
      return Promise.resolve([]);
    }

    return emojiProvider.calculateDynamicCategories() as Promise<CategoryId[]>;
  }, [emojiProvider]);

  /**
   * Calculate and set the new state of the component in response to the list of emoji changing for some reason (a search has returned
   * or the frequently used emoji have updated.)
   */
  const setStateAfterEmojiChange = useCallback(
    ({
      searchQuery,
      emojiToRender,
      searchEmoji,
      frequentEmoji,
    }: {
      searchQuery?: string;
      emojiToRender?: EmojiDescription[];
      searchEmoji?: EmojiDescription[];
      frequentEmoji?: EmojiDescription[];
    }) => {
      // Only enable categories for full emoji list (non-search)
      const disableCategories = !!searchQuery;
      if (
        !disableCategories &&
        emojiToRender &&
        emojiToRender.length !== filteredEmojis.length
      ) {
        getDynamicCategories().then((categories) => {
          onDynamicCategoryChange(categories);
        });
      }

      if (emojiToRender && !containsEmojiId(emojiToRender, selectedEmoji)) {
        batchedUpdates(() => {
          setSelectedEmoji(undefined);
          // Only enable categories for full emoji list (non-search)
          setActiveCategory(null);
        });
      }
      batchedUpdates(() => {
        if (emojiToRender) {
          setFilteredEmojis(emojiToRender);
        }

        if (searchEmoji) {
          setSearchEmojis(searchEmoji);
        }

        if (frequentEmoji) {
          setFrequentlyUsedEmojis(frequentEmoji);
        }

        setLoading(false);
        setDisableCategories(disableCategories);
      });
    },
    [
      filteredEmojis.length,
      getDynamicCategories,
      onDynamicCategoryChange,
      selectedEmoji,
    ],
  );

  const onFrequentEmojiResult = useCallback(
    (frequentEmoji: EmojiDescription[]): void => {
      // change the category of each of the featured emoji
      const recategorised = frequentEmoji.map((emoji) => {
        const clone = JSON.parse(JSON.stringify(emoji));
        clone.category = frequentCategory;
        return clone;
      });

      setStateAfterEmojiChange({
        frequentEmoji: recategorised,
      });
    },
    [setStateAfterEmojiChange],
  );

  const onSearchResult = useCallback(
    (searchResults: EmojiSearchResult): void => {
      const frequentlyUsedEmoji = frequentlyUsedEmojis || [];
      const searchQuery = searchResults.query || '';

      /**
       * If there is no user search in the EmojiPicker then it should display all emoji received from the EmojiRepository and should
       * also include a special category of most frequently used emoji (if there are any). This method decides if we are in this 'no search'
       * state and appends the frequent emoji if necessary.
       */
      let emojiToRender: EmojiDescription[];
      if (!frequentlyUsedEmoji.length || query) {
        emojiToRender = searchResults.emojis;
      } else {
        emojiToRender = [...searchResults.emojis, ...frequentlyUsedEmoji];
      }

      setStateAfterEmojiChange({
        searchQuery,
        emojiToRender,
        searchEmoji: searchResults.emojis,
      });
    },
    [frequentlyUsedEmojis, query, setStateAfterEmojiChange],
  );

  const onProviderChange: OnEmojiProviderChange = useMemo(() => {
    return {
      result: onSearchResult,
    };
  }, [onSearchResult]);

  /**
   * Updates the emoji displayed by the picker. If there is no query specified then we expect to retrieve all emoji for display,
   * by category, in the picker. This differs from when there is a query in which case we expect to receive a sorted result matching
   * the search.
   */
  const updateEmojis = useCallback(
    (query?: string, options?: SearchOptions) => {
      // if the query is empty then we want the emoji to be in service defined order, unless specified otherwise
      // and we want emoji for the 'frequently used' category to be refreshed as well.
      if (!query) {
        if (!options) {
          options = {};
        }

        if (!options.sort) {
          options.sort = SearchSort.None;
        }

        // take a copy of search options so that the frequently used can be limited to 16 without affecting the full emoji query
        const frequentOptions: SearchOptions = {
          ...options,
          sort: SearchSort.None,
          limit: FREQUENTLY_USED_MAX,
        };

        emojiProvider
          .getFrequentlyUsed(frequentOptions)
          .then(onFrequentEmojiResult);
      }

      emojiProvider.filter(query, options);
    },
    [emojiProvider, onFrequentEmojiResult],
  );

  const onToneSelected = useCallback(
    (toneValue: ToneSelection) => {
      emojiProvider.setSelectedTone(toneValue);
      updateEmojis(query, { skinTone: toneValue });
      setSelectedTone(toneValue);
    },
    [emojiProvider, query, updateEmojis],
  );

  const onToneSelectorCancelled = useCallback(() => {
    fireAnalytics(toneSelectorClosedEvent());
  }, [fireAnalytics]);

  const onSelectWrapper = useCallback(
    (
      emojiId: EmojiId,
      emoji: OptionalEmojiDescription,
      event?: SyntheticEvent<any>,
    ): void => {
      if (onSelection) {
        onSelection(emojiId, emoji, event);
        fireAnalytics(
          pickerClickedEvent({
            duration: calculateElapsedTime(),
            emojiId: emojiId?.id || '',
            category: (emoji && emoji.category) || '',
            type: (emoji && emoji.type) || '',
            queryLength: (query && query.length) || 0,
          }),
        );
      }
    },
    [fireAnalytics, onSelection, query],
  );

  const onCategorySelected = useCallback(
    (categoryId: CategoryId | null) => {
      if (!categoryId) {
        return;
      }

      emojiProvider.findInCategory(categoryId).then((emojisInCategory) => {
        if (!disableCategories) {
          let newSelectedEmoji: EmojiDescription | undefined;
          if (emojisInCategory && emojisInCategory.length > 0) {
            newSelectedEmoji = getEmojiVariation(emojisInCategory[0], {
              skinTone: selectedTone,
            });
          }

          if (emojiPickerList.current) {
            emojiPickerList.current.reveal(categoryId);
          }

          batchedUpdates(() => {
            setActiveCategory(categoryId);
            setSelectedEmoji(newSelectedEmoji);
          });
          fireAnalytics(categoryClickedEvent({ category: categoryId }));
        }
      });
    },
    [
      disableCategories,
      emojiPickerList,
      emojiProvider,
      fireAnalytics,
      selectedTone,
    ],
  );

  const recordUsageOnSelection = useMemo(
    () =>
      createRecordSelectionDefault(emojiProvider, onSelectWrapper, (analytic) =>
        fireAnalytics(analytic('picker')),
      ),
    [emojiProvider, fireAnalytics, onSelectWrapper],
  );

  const formattedErrorMessage = useMemo(
    () =>
      uploadErrorMessage ? <FormattedMessage {...uploadErrorMessage} /> : null,
    [uploadErrorMessage],
  );

  const emojiContextValue = useMemo(
    () => ({
      emoji: {
        emojiProvider,
      },
    }),
    [emojiProvider],
  );

  const onFileChooserClicked = useCallback(() => {
    fireAnalytics(selectedFileEvent());
  }, [fireAnalytics]);

  const onSearch = useCallback(
    (searchQuery: string) => {
      const options = { skinTone: selectedTone };
      if (query) {
        ufoExperiences['emoji-searched'].start();
        ufoExperiences['emoji-searched'].addMetadata({
          queryLength: query.length,
          source: 'EmojiPickerComponent',
        });
      }
      if (searchQuery !== query) {
        setQuery(searchQuery);
      }
      updateEmojis(query, options);
    },
    [query, selectedTone, updateEmojis],
  );

  const onOpenUpload = useCallback(() => {
    // Prime upload token so it's ready when the user adds
    if (supportsUploadFeature(emojiProvider)) {
      emojiProvider.prepareForUpload();
    }
    batchedUpdates(() => {
      setUploadErrorMessage(undefined);
      setUploading(true);
    });
    fireAnalytics(uploadBeginButton());
  }, [emojiProvider, fireAnalytics]);

  const scrollToEndOfList = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (emojiPickerList.current) {
      // Wait a tick to ensure repaint and updated height for picker list
      window.setTimeout(() => {
        emojiPickerList.current?.scrollToBottom();
      }, 0);
    }
  }, [emojiPickerList]);

  const onUploadEmoji = useCallback(
    (upload: EmojiUpload, retry: boolean) => {
      fireAnalytics(uploadConfirmButton({ retry }));
      const errorSetter = (message?: MessageDescriptor) => {
        setUploadErrorMessage(message);
      };
      const onSuccess = (emojiDescription: EmojiDescription) => {
        batchedUpdates(() => {
          setActiveCategory(customCategory);
          setSelectedEmoji(emojiDescription);
          setUploading(false);
        });
        scrollToEndOfList();
      };
      uploadEmoji(
        upload,
        emojiProvider,
        errorSetter,
        onSuccess,
        fireAnalytics,
        retry,
      );
    },
    [emojiProvider, fireAnalytics, scrollToEndOfList],
  );

  const onTriggerDelete = useCallback(
    (_emojiId?: EmojiId, emoji?: EmojiDescription) => {
      if (_emojiId) {
        fireAnalytics(deleteBeginEvent({ emojiId: _emojiId.id }));
        setEmojiToDelete(emoji);
      }
    },
    [fireAnalytics],
  );

  const onCloseDelete = useCallback(() => {
    fireAnalytics(
      deleteCancelEvent({
        emojiId: emojiToDelete && emojiToDelete.id,
      }),
    );
    setEmojiToDelete(undefined);
  }, [emojiToDelete, fireAnalytics]);

  const onDeleteEmoji = useCallback(
    (emoji: EmojiDescription): Promise<boolean> => {
      fireAnalytics(
        deleteConfirmEvent({
          emojiId: emojiToDelete && emojiToDelete.id,
        }),
      );
      return emojiProvider.deleteSiteEmoji(emoji).then((success) => {
        if (success) {
          updateEmojis(query, { skinTone: selectedTone });
        }
        return success;
      });
    },
    [
      emojiProvider,
      emojiToDelete,
      fireAnalytics,
      query,
      selectedTone,
      updateEmojis,
    ],
  );

  const onComponentDidMount = useCallback(() => {
    emojiProvider.subscribe(onProviderChange);
    onSearch(query);
    if (supportsUploadFeature(emojiProvider)) {
      emojiProvider.isUploadSupported().then(onUploadSupported);
    }
    if (!hideToneSelector) {
      const toneEmoji = getToneEmoji(emojiProvider);
      if (isPromise<OptionalEmojiDescriptionWithVariations>(toneEmoji)) {
        toneEmoji.then((emoji) => setToneEmoji(emoji));
      } else if (toneEmoji === undefined || isEmojiDescription(toneEmoji)) {
        setToneEmoji(toneEmoji);
      }
    }
  }, [
    emojiProvider,
    hideToneSelector,
    onProviderChange,
    onSearch,
    onUploadSupported,
    query,
  ]);

  if (isMounting.current) {
    // componentWillMount equivalent
    ufoExperiences['emoji-picker-opened'].success();
    openTime.current = Date.now();
    fireAnalytics(openedPickerEvent());
    isMounting.current = false;
  }

  useEffect(() => {
    // componentDidMount logic
    if (didMount && updateAfterDidMount.current) {
      onComponentDidMount();
      updateAfterDidMount.current = false;
    }
  }, [didMount, onComponentDidMount]);

  useEffect(() => {
    previousEmojiProvider.current.unsubscribe(onProviderChange);
    previousEmojiProvider.current = emojiProvider;

    emojiProvider.subscribe(onProviderChange);
    if (supportsUploadFeature(emojiProvider)) {
      emojiProvider.isUploadSupported().then(onUploadSupported);
    }

    return () => {
      emojiProvider.unsubscribe(onProviderChange);
    };
  }, [emojiProvider, onProviderChange, onUploadSupported]);

  useEffect(() => {
    // We changed provider which means we subscribed to filter results for a new subscriber.
    // So we refresh the emoji display with onSearch and we do it here, after the new props have
    // been set since onSearch leads to filter being called on the current emojiProvider.
    // (Calling onSearch in a '...Will...' lifecycle method would lead to filter being called on
    // an emojiProvider we have already unsubscribed from)
    onSearch(query);
  }, [emojiProvider, onSearch, query]);

  useEffect(() => {
    // Fire analytics event whenever query changes
    fireAnalytics(
      pickerSearchedEvent({
        queryLength: query.length,
        numMatches: filteredEmojis.length,
      }),
    );
    ufoExperiences['emoji-searched'].success({
      metadata: { emojisLength: filteredEmojis.length },
    });
  }, [filteredEmojis.length, fireAnalytics, query]);

  useEffect(() => {
    if (!frequentlyUsedEmojis.length || query) {
      setFilteredEmojis(searchEmojis);
    } else {
      setFilteredEmojis([...searchEmojis, ...frequentlyUsedEmojis]);
    }
  }, [frequentlyUsedEmojis, query, searchEmojis]);

  useEffect(() => {
    // Fire analytics on component unmount
    return () => {
      fireAnalytics(closedPickerEvent({ duration: calculateElapsedTime() }));
      ufoExperiences['emoji-picker-opened'].abort({
        metadata: {
          source: 'EmojiPickerComponent',
          reason: 'unmount',
        },
      });
      ufoExperiences['emoji-searched'].abort({
        metadata: {
          source: 'EmojiPickerComponent',
          reason: 'unmount',
        },
      });
    };
  }, [fireAnalytics]);

  useEffect(() => {
    // Unsubscribe emojiProvider on component unmount
    return () => {
      emojiProvider.unsubscribe(onProviderChange);
    };
  }, [emojiProvider, onProviderChange]);

  const showPreview = selectedEmoji && !uploading;

  return (
    <LegacyEmojiContextProvider emojiContextValue={emojiContextValue}>
      <div
        css={emojiPicker(showPreview)}
        ref={onPickerRef}
        data-emoji-picker-container
      >
        <CategorySelector
          activeCategoryId={activeCategory}
          dynamicCategories={dynamicCategories}
          disableCategories={disableCategories}
          onCategorySelected={onCategorySelected}
        />
        <EmojiPickerList
          emojis={filteredEmojis}
          currentUser={currentUser}
          onEmojiSelected={recordUsageOnSelection}
          onEmojiActive={onEmojiActive}
          onEmojiDelete={onTriggerDelete}
          onCategoryActivated={onCategoryActivated}
          onSearch={onSearch}
          query={query}
          selectedTone={selectedTone}
          loading={loading}
          ref={emojiPickerList}
          initialUploadName={query}
          onToneSelected={onToneSelected}
          onToneSelectorCancelled={onToneSelectorCancelled}
          toneEmoji={toneEmoji}
          uploading={uploading}
          emojiToDelete={emojiToDelete}
          uploadErrorMessage={formattedErrorMessage}
          uploadEnabled={uploadSupported && !uploading}
          onUploadEmoji={onUploadEmoji}
          onUploadCancelled={onUploadCancelled}
          onDeleteEmoji={onDeleteEmoji}
          onCloseDelete={onCloseDelete}
          onFileChooserClicked={onFileChooserClicked}
          onOpenUpload={onOpenUpload}
        />
        {showPreview && <EmojiPickerFooter selectedEmoji={selectedEmoji} />}
      </div>
    </LegacyEmojiContextProvider>
  );
};

export default memo(EmojiPickerComponent);
