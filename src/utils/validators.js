const validateProduct = (data) => {
  const errors = [];
  if (!data.name) errors.push('Name is required');
  if (data.price < 0) errors.push('Price must be positive');
  if (data.stock < 0) errors.push('Stock cannot be negative');
  return errors;
};