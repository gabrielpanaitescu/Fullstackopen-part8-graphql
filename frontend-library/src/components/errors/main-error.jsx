export const MainErrorFallback = ({ error }) => {
  console.log(error);
  return (
    <div>
      <h2>Ooops, something went wrong</h2>
      <button onClick={() => window.location.assign(window.location.origin)}>
        Refresh
      </button>
    </div>
  );
};
