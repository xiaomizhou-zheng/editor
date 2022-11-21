import React, { useState } from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import ArticlesList from './ArticlesList';
import ShowMoreButton from '../ShowMoreButton';
import { ArticlesListContainer } from './styled';
import { ArticlesList as ArticlesListInterface } from './model/ArticlesListItem';
import { MIN_ITEMS_TO_DISPLAY } from './constants';

const ArticleList: React.FC<ArticlesListInterface> = ({
  style,
  articles,
  minItemsToDisplay,
  maxItemsToDisplay,
  onArticlesListItemClick,
  onToggleArticlesList,
}) => {
  const [showMoreToggled, setShowMoreToggled] = useState<boolean>(true);

  const getMinItemsToDisplay = (): number => {
    return minItemsToDisplay ? minItemsToDisplay : MIN_ITEMS_TO_DISPLAY;
  };

  const getMaxItemsToDisplay = (): number => {
    if (articles) {
      return maxItemsToDisplay ? maxItemsToDisplay : articles.length;
    }

    return 0;
  };

  const getNumberOfArticlesToDisplay = (showMoreToggeled: boolean): number => {
    return showMoreToggeled ? getMinItemsToDisplay() : getMaxItemsToDisplay();
  };

  const toggleArticlesList = (
    event: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
  ): void => {
    setShowMoreToggled(!showMoreToggled);

    if (onToggleArticlesList) {
      onToggleArticlesList(event, analyticsEvent, !showMoreToggled);
    }
  };

  return articles && articles.length > 0 ? (
    <ArticlesListContainer>
      <>
        <ArticlesList
          style={style}
          onArticlesListItemClick={onArticlesListItemClick}
          articles={articles}
          numberOfArticlesToDisplay={getNumberOfArticlesToDisplay(
            showMoreToggled,
          )}
        />
        {articles.length > getMinItemsToDisplay() && (
          <ShowMoreButton
            minItemsToDisplay={getMinItemsToDisplay()}
            maxItemsToDisplay={getMaxItemsToDisplay()}
            showMoreToggeled={showMoreToggled}
            onToggle={toggleArticlesList}
            itemsType="articles"
          />
        )}
      </>
    </ArticlesListContainer>
  ) : null;
};

export default ArticleList;
