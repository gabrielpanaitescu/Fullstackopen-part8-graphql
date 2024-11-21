import { createContext, useContext, useReducer } from "react";

export const NotificationContext = createContext(null);

const initialState = { message: null, type: "info" };

export const useNotificationDispatch = () => {
  const [_, dispatch] = useContext(NotificationContext);

  const notify = ({ message, type = "info", seconds = 3 }) => {
    dispatch({ type: "set", payload: { message, type } });

    setTimeout(() => {
      dispatch({ type: "reset" });
    }, 1000 * seconds);
  };

  return notify;
};

export const useNotificationState = () => {
  const [state] = useContext(NotificationContext);

  return state;
};

export const notificationReducer = (state, action) => {
  switch (action.type) {
    case "set":
      return action.payload;
    case "reset":
      return initialState;
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  return (
    <NotificationContext.Provider value={[state, dispatch]}>
      {children}
    </NotificationContext.Provider>
  );
};
