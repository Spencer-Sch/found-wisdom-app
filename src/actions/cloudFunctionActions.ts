export const checkUsernameAvailability = async (username: string) => {
  return await fetch(
    `https://us-central1-foundwisdom-76365.cloudfunctions.net/onRegister/${username}`,
    {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};
