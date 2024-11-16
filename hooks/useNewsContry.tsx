import newsCategoryList from "@/constants/Categories";
import CountryList from "@/constants/CountryList";
import { useCallback, useState } from "react";

export const useNewsCountry = () => {
  const [newsCountry, setNewsCountry] = useState(CountryList);

  const toggleNewsCountry = useCallback((id: number) => {
    setNewsCountry((prev) => {
      return prev.map((item, index) => {
        if (index === id) {
          return {
            ...item,
            selected: !item.selected,
          };
        }

        return item;
      });
    });
  }, []);

  return {
    newsCountry,
    toggleNewsCountry,
  };
};
