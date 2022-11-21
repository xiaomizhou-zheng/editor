import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/standard-button';

import TableTree, {
  Cell,
  Header,
  Headers,
  Row,
  Rows,
  TableTreeDataHelper,
} from '../../src';

import { fetchItems, getDefaultItems } from './data';

type Item = {
  title: string;
  numbering: string;
  page: number;
  children?: Item[];
};

const tableTreeHelper = new TableTreeDataHelper<Item>({ key: 'numbering' });

const getInitialItems = () => {
  return tableTreeHelper.updateItems(getDefaultItems());
};

export default () => {
  const [items, setItems] = useState<Item[]>(getInitialItems);
  const [isLoading, setIsLoading] = useState(false);

  const reloadItems = useCallback(() => {
    setIsLoading(true);
    fetchItems().then((newItems) => {
      setItems((items) =>
        tableTreeHelper.updateItems(newItems, items, items[items.length - 1]),
      );
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      <Button onClick={reloadItems}>Reload items</Button>
      <TableTree>
        <Headers>
          <Header width={200}>Chapter title</Header>
          <Header width={100}>Numbering</Header>
          <Header width={100}>Page</Header>
        </Headers>
        <Rows
          items={items}
          render={({ title, numbering, page, children = [] }) => (
            <Row
              itemId={numbering}
              items={isLoading ? undefined : children}
              hasChildren={children.length > 0}
              isDefaultExpanded
            >
              <Cell>{title}</Cell>
              <Cell>{numbering}</Cell>
              <Cell>{page}</Cell>
            </Row>
          )}
        />
      </TableTree>
    </div>
  );
};
