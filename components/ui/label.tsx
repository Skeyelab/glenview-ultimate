import * as React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label(props: LabelProps): React.JSX.Element {
  return <label className="block text-sm text-slate-800 mb-1" {...props} />;
}
