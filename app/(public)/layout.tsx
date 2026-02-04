import { Header } from "@/components/navbar/header";
import { PrimaryChildrenProp } from "@/types/types";

const PublicLayout = ({ children }: PrimaryChildrenProp) => {
  return (
    <div className="w-full max-w-5xl mx-auto h-full px-2">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default PublicLayout;
