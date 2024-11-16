import newsCategoryList from "@/constants/Categories";
import { useCallback, useState } from "react";

export const useNewsCategories = () => {
  const [newsCategories, setNewsCategories] = useState(newsCategoryList);

  const toggleNewsCategories = useCallback((id: number) => {
    setNewsCategories((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
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
    newsCategories,
    toggleNewsCategories,
  };
};

