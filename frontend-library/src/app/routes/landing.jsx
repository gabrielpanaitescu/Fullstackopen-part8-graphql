import { useNavigate } from "react-router-dom";
import { Head } from "../../components/seo/head";

export const LandingRoute = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/app");
  };

  return (
    <>
      <Head description="Library Application" />
      <div>Hello, welcome to Library App</div>
      <button onClick={handleStart}>Get Started</button>
    </>
  );
};
