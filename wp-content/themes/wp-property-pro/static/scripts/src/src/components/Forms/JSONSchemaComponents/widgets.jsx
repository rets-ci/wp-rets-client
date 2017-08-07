import React, {Component} from 'react';

export function inputTextElement (props) {
  return (
    <input type="text"
      className="form-control"
      name={props.schema.name}
      placeholder={props.schema.title}
      value={props.value}
      onChange={(event) => props.onChange(event.target.value)}
    />
  );
}

export function radioElement (props) {
  return (
    <div>
      {props.schema.enum.map((d, i) =>
        <div key={d} className="form-check">
          <label className="form-check-label">
            <input type="radio" className="form-check-input" name="optionsRadios" id="optionsRadios1" value={d} />
            {d}
          </label>
        </div>
      )}
    </div>
  )
}

export function selectTextElement (props) {
  return (
    <select
      value={props.value}
      id={props.id}
      className="form-control"
      name={props.schema.name}
      onChange={(event) => props.onChange(event.target.value)}
    >
      <option value="" disabled selected>{props.schema.title}</option>
      {props.schema.enum.map((d, i) => 
        <option key={i} value={d}>{d}</option>
      )}
    </select>
  );
}

export function textareaTextElement (props) {
  return (
    <textarea
      className="form-control"
      id={props.id}
      name={props.name}
      cols={props.options.cols}
      rows={props.options.rows}
      maxLength={props.options.maxlength}
      placeholder={props.schema.title}
      value={props.value}
      onChange={(event) => props.onChange(event.target.value)}
    ></textarea>
  );
}