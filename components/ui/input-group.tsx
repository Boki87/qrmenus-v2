import { SyntheticEvent, useRef } from "react";

interface InputGroupProps {
  label?: string;
  value: string;
  onInput: (val: string) => void;
  [x: string]: any;
}

export default function InputGroup({
  label,
  value,
  onInput,
  ...props
}: InputGroupProps) {
  const inputRef = useRef<HTMLInputElement>(null);
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
      <input
        ref={inputRef}
        type="text"
        className="input input-bordered w-full rounded"
        value={value}
        onInput={onInputHandler}
        {...props}
      />
    </div>
  );
}
