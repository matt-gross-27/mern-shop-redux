import React, { useEffect } from "react";
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from "../../utils/actions";
import { useStoreContext } from "../../utils/GlobalState";
import { useQuery } from '@apollo/react-hooks';
import { QUERY_CATEGORIES } from "../../utils/queries";

function CategoryMenu() {
  const [state, dispatch] = useStoreContext();

  const { categories } = state;
  
  const { data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    // if category data exists of has been changed from the response of useQuery run dispatch()
    if (categoryData) {
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });
    }
  }, [categoryData, dispatch]);

  const handleClick = id => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map(({ _id, name }) => (
        <button
          key={_id}
          onClick={() => {
            handleClick(_id)
          }}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
