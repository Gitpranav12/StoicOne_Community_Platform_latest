import { createContext, useContext, useState, useEffect } from "react";
import { UserContext } from "../UserProfilePage/context/UserContext";  //added this...

const CollectivesContext = createContext();

export const CollectivesProvider = ({ children }) => {

 const { user } = useContext(UserContext); //added this...

  const [joinedCollectives, setJoinedCollectives] = useState([]);

  // const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  // const userId = currentUser.id; // :small_blue_diamond: replace with logged-in user id

  useEffect(() => {
     if (!user?.id) {
      setJoinedCollectives([]);
      return;
    }

    fetch(`http://localhost:8080/api/collectives/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => setJoinedCollectives(data))
      .catch((err) => console.error("Error fetching joined collectives:", err));
  }, [user?.id]);


  return (
    <CollectivesContext.Provider value={{ joinedCollectives, setJoinedCollectives }}>
      {children}
    </CollectivesContext.Provider>
  );
};

export const useCollectives = () => useContext(CollectivesContext);