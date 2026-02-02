import { Header } from "@/components/navbar/header";
import { PrimaryChildrenProp } from "@/types/types";

const PublicLayout = ({ children }: PrimaryChildrenProp) => {
  return (
    <>
      <Header />
      <main className="w-full max-w-5xl mx-auto h-full px-2">{children}</main>
    </>
  );
};

export default PublicLayout;
