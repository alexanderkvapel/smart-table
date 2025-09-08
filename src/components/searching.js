import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  // Настройки компаратора
  const compare = createComparison(
    [rules.skipEmptyTargetValues],
    [
      rules.searchMultipleFields(
        searchField,
        ["date", "customer", "seller"],
        false
      ),
    ]
  );

  return (data, state, action) => {
    if (action === "search") {
      return data.filter((item) => compare(item, state));
    } else {
      return data;
    }
  };
}
