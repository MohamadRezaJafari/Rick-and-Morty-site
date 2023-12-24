// ! then & catch:
// useEffect(() => {
//   setIsLoading(true);
//   fetch("https://rickandmortyapi.com/api/characters")
//     .then((res) => {
//       if (!res.ok) throw new Error("!!!Wrong");
//       return res.json();
//     })
//     .then((data) => {
//       setCharacter(data.results);
//       // setIsLoading(false);
//     })
//     .catch((err) => {
//       // setIsLoading(false);
//       toast.error(err.message);
//     })
//     .finally(() => setIsLoading(false));
// }, []);

// ! then & catch:axios
// useEffect(() => {
//   setIsLoading(true);
//   axios
//     .get("https://rickandmortyapi.com/api/characters")
//     .then((res) => {
//       setCharacter(res.data.results);
//     })
//     .catch((err) => {
//       toast.error(err.response.data.error);
//     })
//     .finally(() => setIsLoading(false));
// }, []);

// ! async await:
// useEffect(() => {
//   async function fetchData() {
//     try {
//       setIsLoading(true);
//       // *زمانیکه کاربر فتچ کردن را استارت میکند وارد آدرس سایت میشود تا اطلاعات بارگذاری شود و برای اینکه حجم اطلاعات بالاست و ممکنه چند ثانیه طول بکشد پیام منتظر باشید را مشاهده کند
//       const res = await fetch("https://rickandmortyapi.com/api/character");

//       if (!res.ok) throw new Error("Somthing went Wrong!!!");

//       const data = await res.json();
//       console.log(data.results);
//       setCharacter(data.results);
//       // setIsLoading(true);
//       // *باید فالس باشد ولی چون در اینجا اطلاعات حجمش پایین هست و نمایش نمیدهد پیام لودینگ را ترو گذاشتیم تا پیام دیده شود
//       // *بعد از اینکه اطلاعات بارگذاری شد دیگر پیام منتظر باشید ازبین برود و اطلاعات نمایش داده شود
//     } catch (err) {
//       // setIsLoading(false);
//       console.log(err.message);
//       toast.error(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }
//   fetchData();
// }, []);

// ! event handler function:
// const handlerLoadCharacters = () => {
//   fetch("https://rickandmortyapi.com/api/character")
//     .then((res) => res.json())
//     .then((data) => setCharacter(data.results.slice(0, 3)));
// };

/* <button
        className="btb btn--primary"
        onClick={handlerLoadCharacters}
      >
        Load Characters
      </button> */

// ! async await: axios
// useEffect(() => {
//   const controller = new AbortController();
//   const signal = controller.signal;
//   async function fetchData() {
//     try {
//       setIsLoading(true);
//       const { data } = await axios.get(
//         `https://rickandmortyapi.com/api/character/?name=${query}`,
//         { signal }
//       );
//       setCharacter(data.results.slice(0, 5));
//     } catch (err) {
//       if (!axios.isCancel()) {
//         setCharacter([]);
//         toast.error(err.response.data.error);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   fetchData();

//   return () => {
//     controller.abort();
//   };

// }, [query]);

// ! save favourites in local storage:

// const [favourites, setFavourites] = useState(
//   () => JSON.parse(localStorage.getItem("FAVOURITES")) || []
// );

// useEffect(() => {
//   localStorage.setItem("FAVOURITES", JSON.stringify(favourites));
// }, [favourites]);

// ------------------------------------------------------------------
import "./App.css";
import Navbar, { Search, SearchResult, Favorites } from "./components/Navbar";
import CarecterList from "./components/CharacterList";
import CarecterDetail from "./components/CharacterDetail";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import useCharacters from "./hooks/useCharacters";
import useLocalStorage from "./hooks/useLocalStorage";
import CharacterDetail from "./components/CharacterDetail";
import CharacterList from "./components/CharacterList";

function App() {
  const [query, setQuery] = useState("");

  const [selectedId, setSelectedId] = useState(null);

  // * custom hook:**
  const { isLoading, characters } = useCharacters(
    // ?name: مقدار اختیاری میباشد که میگوید از کارکتر ها اسمشون که با این چیزی که کاربر وارد کرده یکی است،کوئری
    "https://rickandmortyapi.com/api/character/?name",
    query
  );

  // * custom hook:**
  const [favourites, setFavourites] = useLocalStorage("FAVOURITES", []);

  const handleSelectCharacter = (id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  const handleAddFavourites = (char) => {
    setFavourites((prevFav) => [...prevFav, char]);
  };

  const handleDeleteFavourite = (id) => {
    setFavourites((prevFav) => prevFav.filter((fav) => fav.id !== id));
  };

  const isAddToFavourites = favourites
    .map((fav) => fav.id)
    .includes(selectedId);

  return (
    <div className="app">
      <Toaster />
      {/* component composition */}
      {/* هدف حذف پراپ درلینگ، حذف پاس دادن پراپ اضافی */}
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <SearchResult numOfResult={characters.length} />
        <Favorites
          favourites={favourites}
          onDeleteFavourite={handleDeleteFavourite}
        />
      </Navbar>
      {/* component composition */}
      <Main>
        <CharacterList
          selectedId={selectedId}
          characters={characters}
          isLoading={isLoading}
          onSelectCharacter={handleSelectCharacter}
        />
        <CharacterDetail
          selectedId={selectedId}
          handleAddFavourites={handleAddFavourites}
          isAddToFavourites={isAddToFavourites}
        />
      </Main>
    </div>
  );
}

export default App;

function Main({ children }) {
  return <div className="main">{children}</div>;
}
