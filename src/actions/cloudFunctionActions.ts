export const checkUsernameAvailability = async (username: string) => {
  try {
    const res = await fetch(
      `https://us-central1-foundwisdom-76365.cloudfunctions.net/onRegister/${username}`,
      {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

    const data = await res.json();
    return data;
  } catch (error) {
    console.log('cloudFunctionActions -> checkUsernameAvailability', error);
    console.error(error);
  }
};
