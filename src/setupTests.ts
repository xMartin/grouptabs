// https://dev.to/marabesi/configuring-vitest-and-testing-library-to-work-together-4knn
import matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

expect.extend(matchers);
