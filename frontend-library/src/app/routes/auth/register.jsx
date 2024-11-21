import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { CREATE_USER } from "../../../gql/queries";
import { useLocation, useNavigate } from "react-router-dom";
import { Head } from "../../../components/seo/head";
import { useNotificationDispatch } from "../../../contexts/notification";
import { createErrorOptions } from "../../../utils/notify-options-creator";
import { Notification } from "../../../components/ui/notification";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerWith] = useMutation(CREATE_USER);
  const navigate = useNavigate();
  const { state } = useLocation();
  const notify = useNotificationDispatch();

  useEffect(() => {
    if (state?.fromProtected) {
      document.title = "Register";
    }
  }, [state]);

  const handleSubmit = (e) => {
    registerWith({
      variables: { username, password },
      onError: (error) => {
        notify(createErrorOptions(error));
      },
      onCompleted: (result) => {
        notify({
          message: `Successfully created new user ${result.createUser.username}`,
        });
        navigate("/auth/login");
      },
    });
    e.preventDefault();
  };

  const handleRedirect = () => {
    navigate("/auth/login");
  };

  return (
    <>
      <Head title="Register"></Head>
      <h2>Register</h2>
      <Notification />
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
        <button>create account</button>

        <div>
          Already have an account? Login here
          <button type="button" onClick={handleRedirect}>
            login
          </button>
        </div>
      </form>
    </>
  );
};
