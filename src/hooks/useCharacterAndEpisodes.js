import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function useCharacterAndEpisodes(selectedId) {
  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character/${selectedId}`
        );
        setCharacter(data);
        // دیتای بالا که دریافت کردیم پراپرتی اپیزودش را مپ میزنیم بر اساس اسلش جدا میکنیم و خونه آخرش را بر میداریم
        const episodesId = data.episode.map((e) => e.split("/").at(-1));
        const { data: episodeData } = await axios.get(
          `https://rickandmortyapi.com/api/episode/${episodesId}`
        );
        // بعضی از دیتاها آرایه ای از آبجکتا هستند و برای حل خطا تبدیل به استرینگ بعد متد فلت اینو به آرایه یکدست تبدیل میکند
        setEpisodes([episodeData].flat().slice(0, 6));
      } catch (error) {
        toast.error(error.response.data.error);
      } finally {
        setIsLoading(false);
      }
    }

    if (selectedId) fetchData();
  }, [selectedId]);

  return { character, isLoading, episodes };
}

// مقادیر کارکتر و ایز لودینگ و اپیزود ها را بر میگرداند