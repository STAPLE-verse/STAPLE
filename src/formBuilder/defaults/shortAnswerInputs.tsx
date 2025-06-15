import React, { useState } from "react"
import { Input } from "reactstrap"
import FBCheckbox from "../checkbox/FBCheckbox"
import Tooltip from "../Tooltip"
import { getRandomId } from "../utils"
import type { CardComponentType, FormInput, DataType } from "../types"
import { PlaceholderInput } from "../inputs/PlaceholderInput"
import SelectField from "src/core/components/fields/SelectField"

const formatDictionary = {
  "": "None",
  email: "Email",
  hostname: "Hostname",
  uri: "URI",
  regex: "Regular Expression",
}

type FormatDictionaryKey = "" | "email" | "hostname" | "uri" | "regex"

const formatTypeDictionary = {
  email: "email",
  url: "uri",
}

type FormatTypeDictionaryKey = "email" | "url"

const autoDictionary = {
  "": "None",
  email: "Email",
  username: "User Name",
  password: "Password",
  "street-address": "Street Address",
  country: "Country",
}

type AutoDictionaryKey = "" | "email" | "username" | "password" | "street-address" | "country"

// specify the inputs required for a string type object
const CardShortAnswerParameterInputs: CardComponentType = ({ parameters, onChange }) => {
  const [elementId] = useState(getRandomId())
  return (
    <div>
      <div className="text-[18px] font-bold">Minimum Length</div>
      <Input
        value={parameters.minLength ? parameters.minLength : ""}
        placeholder="Minimum Length"
        key="minLength"
        type="number"
        onChange={(ev) => {
          onChange({
            ...parameters,
            minLength: parseInt(ev.target.value, 10),
          })
        }}
        className="card-modal-number"
      />
      <div className="text-[18px] font-bold">Maximum Length</div>
      <Input
        value={parameters.maxLength ? parameters.maxLength : ""}
        placeholder="Maximum Length"
        key="maxLength"
        type="number"
        onChange={(ev) => {
          onChange({
            ...parameters,
            maxLength: parseInt(ev.target.value, 10),
          })
        }}
        className="card-modal-number"
      />
      <div className="text-[18px] font-bold">
        Regular Expression Pattern{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Tooltip
            id={`${elementId}_regex`}
            type="help"
            text="Regular expression pattern that this must satisfy"
          />
        </a>
      </div>
      <Input
        value={parameters.pattern ? parameters.pattern : ""}
        placeholder="Regular Expression Pattern"
        key="pattern"
        type="text"
        onChange={(ev) => {
          onChange({
            ...parameters,
            pattern: ev.target.value,
          })
        }}
        className="card-modal-text"
      />
      <div className="text-[18px] font-bold">
        Format{" "}
        <Tooltip
          id={`${elementId}_format`}
          type="help"
          text="Require string input to match a certain common format"
        />
      </div>
      <SelectField
        className="select text-primary select-bordered border-primary border-2 w-full mt-2 mb-2 bg-primary-content"
        value={parameters.format || ""}
        onChange={(e) =>
          onChange({
            ...parameters,
            format: e.target.value,
          })
        }
        options={Object.keys(formatDictionary).map((key) => ({
          value: key,
          label: formatDictionary[key as FormatDictionaryKey],
        }))}
        optionValue="value"
        optionText="label"
      />
      <div className="text-[18px] font-bold">
        Auto Complete Category{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Tooltip
            id={`${elementId}_autocomplete`}
            type="help"
            text="Suggest entries based on the user's browser history"
          />
        </a>
      </div>
      <SelectField
        className="select text-primary select-bordered border-primary border-2 w-full mt-2 mb-2 bg-primary-content"
        value={parameters["ui:autocomplete"] || ""}
        onChange={(e) =>
          onChange({
            ...parameters,
            "ui:autocomplete": e.target.value,
          })
        }
        options={Object.keys(autoDictionary).map((key) => ({
          value: key,
          label: autoDictionary[key as AutoDictionaryKey],
        }))}
        optionValue="value"
        optionText="label"
      />

      <PlaceholderInput parameters={parameters} onChange={onChange} />

      <div className="card-modal-boolean">
        <FBCheckbox
          onChangeValue={() => {
            onChange({
              ...parameters,
              "ui:autofocus": parameters["ui:autofocus"]
                ? parameters["ui:autofocus"] !== true
                : true,
            })
          }}
          isChecked={parameters["ui:autofocus"] ? parameters["ui:autofocus"] === true : false}
          label="Auto Focus"
        />
      </div>
    </div>
  )
}

const ShortAnswerField: CardComponentType = ({ parameters, onChange }) => {
  return (
    <React.Fragment>
      <h5>Default Value</h5>
      <Input
        value={parameters.default as string | number | readonly string[] | undefined}
        placeholder="Default"
        type={
          (formatTypeDictionary[parameters.format as FormatTypeDictionaryKey] as "email" | "url") ||
          "text"
        }
        onChange={(ev) => onChange({ ...parameters, default: ev.target.value })}
        className="card-text"
      />
    </React.Fragment>
  )
}

const Password: CardComponentType = ({ parameters, onChange }) => {
  return (
    <React.Fragment>
      <h5>Default Password</h5>
      <Input
        value={parameters.default as string | number | readonly string[] | undefined}
        placeholder="Default"
        type="password"
        onChange={(ev) => onChange({ ...parameters, default: ev.target.value })}
        className="card-text"
      />
    </React.Fragment>
  )
}

const shortAnswerInput: { [key: string]: FormInput } = {
  shortAnswer: {
    displayName: "Short Answer",
    matchIf: [
      {
        types: ["string"],
      },
      ...["email", "hostname", "uri", "regex"].map((format) => ({
        types: ["string"] as DataType[],
        format,
      })),
    ],
    defaultDataSchema: {},
    defaultUiSchema: {},
    type: "string",
    cardBody: ShortAnswerField,
    modalBody: CardShortAnswerParameterInputs,
  },
  password: {
    displayName: "Password",
    matchIf: [
      {
        types: ["string"],
        widget: "password",
      },
    ],
    defaultDataSchema: {},
    defaultUiSchema: {
      "ui:widget": "password",
    },
    type: "string",
    cardBody: Password,
    modalBody: CardShortAnswerParameterInputs,
  },
}

export default shortAnswerInput
