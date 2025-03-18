import { LoginForm } from "./_components/login-form";

export default function Page() {
  return (
    <div className=" flex min-h-svh min-w-svw items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
