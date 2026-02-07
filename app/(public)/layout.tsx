import { Header } from "@/components/navbar/header";
import { PrimaryChildrenProp } from "@/types/types";

const PublicLayout = ({ children }: PrimaryChildrenProp) => {
  return (
    <div>
      <Header />
      <div className="w-full max-w-5xl mx-auto h-full px-2">
        {children}
      </div>
    </div>
  );
};

export default PublicLayout;
