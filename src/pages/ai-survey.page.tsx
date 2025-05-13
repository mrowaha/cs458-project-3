import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";
import { DateTime } from "luxon";
import { Button } from "@/components/ui/button";

const aiModels = ["ChatGPT", "Bard", "Claude", "Copilot"] as const;
type AiModel = (typeof aiModels)[number];

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Miami",
] as const;
type City = (typeof cities)[number];

const educationLevels = [
  "High School",
  "Bachelor's",
  "Master's",
  "PhD",
] as const;
type EducationLevel = (typeof educationLevels)[number];

type SurveyFormData = {
  name: string | undefined;
  birthDate: string | undefined;
  education: EducationLevel;
  city: City;
  gender: "male" | "female";
  selectedModels: Array<AiModel>;
  modelCons: Record<AiModel, string>;
  useCase: string;
};

const defaultValues: SurveyFormData = {
  education: "High School",
  city: "Chicago",
  gender: "male",
  selectedModels: [],
  // @ts-ignore
  modelCons: {},
  useCase: "",
};

export default function SurveyWebForm() {
  const { control, handleSubmit, watch, setValue, reset, formState } =
    useForm<SurveyFormData>({
      defaultValues: { ...defaultValues },
    });

  const selectedModels = watch("selectedModels");

  const toggleModel = (model: AiModel) => {
    const current = watch("selectedModels") || [];
    if (current.includes(model)) {
      setValue(
        "selectedModels",
        current.filter((m) => m !== model)
      );
      const modelCons = watch("modelCons");
      setValue("modelCons", {
        ...modelCons,
        [model]: undefined,
      });
    } else {
      setValue("selectedModels", [...current, model]);
    }
  };

  const onSubmit = (data: SurveyFormData) => {
    console.log("Survey Data:", data);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-2xl overflow-hidden bg-zinc-900 border-zinc-800">
        <CardHeader className="space-y-1 items-center">
          <CardTitle className="text-2xl font-bold text-center text-white">
            AI Survey
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            id="ai-survey__form"
            className="max-w-2xl mx-auto p-6 rounded-lg text-accent-contrast overflow-scroll max-h-156"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Full Name */}
            <Controller
              control={control}
              name="name"
              rules={{
                required: "Name is required",
                pattern: {
                  value: /^[a-zA-Z\s'-]+$/,
                  message: "Name contains invalid characters",
                },
              }}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block font-medium mb-1">Full Name</label>
                  <input
                    id="ai-survey__field:full-name"
                    type="text"
                    className="w-full p-2 border rounded"
                    {...field}
                  />
                  {formState.errors.name && (
                    <p
                      id="ai-survey__error:full-name"
                      className="text-red-600 text-sm mt-1"
                    >
                      {formState.errors.name.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Birth Date */}
            <Controller
              control={control}
              name="birthDate"
              rules={{
                required: "Birth Date is required",
                validate: (value) => {
                  if (!value) return "Birth Date is required";
                  const isValid = DateTime.fromFormat(
                    value,
                    "dd-MM-yyyy"
                  ).isValid;
                  return isValid || "Birth Date is invalid";
                },
              }}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block font-medium mb-1">
                    Birth Date (dd-MM-yyyy)
                  </label>
                  <input
                    id="ai-survey__field:birthdate"
                    type="text"
                    className="w-full p-2 border rounded"
                    {...field}
                  />
                  {formState.errors.birthDate && (
                    <p
                      id="ai-survey__error:birthdate"
                      className="text-red-600 text-sm mt-1"
                    >
                      {formState.errors.birthDate.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Education Level */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Education Level</label>
              <Controller
                control={control}
                name="education"
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border rounded bg-zinc-900"
                  >
                    {educationLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            {/* City */}
            <div className="mb-4">
              <label className="block font-medium mb-1">City</label>
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border rounded bg-zinc-900"
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Gender</label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <div className="space-x-4">
                    <label>
                      <input
                        className="appearance-none h-4 w-4 checked:bg-accent-base checked:border-accent-dark rounded-full outline-accent-dark border border-gray-50"
                        type="radio"
                        value="male"
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange("male");
                          }
                        }}
                        checked={field.value === "male"}
                      />{" "}
                      Male
                    </label>
                    <label>
                      <input
                        className="appearance-none h-4 w-4 checked:bg-accent-base checked:border-accent-dark rounded-full outline-accent-dark border border-gray-50"
                        type="radio"
                        value="female"
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange("female");
                          }
                        }}
                        checked={field.value === "female"}
                      />{" "}
                      Female
                    </label>
                  </div>
                )}
              />
            </div>

            {/* AI Models Tried */}
            <div className="mb-4">
              <label className="block font-medium mb-2">AI Models Tried</label>
              {aiModels.map((model) => (
                <label key={model} className="block">
                  <input
                    id={`ai-survey__field:model-${model.toLowerCase()}`}
                    type="checkbox"
                    checked={selectedModels.includes(model)}
                    onChange={() => toggleModel(model)}
                    className="mr-2 accent-accent-base"
                  />
                  {model}
                </label>
              ))}
            </div>

            {/* Model Cons */}
            {selectedModels.map((model) => (
              <Controller
                key={model}
                control={control}
                name={`modelCons.${model}`}
                rules={{
                  maxLength: {
                    value: 10,
                    message: "Defect/con cannot exceed 10 characters",
                  },
                }}
                render={({ field }) => {
                  const key = model.toLowerCase();
                  return (
                    <div className="mb-4">
                      <label className="block font-medium mb-1">
                        Defects/Cons of {model}
                      </label>
                      <input
                        id={`ai-survey__field:modeldefect-${key}`}
                        type="text"
                        className="w-full p-2 border rounded"
                        {...field}
                      />
                      {formState.errors.modelCons?.[model] && (
                        <p
                          id={`ai-survey__error:modeldefect-${key}`}
                          className="text-red-600 text-sm mt-1"
                        >
                          {formState.errors.modelCons[model]?.message}
                        </p>
                      )}
                    </div>
                  );
                }}
              />
            ))}

            {/* Use Case */}
            <Controller
              control={control}
              name="useCase"
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block font-medium mb-1">
                    Any beneficial use case of AI in daily life
                  </label>
                  <textarea
                    {...field}
                    className="w-full p-2 border rounded"
                    rows={4}
                  />
                </div>
              )}
            />

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-accent-base hover:bg-accent-dark"
                id="aisurvey-form__action:submit"
              >
                <p>Submit</p>
              </Button>
              <Button
                className="w-full bg-accent-base hover:bg-accent-dark"
                id="aisurvey-form__action:reset"
                onClick={() => reset()}
              >
                <p>Reset</p>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
