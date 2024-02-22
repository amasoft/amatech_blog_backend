const fieldsValidation = (items) => {
  const item = Object.entries(items).find(
    (el) => el[1] === "" || el[1] === undefined
  );

  return item ? item[0] : false;
};
