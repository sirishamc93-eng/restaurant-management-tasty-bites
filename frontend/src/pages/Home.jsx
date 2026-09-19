import {
  useEffect,
  useState
} from "react";

import MenuCard from "../components/MenuCard";
import Loading from "../components/Loading";
import API from "../services/api";

const categories = [
  "Starters",
  "Main Course",
  "Desserts",
  "Drinks"
];

const Home = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response =
          await API.get("/menu");

        setMenu(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <section className="bg-gray-900 px-6 py-20 text-center text-white">
        <p className="mb-3 text-orange-400">
          WELCOME TO TASTYBITE
        </p>

        <h1 className="text-4xl font-black sm:text-6xl">
          Delicious Food,
          <br />
          Delivered With Love
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-gray-300">
          Fresh ingredients, delicious recipes and
          unforgettable flavors.
        </p>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12">
        {categories.map((category) => {
          const items = menu.filter(
            (item) =>
              item.category === category &&
              item.isAvailable
          );

          if (items.length === 0) {
            return null;
          }

          return (
            <section
              key={category}
              className="mb-14"
            >
              <div className="mb-7">
                <h2 className="text-3xl font-black text-gray-900">
                  {category}
                </h2>

                <div className="mt-2 h-1 w-16 rounded bg-orange-600" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item) => (
                  <MenuCard
                    key={item._id}
                    item={item}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
};

export default Home;