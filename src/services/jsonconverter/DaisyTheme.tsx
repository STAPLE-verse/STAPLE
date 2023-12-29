import { WidgetProps, RegistryWidgetsType, TitleFieldProps, FieldTemplateProps } from "@rjsf/utils"
import { ThemeProps } from "@rjsf/core"

const MyCustomWidget = (props: WidgetProps) => {
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

const MyTitleFieldTemplate = (props: TitleFieldProps) => {
  const { id, required, title } = props
  return (
    <header id={id}>
      {title}
      {required && <mark>*</mark>}
    </header>
  )
}

function MyFieldTemplate(props: FieldTemplateProps) {
  const { id, classNames, style, label, help, required, description, errors, children } = props
  return (
    <div className={classNames} style={style}>
      <label htmlFor={id}>
        {label}
        {required ? "*" : null}
      </label>
      {description}
      {children}
      {errors}
      {help}
    </div>
  )
}

const myWidgets: RegistryWidgetsType = {
  TextWidget: MyCustomWidget,
}

const DaisyTheme: ThemeProps = {
  widgets: myWidgets,
  // templates: {
  //   FieldTemplate: MyFieldTemplate,
  // },
}
export default DaisyTheme
