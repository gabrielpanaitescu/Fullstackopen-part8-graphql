import { NavLink } from "react-router-dom";

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
];

export const AppLayout = ({ children }) => {
  return (
    <div>
      <ul>
        {navigation.map((item) => {
          return (
            <NavLink key={item.name} to={item.to}>
              {item.name}
            </NavLink>
          );
        })}
      </ul>
      {children}
    </div>
  );
};
