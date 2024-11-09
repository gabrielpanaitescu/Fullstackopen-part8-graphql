import { Helmet, HelmetData } from "react-helmet-async";

const helmetData = new HelmetData({});

export const Head = ({ title = "", description = "Library Application" }) => {
  return (
    <Helmet
      helmetData={helmetData}
      title={title ? `${title} | Library` : undefined}
      defaultTitle="Library"
    >
      <meta name="description" content={description} />
    </Helmet>
  );
};
