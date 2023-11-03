import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';
import produce, { Immutable } from 'immer';
export type RegistrationState = {
  isDirty: boolean;
  isFirst: boolean;
  isSecond: boolean;
  payload: any;
  onSubmit: () => void;
  onReset: () => void;
};
type RegistrationAction = {
  type:
    | 'IS_DIRTY'
    | 'IS_FIRST'
    | 'IS_SECOND'
    | 'IS_PAYLOAD'
    | 'IS_RESET';
  payload?: boolean;
};
export type RegistrationDispatch = {
  isDirtyAction: (args: boolean) => void;
  firstAction: (args: boolean) => void;
  secondAction: (args: boolean) => void;
  resetAction: (args: boolean) => void;
  payloadAction: (args: any) => void;
  onSubmitAction: (args: boolean) => void;
};
export type RegistrationContext = {
  state: Immutable<RegistrationState>;
  dispatch: RegistrationDispatch;
};
interface UseRegistration
  extends Pick<RegistrationState, 'isDirty'>,
    Omit<RegistrationDispatch, 'payloadAction'> {}
const initialState: RegistrationState = {
  isDirty: false,
  isFirst: false,
  isSecond: false,
  payload: {},
  onSubmit: () => {
    /* */
  },
  onReset: () => {
    /* */
  },
};
export const RegistrationStateContext: React.Context<
  Immutable<RegistrationState>
> = createContext(initialState as Immutable<RegistrationState>);
export const RegistrationDispatchContext =
  createContext<RegistrationDispatch>({
    isDirtyAction: () => {
      /* */
    },
    firstAction: () => {
      /* */
    },
    secondAction: () => {
      /* */
    },
    resetAction: () => {
      /* */
    },
    payloadAction: () => {
      /* */
    },
    onSubmitAction: () => {
      /* */
    },
  });
const reducer = produce(
  (draft: RegistrationState, action: RegistrationAction) => {
    const { type, payload = false } = action;
    /* eslint-disable no-param-reassign */
    switch (type) {
      case 'IS_DIRTY':
        draft.isDirty = payload;
        return;
      case 'IS_FIRST':
        draft.isFirst = payload;
        return;
      case 'IS_SECOND':
        draft.isSecond = payload;
        return;
      case 'IS_PAYLOAD':
          draft.payload = payload;
          return;
      case 'IS_RESET':
        if (payload) {
          draft.isDirty = false;
          draft.isFirst = false;
          draft.isSecond = false;
        }
        return;
      default:
        throw new Error('Unknown action type');
    }
    /* eslint-enable no-param-reassign */
  }
);
export function useRegistrationContext(): RegistrationContext {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { onSubmit } = state;
  const isDirtyAction = useCallback((args: boolean) => {
    dispatch({
      type: 'IS_DIRTY',
      payload: args,
    });
  }, []);
  const firstAction = useCallback((args: boolean) => {
    dispatch({
      type: 'IS_FIRST',
      payload: args,
    });
  }, []);
  const secondAction = useCallback((args: boolean) => {
    dispatch({
      type: 'IS_SECOND',
      payload: args,
    });
  }, []);
  const resetAction = useCallback((args: boolean) => {
    dispatch({
      type: 'IS_RESET',
      payload: args,
    });
  }, []);
  const payloadAction = useCallback((args: any) => {
    dispatch({
      type: 'IS_PAYLOAD',
      payload: args,
    });
  }, []);
  const onSubmitAction = useCallback(() => {
    if (typeof onSubmit === 'function') onSubmit();
    resetAction(true);
  }, [resetAction, onSubmit]);
  return {
    state,
    dispatch: {
      isDirtyAction,
      firstAction,
      secondAction,
      resetAction,
      payloadAction,
      onSubmitAction
    },
  };
}
// Custom hooks for use in other components
export function useRegistration(): UseRegistration {
  const { isDirty } = useContext(RegistrationStateContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { payloadAction, ...dispatch } = useContext(
    RegistrationDispatchContext
  );
  return { isDirty, ...dispatch };
}
