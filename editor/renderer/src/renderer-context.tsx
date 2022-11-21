import React from 'react';

export type FeatureFlags = {
  showHoverPreview?: boolean;
};

export type RendererContextProps = {
  featureFlags?: FeatureFlags;
};

const RendererContext = React.createContext({});

export const useRendererContext = () =>
  React.useContext<RendererContextProps>(RendererContext);

export const RendererContextProvider = RendererContext.Provider;
