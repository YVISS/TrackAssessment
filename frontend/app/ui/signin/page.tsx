
import { auth, signIn, signOut } from "@/auth"

export default async function SignIn() {
  const session = await auth();
  console.log("Session:", session);
  return (
    <section className="flex w-full">
      <form
      className="flex w-full justify-center"
        action={async () => {
          "use server"
          await signIn("google")
        }}
      >
        <button type="submit" className="formbtns h-auto">Signin with Google</button>
      </form>
    </section>

  )
} 