import { logout } from "../(auth)/actions";

export default function LogoutButton() {
  return (
    <form>
      <button className="w-full border py-2 px-4 rounded-xl bg-red-500 border-red-500 
      hover:bg-transparent hover:border-purple-500 hover:text-purple-400 hover:cursor-pointer
      ease-in-out duration-300" formAction={logout}>Logout</button>
    </form>
  );
}
