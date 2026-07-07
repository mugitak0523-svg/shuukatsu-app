import { signIn } from "@/auth";
import { Button } from "@/components/ui/Button";

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/companies" });
      }}
    >
      <Button type="submit">Googleで続ける</Button>
    </form>
  );
}
