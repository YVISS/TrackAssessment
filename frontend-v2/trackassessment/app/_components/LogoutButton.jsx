import { logout } from "../(auth)/actions";

export default function LogoutButton() {
  return (
    <form>
      <button className="w-full border py-4 px-8 rounded-xl bg-purple-500 border-purple-500 
      hover:bg-transparent hover:border-red-500 hover:text-red-400 
      ease-in-out duration-300" formAction={logout}>Logout</button>
    </form>
  );
}
