import { SyntheticEvent, useRef } from "react";

interface InputGroupProps {
  label?: string;
  value: string;
  onInput: (val: string) => void;
  [x: string]: any;
}

export default function TextareaGroup({
  label,
  value,
  onInput,
  ...props
}: InputGroupProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  function onInputHandler() {
    inputRef?.current && onInput(inputRef.current.value);
  }

  return (
    <div className="form-control mb-3">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <textarea
        ref={inputRef}
        placeholder="London, UK"
        className="textarea textarea-bordered "
        value={value}
        onInput={onInputHandler}
        {...props}
      />
    </div>
  );
}
