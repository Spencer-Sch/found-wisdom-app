import React from 'react';

import { AuthProvider } from '../../contexts/AuthContext';
import { WisdomStoreProvider } from '../../contexts/WisdomStoreContext';

const MyProviders: React.FC = ({ children }) => {
  return (
    <AuthProvider>
      <WisdomStoreProvider>{children}</WisdomStoreProvider>
    </AuthProvider>
  );
};

export default MyProviders;
