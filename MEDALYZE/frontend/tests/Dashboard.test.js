import { render, screen } from "@testing-library/react";
import Dashboard from "../src/components/Dashboard";

test("renders dashboard", () => {
    render(<Dashboard />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
});

test("renders appointment list", () => {
    render(<Dashboard />);
    expect(screen.getByText(/appointments/i)).toBeInTheDocument();
});
