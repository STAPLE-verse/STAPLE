import {
  WidgetProps,
  RegistryWidgetsType,
  RegistryFieldsType,
  RegistryTemplatesType,
  TitleFieldProps,
  FieldTemplateProps,
} from "@rjsf/utils"
import { ThemeProps } from "@rjsf/core"

// this is the title field template
import { FormContextType, TitleFieldProps, RJSFSchema, StrictRJSFSchema } from "@rjsf/utils"
const REQUIRED_FIELD_SYMBOL = "REQUIRED"
function MyTitleField<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: TitleFieldProps<T, S, F>) {
  const { id, title, required } = props
  return (
    <legend id={id} className="text-2xl erin">
      <div className="text-2xl erin">{title}</div>
      {required && <span className="required">{REQUIRED_FIELD_SYMBOL}</span>}
    </legend>
  )
}

// this is the description
import { DescriptionFieldProps, FormContextType, RJSFSchema, StrictRJSFSchema } from "@rjsf/utils"
function MyDescriptionField<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: DescriptionFieldProps<T, S, F>) {
  const { id, description } = props
  if (!description) {
    return null
  }
  if (typeof description === "string") {
    return (
      <p id={id} className="text-2xl marton">
        {description}
      </p>
    )
  } else {
    return (
      <div id={id} className="text-2xl marton">
        {description}
      </div>
    )
  }
}

// here's the custom widgets
const MyTextWidget = (props: WidgetProps) => {
  return (
    <div className="flex">
      <input
        type="text"
        style={{ fontSize: "1rem" }}
        className="input input-bordered m-2 w-full max-w-xs font-serif"
        value={props.value || ""}
        required={props.required}
        onChange={(event) => props.onChange(event.target.value)}
      />
    </div>
  )
}

//create Registry information
const myTemplates: RegistryTemplatesType = {
  StringField: MyTitleField,
  DescriptionFieldTemplate: MyDescriptionField,
}

const myWidgets: RegistryWidgetsType = {
  TextWidget: MyTextWidget,
}

// create the overall theme to use on the other page
const DaisyTheme: ThemeProps = {
  widgets: myWidgets,
  templates: myTemplates,
}
export default DaisyTheme
