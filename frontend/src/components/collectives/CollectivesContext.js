import { createContext, useContext, useState, useEffect } from "react";
import { UserContext } from "../UserProfilePage/context/UserContext";  

const CollectivesContext = createContext();

export const CollectivesProvider = ({ children }) => {

 const { user } = useContext(UserContext); 

  const [joinedCollectives, setJoinedCollectives] = useState([]);

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