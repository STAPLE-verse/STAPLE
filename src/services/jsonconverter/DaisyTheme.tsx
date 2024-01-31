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
    <legend id={id} className="text-2xl">
      <div className="text-2xl">{title}</div>
      {required && <span className="required">{REQUIRED_FIELD_SYMBOL}</span>}
    </legend>
  )
}

//update the template
const myTemplates: RegistryTemplatesType = {
  TitleFieldTemplate: MyTitleField,
}

const DaisyTheme: ThemeProps = {
  // widgets: myWidgets,
  templates: myTemplates,
}
export default DaisyTheme
