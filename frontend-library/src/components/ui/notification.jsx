import { useNotificationState } from "../../contexts/notification";

export const Notification = () => {
  const { message, type } = useNotificationState();

  if (!message) return null;

  const notificationStyles = {
    color: type === "info" ? "green" : "red",
    border: "1px solid",
    padding: "7px 14px",
  };

  return <div style={notificationStyles}>{message}</div>;
};
