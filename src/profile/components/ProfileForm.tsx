import CollapseCard from "src/core/components/CollapseCard"
import { Form, FormProps } from "src/core/components/fields/Form"
import { LabeledCheckboxField } from "src/core/components/fields/LabeledCheckboxField"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import LabelSelectField from "src/core/components/fields/LabelSelectField"
import ThemeSelect from "src/core/components/ThemeSelect"
import { getDateLanguageLocales } from "src/core/utils/getDateLanguageLocales"
import { z } from "zod"

export function ProfileForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const languagesOptions = getDateLanguageLocales()

  return (
    <Form<S> {...props}>
      <CollapseCard
        title="Required Information: Email, Username"
        className="mb-4"
        defaultOpen={true}
      >
        <LabeledTextField
          name="email"
          label="Email:"
          placeholder="Email"
          type="text"
          className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300 w-1/2"
        />
        <LabeledTextField
          name="username"
          label="Username:"
          placeholder="Username"
          type="text"
          className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300 w-1/2"
        />
      </CollapseCard>

      <CollapseCard className="mb-4" title="Email Preferences">
        <LabelSelectField
          className="select text-primary select-bordered border-primary border-2 w-1/2 mb-4"
          name="emailProjectActivityFrequency"
          label="Project Activity Notifications:"
          options={[
            { id: "NEVER", name: "Never" },
            { id: "DAILY", name: "Daily" },
            { id: "WEEKLY", name: "Weekly" },
          ]}
          optionText="name"
          optionValue="id"
          type="string"
        />
        <LabelSelectField
          className="select text-primary select-bordered border-primary border-2 w-1/2 mb-4"
          name="emailOverdueTaskFrequency"
          label="Overdue Task Notifications:"
          options={[
            { id: "NEVER", name: "Never" },
            { id: "DAILY", name: "Daily" },
            { id: "WEEKLY", name: "Weekly" },
          ]}
          optionText="name"
          optionValue="id"
          type="string"
        />
      </CollapseCard>

      <CollapseCard title="User Information: Name, Institution" className="mb-4">
        <p className="text-base italic mb-2">
          If you enter your first and last name, it will replace your username in project areas.
        </p>

        <LabeledTextField
          name="firstName"
          label="First Name:"
          placeholder="First name"
          type="text"
          className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300 w-1/2"
        />
        <LabeledTextField
          name="lastName"
          label="Last Name:"
          placeholder="Last name"
          type="text"
          className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300 w-1/2"
        />
        <LabeledTextField
          name="institution"
          label="Institution:"
          placeholder="Institution"
          type="text"
          className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300 w-1/2"
        />
      </CollapseCard>

      <CollapseCard className="mb-4" title="Look and Feel: Theme, Tooltips, Language, and Icon">
        {/* Theme Selector */}
        <ThemeSelect />

        <LabeledCheckboxField
          name="tooltips"
          label={(value) => (value ? "Turn OFF tooltips" : "Turn ON tooltips")}
          className="checkbox checkbox-primary border-2"
          labelProps={{ className: "text-lg" }}
        />

        <LabelSelectField
          className="select text-primary select-bordered border-primary border-2 w-1/2 mb-4 w-1/2"
          name="language"
          label="Select Language:"
          options={languagesOptions}
          optionText="name"
          optionValue="id"
          type="string"
        />
        <LabeledTextField
          name="gravatar"
          label="Gravatar Email:"
          description="This email will only be used to link to your Gravatar account for your profile picture."
          placeholder="Email"
          type="text"
          className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300 w-1/2"
        />
      </CollapseCard>
    </Form>
  )
}
