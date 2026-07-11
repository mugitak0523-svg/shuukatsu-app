import { signIn } from "@/auth";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/calendar" });
      }}
    >
      <SubmitButton pendingLabel="ログイン中...">Googleで続ける</SubmitButton>
    </form>
  );
}
