import { signOutAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/Button";
import { LogOutIcon } from "@/components/ui/Icons";

export function SignOutButton() {
  return (
    <form action={signOutAction} className="w-full">
      <Button className="w-full justify-start gap-2 px-3" type="submit" variant="ghost">
        <LogOutIcon />
        ログアウト
      </Button>
    </form>
  );
}
