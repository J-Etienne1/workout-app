import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RepsEditor } from "./RepsEditor.jsx";

describe("RepsEditor", () => {
  it("steps reps by 1", () => {
    const onChange = vi.fn();
    render(
      <RepsEditor value={10} onChange={onChange} type="count" target="10–12" />
    );
    fireEvent.click(screen.getByLabelText("Increase by 1"));
    expect(onChange).toHaveBeenCalledWith(11);
  });

  it("clamps reps at zero", () => {
    const onChange = vi.fn();
    render(
      <RepsEditor value={0} onChange={onChange} type="count" target="10–12" />
    );
    fireEvent.click(screen.getByLabelText("Decrease by 1"));
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("steps durations by 5 and shows the time label", () => {
    const onChange = vi.fn();
    render(
      <RepsEditor value={45} onChange={onChange} type="duration" target="45–60s" />
    );
    expect(screen.getByText("Time")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Increase by 5"));
    expect(onChange).toHaveBeenCalledWith(50);
  });
});
