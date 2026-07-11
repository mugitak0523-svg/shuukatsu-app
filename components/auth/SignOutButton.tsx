import { signOutAction } from "@/server/actions/auth";
import { LogOutIcon } from "@/components/ui/Icons";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function SignOutButton() {
  return (
    <form action={signOutAction} className="w-full">
      <SubmitButton
        className="w-full justify-start gap-2 px-3"
        pendingLabel="ログアウト中..."
        variant="ghost"
      >
        <LogOutIcon />
        ログアウト
      </SubmitButton>
    </form>
  );
}
