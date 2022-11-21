import { Provider } from './provider';
import { io } from 'socket.io-client';
import { Socket, Config, ProductInformation } from './types';
import { getProduct, getSubProduct } from './helpers/utils';
import { SOCKET_IO_OPTIONS } from './config';

export function createSocketIOSocket(
  url: string,
  auth?: (cb: (data: object) => void) => void,
  productInfo?: ProductInformation,
): Socket {
  const { pathname } = new URL(url);

  // to limit the reconnection flooding towards collab service, here we set the reconnectionDelayMax to 128s.
  return io(url, {
    reconnectionDelayMax: SOCKET_IO_OPTIONS.RECONNECTION_DELAY_MAX,
    reconnectionDelay: SOCKET_IO_OPTIONS.RECONNECTION_DELAY,
    randomizationFactor: SOCKET_IO_OPTIONS.RANDOMIZATION_FACTOR,
    closeOnBeforeunload: false,
    withCredentials: true,
    transports: ['polling', 'websocket'],
    path: `/${pathname.split('/')[1]}/socket.io`,
    auth,
    extraHeaders: {
      'x-product': getProduct(productInfo),
      'x-subproduct': getSubProduct(productInfo),
    },
  });
}

export function createSocketIOCollabProvider(
  config: Omit<Config, 'createSocket'>,
) {
  return new Provider({ ...config, createSocket: createSocketIOSocket });
}
