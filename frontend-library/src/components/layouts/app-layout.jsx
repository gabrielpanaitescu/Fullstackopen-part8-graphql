import { useQuery } from "@apollo/client";
import { NavLink, useNavigate, useNavigation } from "react-router-dom";
import { CURRENT_USER } from "../../gql/queries";
import { useEffect, useState } from "react";
import { Notification } from "../ui/notification";

const navigation = [
  {
    name: "Home",
    to: "/app/",
  },
  {
    name: "Authors",
    to: "/app/authors",
  },
  {
    name: "Books",
    to: "/app/books",
  },
  {
    name: "Add Book",
    to: "/app/add-book",
  },
  {
    name: "Recommended",
    to: "/app/recommended",
  },
];

const ProgressBar = () => {
  const { state, location } = useNavigation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
  }, [location?.pathname]);

  useEffect(() => {
    if (state === "loading") {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer);
            return 100;
          }

          const newProgress = oldProgress + 10;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 100);

      return () => {
        clearInterval(timer);
      };
    }
  }, [state]);

  const progressStyles = {
    position: "fixed",
    top: 0,
    lect: 0,
    height: 3,
    backgroundColor: "blue",
    transition: "all 200ms ease-in-out",
    width: `${progress}%`,
  };

  if (state !== "loading") return null;

  return <div style={progressStyles}></div>;
};

export const AppLayout = ({ children }) => {
  const { data, client } = useQuery(CURRENT_USER, {
    fetchPolicy: "cache-and-network",
  });
  const navigate = useNavigate();

  const user = data?.me;

  const handleLogout = () => {
    client.clearStore();
    localStorage.clear();
    navigate("/auth/login");
  };

  return (
    <>
      <nav style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ul>
          {navigation.map((item) => {
            return (
              <NavLink
                key={item.name}
                to={item.to}
                style={{
                  marginLeft: 10,
                  textDecoration: "none",
                  border: "1px solid #f0f0f0",
                  borderRadius: 5,
                  padding: "7px 14px",
                }}
              >
                {item.name}
              </NavLink>
            );
          })}
        </ul>
        <ProgressBar />
        {user && (
          <div>
            <em>logged in as {user.username}</em>
            <button onClick={handleLogout}>logout</button>
          </div>
        )}
      </nav>
      <Notification />
      {children}
    </>
  );
};
