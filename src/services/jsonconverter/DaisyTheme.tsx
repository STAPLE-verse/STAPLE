import { WidgetProps, RegistryWidgetsType } from "@rjsf/utils"
import { ThemeProps } from "@rjsf/core"

const MyCustomWidget = (props: WidgetProps) => {
  return (
    <input
      type="text"
      className="input input-bordered m-2 w-full max-w-xs"
      value={props.value || ""}
      required={props.required}
      onChange={(event) => props.onChange(event.target.value)}
    />
  )
}

const myWidgets: RegistryWidgetsType = {
  TextWidget: MyCustomWidget,
}

const DaisyTheme: ThemeProps = { widgets: myWidgets }
export default DaisyTheme
