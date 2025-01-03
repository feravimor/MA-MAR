export const authenticate = async (email, password) => {
  try {
    const response = await fetch('https://api.medalyzer.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('API error:', error);
    return false;
  }
};
