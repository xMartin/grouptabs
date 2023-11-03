import "./init";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { connectRoutes, LocationState } from "redux-first-router";
import {
  combineReducers,
  applyMiddleware,
  compose as reduxCompose,
  createStore,
  Store,
  Middleware,
} from "redux";
import ReduxThunk from "redux-thunk";
import { Provider } from "react-redux";
import debug from "debug";
import DbManager from "./db/manager";
import { restoreLocation, startPersistingLocation } from "./util/standalone";
import appReducer from "./redux/reducer";
import { reducer as routeTransitionReducer } from "./redux/routetransition";
import { middleware as routeTransitionMiddleware } from "./redux/routetransition";
import App from "./app";
import routes from "./routes";
//import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./index.css";

const debugSetting =
  new URL(window.location.toString()).searchParams.get("debug") || "";
debug.enable(debugSetting);

// replace legacy hash URLs with clean URLs
if (window.location.hash.startsWith("#/tabs/")) {
  window.history.replaceState(null, "", window.location.hash.substring(2));
}

restoreLocation();

const router: any = connectRoutes(routes);

startPersistingLocation(router.history);

const rootReducer = combineReducers({
  location: router.reducer,
  routeTransition: routeTransitionReducer,
  app: appReducer,
});
export type AllState = ReturnType<typeof rootReducer> & {
  location: LocationState;
};

export interface Services {
  dbManager: DbManager;
}
const dbManager = new DbManager();
const thunkMiddleware = ReduxThunk.withExtraArgument({
  dbManager,
});
const log = debug("redux:dispatch");
const logger: Middleware = () => (next) => (action) => {
  if (action.type) {
    log(action.type, action);
  }
  return next(action);
};
const middlewares = applyMiddleware(
  logger,
  thunkMiddleware,
  router.middleware,
  routeTransitionMiddleware
);

const compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || reduxCompose;
const store: Store<AllState> = createStore(
  rootReducer,
  compose(router.enhancer, middlewares)
);

const components = (
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);

createRoot(document.getElementById("root")!).render(components);

const unsubscribe = store.subscribe(() => {
  if (store.getState().app.initialLoadingDone) {
    hideAppLoader();
    unsubscribe();
  }
});

function hideAppLoader() {
  const loader = document.getElementById("loader");
  if (!loader) {
    throw new Error("Loader element missing in DOM");
  }
  loader.classList.add("hidden");
  setTimeout(() => {
    loader.style.display = "none";
  }, 500);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
//serviceWorkerRegistration.register();
