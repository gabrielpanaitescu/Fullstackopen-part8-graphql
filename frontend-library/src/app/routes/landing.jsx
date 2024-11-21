import { useNavigate } from "react-router-dom";
import { Head } from "../../components/seo/head";
import { useQuery } from "@apollo/client";
import { CURRENT_USER } from "../../gql/queries";

export const LandingRoute = () => {
  const navigate = useNavigate();
  const { data } = useQuery(CURRENT_USER, {
    fetchPolicy: "cache-and-network",
  });

  const user = data?.me;

  const handleStart = () => {
    !user ? navigate("/auth/login") : navigate("/app");
  };

  return (
    <>
      <Head description="Library Application" />
      <div>Hello, welcome to Library App</div>
      <button onClick={handleStart}>Get Started</button>
    </>
  );
};
