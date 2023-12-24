import { useEffect, useState } from "react";

export default function useLocalStorage(key, initialState) {
  const [value, setValue] = useState(
    () => JSON.parse(localStorage.getItem(key)) || initialState
  );
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}

//   !چرا از آرایه استفاده کردیم؟
// ! چون دقیقا خصوصیات یوزاستیت را ریترن میکند،ایندکس صفرام استیت و ایندکس یکم ست استیت
// !و هر وقت خواستیم تو لوکال استوریج مورد علاقه ها و سبد خریدو.... راذخیره کنیم فقط نیازه فانکشن بالا را با مقادیر مورد نظر و اسمشون صدا بزنیم