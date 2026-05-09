import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useSupabaseConnection() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('products').select('id').limit(1);
        if (error) {
          // If table doesn't exist yet, it's still a "connection" but with an error
          if (error.code === 'PGRST116' || error.message.includes('relation "products" does not exist')) {
            setIsConnected(true);
          } else {
            setError(error.message);
            setIsConnected(false);
          }
        } else {
          setIsConnected(true);
        }
      } catch (err: any) {
        setError(err.message);
        setIsConnected(false);
      }
    }

    testConnection();
  }, []);

  return { isConnected, error };
}
