export const itemDeletedAndAdded = <T>(
  main_array: T[],
  new_array: T[],
): {
  itemsToBeDeleted: T[];
  itemsToBeAdded: T[];
} => {
  const itemsToBeDeleted: T[] = main_array.filter((p) => !new_array.includes(p));
  const itemsToBeAdded: T[] = new_array.filter((p) => !main_array.includes(p));

  return {
    itemsToBeAdded,
    itemsToBeDeleted,
  };
};
