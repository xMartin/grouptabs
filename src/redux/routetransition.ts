import { Dispatch, Middleware, Reducer, isAction } from "redux";
import { Action } from "redux-first-router";

const SET_ROUTE_TRANSITION = "SET_ROUTE_TRANSITION";

interface SetRouteTransitionAction {
  type: typeof SET_ROUTE_TRANSITION;
  payload: boolean;
}

const createSetRouteTransitionAction = (
  payload: boolean
): SetRouteTransitionAction => ({
  type: SET_ROUTE_TRANSITION,
  payload,
});

type RouteTransitionAction = SetRouteTransitionAction;

export const middleware: Middleware =
  ({ dispatch }: { dispatch: Dispatch<SetRouteTransitionAction> }) =>
  (next) =>
  (action) => {
    if (
      isAction(action) &&
      action.type.startsWith("ROUTE_") &&
      (action as Action).meta?.location.kind === "push"
    ) {
      dispatch(createSetRouteTransitionAction(true));

      setTimeout(() => dispatch(createSetRouteTransitionAction(false)), 400);
    }
    return next(action);
  };

interface RouteTransitionState {
  transition: boolean;
}

const initialState: RouteTransitionState = {
  transition: false,
};

export const reducer: Reducer<RouteTransitionState, RouteTransitionAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_ROUTE_TRANSITION:
      return {
        ...state,
        transition: action.payload,
      };
    default:
      return state;
  }
};
