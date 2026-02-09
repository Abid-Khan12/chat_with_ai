import PersonalizationForm from "@/components/forms/personalization-form";

const PersonalizationPage = () => {
  return (
    <div className="page flex items-center justify-center p-6 md:p-10">
      <div className="w-full   max-w-2xl ">
        <PersonalizationForm />
      </div>
    </div>
  );
}

export default PersonalizationPage