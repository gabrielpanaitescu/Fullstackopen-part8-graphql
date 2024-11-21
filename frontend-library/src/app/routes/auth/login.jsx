import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { LOGIN } from "../../../gql/queries";
import { useLocation, useNavigate } from "react-router-dom";
import { Head } from "../../../components/seo/head";
import { useNotificationDispatch } from "../../../contexts/notification";
import { Notification } from "../../../components/ui/notification";
import { createErrorOptions } from "../../../utils/notify-options-creator";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginWith] = useMutation(LOGIN);
  const navigate = useNavigate();
  const { state } = useLocation();
  const notify = useNotificationDispatch();

  useEffect(() => {
    if (state?.fromProtected) {
      document.title = "Login";
    }
  }, [state]);

  const handleSubmit = (e) => {
    loginWith({
      variables: { username, password },
      onError: (error) => {
        notify(createErrorOptions(error));
      },
      onCompleted: (result) => {
        notify({
          message: `Log in successful`,
        });
        localStorage.setItem("loggedUser", result.login.value);
        navigate("/app");
      },
    });
    e.preventDefault();
  };

  const handleRedirect = () => {
    navigate("/auth/register");
  };

  return (
    <>
      <Head title="Login"></Head>
      <Notification />
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            username:
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button>login</button>

        <div>
          No account yet? Register here
          <button type="button" onClick={handleRedirect}>
            register
          </button>
        </div>
      </form>
    </>
  );
};
