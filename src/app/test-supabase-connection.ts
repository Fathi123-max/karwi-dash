// "use client";

// import { useEffect, useState } from 'react';
// import { createClient } from '@/lib/supabase/client';

// export default function TestSupabaseConnection() {
//   const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const testConnection = async () => {
//       try {
//         const supabase = createClient();

//         // Test authentication
//         const { data: { session }, error: sessionError } = await supabase.auth.getSession();
//         if (sessionError) {
//           throw new Error(`Auth error: ${sessionError.message}`);
//         }

//         // Test database connection with a simple query
//         const { data, error: queryError } = await supabase
//           .from('admins')
//           .select('id')
//           .limit(1);

//         if (queryError) {
//           throw new Error(`Database query error: ${queryError.message}`);
//         }

//         // Test storage connection
//         const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
//         if (storageError) {
//           throw new Error(`Storage error: ${storageError.message}`);
//         }

//         setConnectionStatus('✅ Supabase connection successful!');
//       } catch (err) {
//         const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//         setError(errorMessage);
//         setConnectionStatus('❌ Supabase connection failed');
//         console.error('Supabase connection error:', err);
//       }
//     };

//     testConnection();
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
//       <div className={`p-4 rounded ${error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
//         <p className="font-bold">{connectionStatus}</p>
//         {error && (
//           <div className="mt-2">
//             <p>Error details:</p>
//             <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">{error}</pre>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
