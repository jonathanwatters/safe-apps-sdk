import { INTERFACE_MESSAGES, SDK_MESSAGES } from './messageIds';

/*
    The reason for duplicating types in both uppercase/lowercase is because in the safe-react
    type for networks contains uppercase strings and with previous type it resulted in a type error.
    The sdk converts network to lowercase, so passing an uppercase one is totally valid too.
*/
export type UppercaseNetworks = 'MAINNET' | 'MORDEN' | 'ROPSTEN' | 'RINKEBY' | 'GOERLI' | 'KOVAN' | 'UNKNOWN';
export type LowercaseNetworks = 'mainnet' | 'morden' | 'ropsten' | 'rinkeby' | 'goerli' | 'kovan' | 'unknown';
export type Networks = UppercaseNetworks | LowercaseNetworks;

export interface Transaction {
  to: string;
  value: string;
  data: string;
}

export type RequestId = number | string;

export interface SdkInstance {
  addListeners: (listeners: SafeListeners) => void;
  removeListeners: () => void;
  sendTransactions: (txs: Transaction[], requestId?: RequestId) => SentSDKMessage<'SEND_TRANSACTIONS'>;
}

export interface SafeInfo {
  safeAddress: string;
  network: LowercaseNetworks;
  ethBalance: string;
}

export interface TxConfirmationEvent {
  requestId: RequestId;
  safeTxHash: string;
}

export interface TxRejectionEvent {
  requestId: RequestId;
}

export interface SafeListeners {
  onSafeInfo: (info: SafeInfo) => void;
  onTransactionConfirmation?: (event: TxConfirmationEvent) => void;
  onTransactionRejection?: (event: TxRejectionEvent) => void;
}

export type InterfaceMessageIds = keyof typeof INTERFACE_MESSAGES;

export interface InterfaceMessageEvent extends MessageEvent {
  data: {
    requestId: RequestId;
    messageId: InterfaceMessageIds;
    data: InterfaceMessageToPayload[InterfaceMessageIds];
  };
}

export interface SDKMessageToPayload {
  [SDK_MESSAGES.SAFE_APP_SDK_INITIALIZED]: undefined;
  [SDK_MESSAGES.SEND_TRANSACTIONS]: Transaction[];
}

export type SDKMessageIds = keyof typeof SDK_MESSAGES;

export interface InterfaceMessageToPayload {
  [INTERFACE_MESSAGES.ON_SAFE_INFO]: SafeInfo;
  [INTERFACE_MESSAGES.TRANSACTION_CONFIRMED]: {
    safeTxHash: string;
  };
  [INTERFACE_MESSAGES.TRANSACTION_REJECTED]: Record<string, unknown>;
}

export type SentSDKMessage<T extends SDKMessageIds> = {
  messageId: T;
  requestId: RequestId;
  data: SDKMessageToPayload[T];
};