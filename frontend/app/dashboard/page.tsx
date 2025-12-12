import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import '../styles/dashboard.css'
export default async function Page() {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)

  const { data: users, error } = await supabase.from('users').select('*')

  if (error) {
    console.error('Error fetching users:', error)
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-red-500">Error loading data: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        {users && users.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 table-auto border-collapse border-spacing-2 space-y-2">
            <thead className='text-left'>
              <tr className='table-headings'>
                <th>ID</th>
                <th>Username</th>
                <th>Password</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (

                <tr key={user.id} className={user.name ? 'table-data text-black odd:bg-gray-100' : ''}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.password}</td>
                  <td><a href="#">Edit</a> | <a href="#">Delete</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No Users found. Create some users in your Supabase database!</p>
        )}

      </div>

    </div>
  )
}