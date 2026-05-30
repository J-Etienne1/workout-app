import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WeightEditor } from "./WeightEditor.jsx";

function setup(value) {
  const onChange = vi.fn();
  render(<WeightEditor value={value} onChange={onChange} />);
  return onChange;
}

describe("WeightEditor", () => {
  it("adds 0.5 kg", () => {
    const onChange = setup(10);
    fireEvent.click(screen.getByLabelText("Increase weight by 0.5 kg"));
    expect(onChange).toHaveBeenCalledWith(10.5);
  });

  it("adds 2.5 kg", () => {
    const onChange = setup(10);
    fireEvent.click(screen.getByLabelText("Increase weight by 2.5 kg"));
    expect(onChange).toHaveBeenCalledWith(12.5);
  });

  it("never goes below zero", () => {
    const onChange = setup(1);
    fireEvent.click(screen.getByLabelText("Decrease weight by 2.5 kg"));
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("avoids floating-point drift", () => {
    const onChange = setup(0.3);
    fireEvent.click(screen.getByLabelText("Increase weight by 0.5 kg"));
    expect(onChange).toHaveBeenCalledWith(0.8);
  });

  it("renders the value with its unit", () => {
    setup(7.5);
    expect(screen.getByText("7.5")).toBeInTheDocument();
    expect(screen.getByText("kg")).toBeInTheDocument();
  });
});
