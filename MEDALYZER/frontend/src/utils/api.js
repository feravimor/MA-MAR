export const fetchData = async (endpoint, options = {}) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
