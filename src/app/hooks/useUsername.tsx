import { generateRandomName } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function useUsername() {
  const [username, setUsername] = useState('');
  const storageKey = 'username';

  useEffect(() => {
    const usr = localStorage.getItem(storageKey);
    if (usr) {
      setUsername(usr);
      return;
    } else {
      const generatedName = generateRandomName();
      localStorage.setItem(storageKey, generatedName);
      setUsername(generatedName);
    }
  }, []);

  return { username };
}
