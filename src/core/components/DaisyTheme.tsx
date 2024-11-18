// imports
import {
  WidgetProps,
  RegistryWidgetsType,
  TemplatesType,
  FieldTemplateProps,
  FormContextType,
  TitleFieldProps,
  RJSFSchema,
  StrictRJSFSchema,
  DescriptionFieldProps,
  getTemplate,
  getUiOptions,
  getSubmitButtonOptions,
  SubmitButtonProps,
} from "@rjsf/utils"

import { ThemeProps } from "@rjsf/core"

// required information symbol
const REQUIRED_FIELD_SYMBOL = " *"

// required label information
type LabelProps = {
  /** The label for the field */
  label?: string
  /** A boolean value stating if the field is required */
  required?: boolean
  /** The id of the input field being labeled */
  id?: string
}

function Label(props: LabelProps) {
  const { label, required, id } = props
  if (!label) {
    return null
  }
  return (
    <label className="text-lg font-bold" htmlFor={id}>
      {label}
      {required && <span className="font-red italic">{REQUIRED_FIELD_SYMBOL}</span>}
    </label>
  )
}

// template updates

// title field template the top template
function MyTitleField<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: TitleFieldProps<T, S, F>) {
  const { id, title, required } = props
  return (
    <legend id={id} className="text-xl font-bold">
      {title}
      {required && <span className="required">{REQUIRED_FIELD_SYMBOL}</span>}
    </legend>
  )
}

// description field template
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
      <p id={id} className="text-md italic">
        {description}
      </p>
    )
  } else {
    return (
      <div id={id} className="text-md italic">
        {description}
      </div>
    )
  }
}

// field template
function MyFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: FieldTemplateProps<T, S, F>) {
  const {
    id,
    label,
    children,
    errors,
    help,
    description,
    hidden,
    required,
    displayLabel,
    registry,
    uiSchema,
  } = props
  const uiOptions = getUiOptions(uiSchema)
  const WrapIfAdditionalTemplate = getTemplate<"WrapIfAdditionalTemplate", T, S, F>(
    "WrapIfAdditionalTemplate",
    registry,
    uiOptions
  )
  if (hidden) {
    return <div className="hidden">{children}</div>
  }
  return (
    <WrapIfAdditionalTemplate {...props}>
      {displayLabel && <Label label={label} required={required} id={id} />}
      {displayLabel && description ? description : null}
      {children}
      {errors}
      {help}
    </WrapIfAdditionalTemplate>
  )
}

// button templates
function MySubmitButton<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>({ uiSchema }: SubmitButtonProps<T, S, F>) {
  const {
    submitText,
    norender,
    props: submitButtonProps = {},
  } = getSubmitButtonOptions<T, S, F>(uiSchema)
  if (norender) {
    return null
  }
  return (
    <div>
      <button
        type="submit"
        {...submitButtonProps}
        className={`btn btn-primary ${submitButtonProps.className || ""}`}
      >
        {submitText}
      </button>
    </div>
  )
}

// here's the custom widgets

// text input field
const MyTextWidget = (props: WidgetProps) => {
  return (
    <div className="flex">
      <input
        type="text"
        style={{ fontSize: "1rem" }}
        className="input input-primary input-bordered w-full max-w-sm m-2"
        value={props.value || ""}
        required={props.required}
        onChange={(event) => props.onChange(event.target.value)}
      />
    </div>
  )
}

const MyEmailWidget = (props: WidgetProps) => {
  return (
    <div className="flex">
      <input
        type="email"
        style={{ fontSize: "1rem" }}
        className="input input-primary input-bordered w-full max-w-sm m-2"
        value={props.value || ""}
        required={props.required}
        onChange={(event) => props.onChange(event.target.value)}
      />
    </div>
  )
}

// Default placeholder components for other buttons
const DefaultTemplate = () => null

// create Registry information
// templates
const myTemplates: TemplatesType = {
  TitleFieldTemplate: MyTitleField,
  DescriptionFieldTemplate: MyDescriptionField,
  FieldTemplate: MyFieldTemplate,
  ButtonTemplates: {
    SubmitButton: MySubmitButton,
    AddButton: DefaultTemplate,
    CopyButton: DefaultTemplate,
    MoveDownButton: DefaultTemplate,
    MoveUpButton: DefaultTemplate,
    RemoveButton: DefaultTemplate,
  },
  ArrayFieldTemplate: DefaultTemplate,
  ArrayFieldDescriptionTemplate: DefaultTemplate,
  ArrayFieldItemTemplate: DefaultTemplate,
  ArrayFieldTitleTemplate: DefaultTemplate,
  ObjectFieldTemplate: DefaultTemplate,
  ErrorListTemplate: DefaultTemplate,
  BaseInputTemplate: DefaultTemplate,
  UnsupportedFieldTemplate: DefaultTemplate,
  FieldErrorTemplate: DefaultTemplate,
  FieldHelpTemplate: DefaultTemplate,
  WrapIfAdditionalTemplate: DefaultTemplate,
}

// templates
const myWidgets: RegistryWidgetsType = {
  TextWidget: MyTextWidget,
  EmailWidget: MyEmailWidget,
}

// create the overall theme to use on the other page
const DaisyTheme: ThemeProps = {
  widgets: myWidgets,
  templates: myTemplates,
}
export default DaisyTheme
