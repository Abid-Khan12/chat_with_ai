import LoginForm from "@/components/forms/login-form";

const LoginPage = () => {
  return (
    <div className="page flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xl">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
