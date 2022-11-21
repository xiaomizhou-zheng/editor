import React from 'react';

import Card from './internal/card';
import Layout from './internal/layout';

const gaps = ['32px', '16px', '8px', '4px', '0px'] as const;

export default function ClosestEdgeExample() {
  return (
    <Layout testId="layout">
      {gaps.map(gap => (
        <Card key={gap} edge="right" gap={gap}>
          {gap}
        </Card>
      ))}
    </Layout>
  );
}
