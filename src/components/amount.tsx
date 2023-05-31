import React, { memo, FunctionComponent } from "react";

interface Props {
  children: number;
  hideZeroFraction?: boolean;
}

const Amount: FunctionComponent<Props> = ({
  children: value,
  hideZeroFraction,
}) => {
  const integer = Math.trunc(value);
  const fraction = Math.round(Math.abs(value % 1) * 100);
  const paddedFraction = fraction < 10 ? `0${fraction}` : fraction;

  const showFraction = !hideZeroFraction || paddedFraction !== "00";

  return (
    <>
      <span className="amount-integer">{integer}</span>
      {showFraction && (
        <small className="amount-fraction">{paddedFraction}</small>
      )}
    </>
  );
};

export default memo(Amount);
