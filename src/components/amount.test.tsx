import { render } from "@testing-library/react";
import Amount from "./amount";

it("renders 0 correctly", () => {
  const { asFragment } = render(<Amount>{0}</Amount>);
  const integer = asFragment()
    .querySelector(".amount-integer")
    ?.innerHTML.trim();
  const fraction = asFragment()
    .querySelector(".amount-fraction")
    ?.innerHTML.trim();
  expect(integer).toBe("0");
  expect(fraction).toBe("00");
});

it("renders positive two-digit integer correctly", () => {
  const { asFragment } = render(<Amount>{15}</Amount>);
  const integer = asFragment()
    .querySelector(".amount-integer")
    ?.innerHTML.trim();
  const fraction = asFragment()
    .querySelector(".amount-fraction")
    ?.innerHTML.trim();
  expect(integer).toBe("15");
  expect(fraction).toBe("00");
});

it("renders negative integer correctly", () => {
  const { asFragment } = render(<Amount>{-8}</Amount>);
  const integer = asFragment()
    .querySelector(".amount-integer")
    ?.innerHTML.trim();
  const fraction = asFragment()
    .querySelector(".amount-fraction")
    ?.innerHTML.trim();
  expect(integer).toBe("-8");
  expect(fraction).toBe("00");
});

it("renders number with 1 fraction digit correctly", () => {
  const { asFragment } = render(<Amount>{28.4}</Amount>);
  const integer = asFragment()
    .querySelector(".amount-integer")
    ?.innerHTML.trim();
  const fraction = asFragment()
    .querySelector(".amount-fraction")
    ?.innerHTML.trim();
  expect(integer).toBe("28");
  expect(fraction).toBe("40");
});

it("renders number with 2 fraction digits correctly", () => {
  const { asFragment } = render(<Amount>{231.87}</Amount>);
  const integer = asFragment()
    .querySelector(".amount-integer")
    ?.innerHTML.trim();
  const fraction = asFragment()
    .querySelector(".amount-fraction")
    ?.innerHTML.trim();
  expect(integer).toBe("231");
  expect(fraction).toBe("87");
});

it("renders number with 3 fraction digits rounded up correctly", () => {
  const { asFragment } = render(<Amount>{0.336}</Amount>);
  const integer = asFragment()
    .querySelector(".amount-integer")
    ?.innerHTML.trim();
  const fraction = asFragment()
    .querySelector(".amount-fraction")
    ?.innerHTML.trim();
  expect(integer).toBe("0");
  expect(fraction).toBe("34");
});

it("renders number with 3 fraction digits rounded down correctly", () => {
  const { asFragment } = render(<Amount>{-72.168}</Amount>);
  const integer = asFragment()
    .querySelector(".amount-integer")
    ?.innerHTML.trim();
  const fraction = asFragment()
    .querySelector(".amount-fraction")
    ?.innerHTML.trim();
  expect(integer).toBe("-72");
  expect(fraction).toBe("17");
});

it("hides fraction if it's zero and hide zero flag is set", () => {
  const { asFragment } = render(<Amount hideZeroFraction>{-28}</Amount>);
  const integer = asFragment()
    .querySelector(".amount-integer")
    ?.innerHTML.trim();
  expect(integer).toBe("-28");
  expect(asFragment().querySelector(".amount-fraction")).toBeNull();
});

it("shows fraction if hide zero flag is set but it's not zero", () => {
  const { asFragment } = render(<Amount hideZeroFraction>{-12.8}</Amount>);
  const integer = asFragment()
    .querySelector(".amount-integer")
    ?.innerHTML.trim();
  const fraction = asFragment()
    .querySelector(".amount-fraction")
    ?.innerHTML.trim();
  expect(integer).toBe("-12");
  expect(fraction).toBe("80");
});
