import {
  DestinationSubproduct,
  DestinationProduct,
} from '../../utils/analytics/types';

export interface CommonEventProps {
  definitionId?: string;
  extensionKey?: string;
  resourceType?: string;
  destinationSubproduct?: DestinationSubproduct | string;
  destinationProduct?: DestinationProduct | string;
  location?: string;
}
