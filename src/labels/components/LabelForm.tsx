// import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { LabeledTextAreaField } from "src/core/components/LabeledTextAreaField"

import { Field, useField, FormSpy } from "react-final-form"

import { boolean, z } from "zod"

export { FORM_ERROR } from "src/core/components/Form"

interface LabelFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  // name: string
  // description: string
  // taxonomy: string
  userId?: number
  taxonomyList: string[]
}

export function LabelForm<S extends z.ZodType<any, any>>(props: LabelFormProps<S>) {
  const { taxonomyList, ...formProps } = props

  return (
    <Form<S> {...formProps}>
      {/* Name */}
      <LabeledTextField
        className="mb-4 text-primary border-primary border-2 bg-base-300"
        name="name"
        label="Label Name:"
        placeholder="Add label Name"
        type="text"
      />

      {/* Description */}
      <LabeledTextAreaField
        className="mb-4 text-primary border-primary border-2 bg-base-300"
        name="description"
        label="Label Description:"
        placeholder="Add Label Description"
        type="text"
      />
      {/* taxonomy */}
      <LabeledTextField
        className="mb-4 text-primary border-primary border-2 bg-base-300"
        name="taxonomy"
        label="Taxonomy:"
        placeholder="Label taxonomy"
        type="text"
        list="taxonomy_tags"
      />
      <datalist id={"taxonomy_tags"}>
        {taxonomyList.map((value: any, index) => (
          <option value={value} key={index} />
        ))}
      </datalist>
      {/* <div>
      <input list="cars" name="car" onfocus="this.value=''" onchange="this.blur();" placeholder = "Type car name"> </input>

    <datalist id="cars">
      <option value="Jeep">
      <option value="Lamborghini">
      <option value="Ferrari">
      <option value="Fiat 500">
      <option value="Gran Torino">
    </datalist>
  </div> */}

      {/* <Field name="taxonomy" className="">
        {({ input: { value, onChange, onFocus, ...input } }) => {
          return (
            <div>
              <datalist id={"taxonomy_tags"}>
                {taxonomyList.map((value: any, index) => (
                  <option value={value} key={index} />
                ))}
              </datalist>
              <label className="text-lg ">Taxonomy </label>
              <input
                list="taxonomy_tags"
                onFocus={({ target }) => {
                  value = ""
                }}
                onChange={({ target }) => {
                  target.blur()
                  onChange(target.files)
                }}
                {...input}
                type="text"
                placeholder="Label taxonomy"
                className="w-full resize max-w-sm m-2"
              />

              <style jsx>{`
                label {
                  display: flex;
                  flex-direction: column;
                  align-items: start;
                  font-size: 1.5rem;
                }
                input {
                  font-size: 1rem;
                  padding: 0.25rem 0.5rem;
                  border-radius: 3px;
                  border: 1px solid purple;
                  appearance: none;
                  margin-top: 0.5rem;
                }
              `}</style>
            </div>
          )
        }}
      </Field> */}

      {/* <div>
        <label className="text-lg font-bold">Choose a Form Template: </label>
        <br />
        <Field name="schema" component="select" className="select select-primary w-full max-w-xs">
          <option value="Option1">Option1</option>a<option value="Option2">Option2</option>
          <option className="editable" value="">
            edit
          </option>
          <input
            className="editOption form-control"
            placeholder="..."
            style={{ display: "none" }}
          ></input>
        </Field>
      </div> */}

      {/* <div>
        <label>Favorite Color</label>
        <Field name="taxonomy">
          <div id="editable-select-id" className="form-group">
            <select className="form-control editable-select">
              <option value="Option1">Option1</option>a<option value="Option2">Option2</option>
              <option className="editable" value="">
                edit
              </option>
              <input
                className="editOption form-control"
                placeholder="..."
                style={{ display: "none" }}
              ></input>
            </select>
          </div>
        </Field>
      </div> */}
    </Form>
  )
}
