import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GetFunding } from "@/routes/get-funding";

// Mock TanStack router and start functions
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    createFileRoute: () => () => ({
      useSearch: () => ({ amount: "50000", reason: "working_capital" }),
    }),
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
  };
});

vi.mock("@/components/SiteShell", () => ({
  Page: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PageHero: () => <div />,
  RiskNotice: () => <div />,
  seo: () => ({}),
}));

vi.mock("@tanstack/react-start", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-start")>();
  return {
    ...actual,
    useServerFn: () => vi.fn(),
  };
});

afterEach(() => {
  cleanup();
});

describe("GetFunding - Step 2 (Working capital conditional reveal)", () => {
  it("keeps step count and layout as Step 2 of 4 · Working capital", () => {
    render(<GetFunding />);
    expect(screen.getByText("Step 2 of 4 · Working capital")).toBeInTheDocument();
    expect(screen.getByText("What will the money mainly be used for?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  it("initially hides 'When do you need the funds?' and its options", () => {
    render(<GetFunding />);
    expect(screen.queryByText("When do you need the funds?")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Within a month" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "As soon as possible" })).not.toBeInTheDocument();
  });

  it("smoothly reveals 'When do you need the funds?' when an option is selected", () => {
    render(<GetFunding />);
    const stockBtn = screen.getByRole("button", { name: "Stock or inventory" });
    fireEvent.click(stockBtn);

    expect(stockBtn).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("When do you need the funds?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "As soon as possible" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Within a month" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "In 1–3 months" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Just researching" })).toBeInTheDocument();
  });

  it("hides 'When do you need the funds?' and resets its state if the first question is deselected", () => {
    render(<GetFunding />);
    const stockBtn = screen.getByRole("button", { name: "Stock or inventory" });
    fireEvent.click(stockBtn);

    // Select an option for "When do you need the funds?"
    const withinMonthBtn = screen.getByRole("button", { name: "Within a month" });
    fireEvent.click(withinMonthBtn);
    expect(withinMonthBtn).toHaveAttribute("aria-pressed", "true");

    // Deselect "Stock or inventory" by clicking it again
    fireEvent.click(stockBtn);
    expect(stockBtn).toHaveAttribute("aria-pressed", "false");

    // "When do you need the funds?" section must now be hidden
    expect(screen.queryByText("When do you need the funds?")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Within a month" })).not.toBeInTheDocument();

    // Re-select "Marketing" or "Stock or inventory"
    const marketingBtn = screen.getByRole("button", { name: "Marketing" });
    fireEvent.click(marketingBtn);

    // "When do you need the funds?" is revealed again
    expect(screen.getByText("When do you need the funds?")).toBeInTheDocument();
    const reopenedWithinMonth = screen.getByRole("button", { name: "Within a month" });
    // Verify stale state was not retained
    expect(reopenedWithinMonth).toHaveAttribute("aria-pressed", "false");
  });

  it("validates that both questions must be answered to continue", () => {
    render(<GetFunding />);
    const continueBtn = screen.getByRole("button", { name: /continue/i });

    // Click Continue when neither is answered
    fireEvent.click(continueBtn);
    expect(screen.getByRole("alert")).toHaveTextContent("Please choose what the money will mainly be used for");
    expect(screen.getByText("Step 2 of 4 · Working capital")).toBeInTheDocument();

    // Select first question
    const stockBtn = screen.getByRole("button", { name: "Stock or inventory" });
    fireEvent.click(stockBtn);

    // Click Continue when second question is revealed but not answered
    fireEvent.click(continueBtn);
    expect(screen.getByRole("alert")).toHaveTextContent("Please choose when you need the funds");
    expect(screen.getByText("Step 2 of 4 · Working capital")).toBeInTheDocument();

    // Select second question
    const asapBtn = screen.getByRole("button", { name: "As soon as possible" });
    fireEvent.click(asapBtn);

    // Continue should now advance to Step 3 of 4 · Your business
    fireEvent.click(continueBtn);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Step 3 of 4 · Your business")).toBeInTheDocument();
  });
});

describe("GetFunding - Step 3 (Your business sequential disclosure)", () => {
  function navigateToStep3() {
    render(<GetFunding />);
    // Step 2: Answer both questions
    fireEvent.click(screen.getByRole("button", { name: "Stock or inventory" }));
    fireEvent.click(screen.getByRole("button", { name: "As soon as possible" }));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(screen.getByText("Step 3 of 4 · Your business")).toBeInTheDocument();
  }

  it("initially shows ONLY the first question and hides the other three", () => {
    navigateToStep3();
    expect(screen.getByText("What type of business is it?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Limited company" })).toBeInTheDocument();

    // The other three questions should NOT be rendered
    expect(screen.queryByText("How long has it been trading?")).not.toBeInTheDocument();
    expect(screen.queryByText("Annual turnover")).not.toBeInTheDocument();
    expect(screen.queryByText("Are any directors or owners homeowners?")).not.toBeInTheDocument();
  });

  it("progressively reveals each subsequent question upon selection", () => {
    navigateToStep3();

    // Question 1 -> Reveals Question 2
    fireEvent.click(screen.getByRole("button", { name: "Limited company" }));
    expect(screen.getByText("How long has it been trading?")).toBeInTheDocument();
    expect(screen.queryByText("Annual turnover")).not.toBeInTheDocument();
    expect(screen.queryByText("Are any directors or owners homeowners?")).not.toBeInTheDocument();

    // Question 2 -> Reveals Question 3
    fireEvent.click(screen.getByRole("button", { name: "1–2 years" }));
    expect(screen.getByText("Annual turnover")).toBeInTheDocument();
    expect(screen.queryByText("Are any directors or owners homeowners?")).not.toBeInTheDocument();

    // Question 3 -> Reveals Question 4
    fireEvent.click(screen.getByRole("button", { name: "£100k – £250k" }));
    expect(screen.getByText("Are any directors or owners homeowners?")).toBeInTheDocument();

    // Question 4 selection
    const yesBtn = screen.getByRole("button", { name: "Yes" });
    fireEvent.click(yesBtn);
    expect(yesBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("hides subsequent questions and clears their selected state when an earlier question is deselected", () => {
    navigateToStep3();

    // Answer all 4 questions
    const ltdBtn = screen.getByRole("button", { name: "Limited company" });
    fireEvent.click(ltdBtn);
    const tradingBtn = screen.getByRole("button", { name: "1–2 years" });
    fireEvent.click(tradingBtn);
    const turnoverBtn = screen.getByRole("button", { name: "£100k – £250k" });
    fireEvent.click(turnoverBtn);
    const yesBtn = screen.getByRole("button", { name: "Yes" });
    fireEvent.click(yesBtn);

    // Deselect Question 2 (trading time)
    fireEvent.click(tradingBtn);
    expect(tradingBtn).toHaveAttribute("aria-pressed", "false");

    // Questions 3 and 4 should be hidden
    expect(screen.queryByText("Annual turnover")).not.toBeInTheDocument();
    expect(screen.queryByText("Are any directors or owners homeowners?")).not.toBeInTheDocument();

    // Re-select Question 2
    fireEvent.click(screen.getByRole("button", { name: "2–5 years" }));
    expect(screen.getByText("Annual turnover")).toBeInTheDocument();

    // Question 3 should reappear with state cleared (not pre-selected)
    const reopenedTurnover = screen.getByRole("button", { name: "£100k – £250k" });
    expect(reopenedTurnover).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByText("Are any directors or owners homeowners?")).not.toBeInTheDocument();
  });

  it("validates that all 4 questions must be answered before continuing", () => {
    navigateToStep3();
    const continueBtn = screen.getByRole("button", { name: /continue/i });

    // Q1 missing
    fireEvent.click(continueBtn);
    expect(screen.getByRole("alert")).toHaveTextContent("Please choose what type of business it is");

    // Select Q1
    fireEvent.click(screen.getByRole("button", { name: "Limited company" }));
    fireEvent.click(continueBtn);
    expect(screen.getByRole("alert")).toHaveTextContent("Please choose how long it has been trading");

    // Select Q2
    fireEvent.click(screen.getByRole("button", { name: "1–2 years" }));
    fireEvent.click(continueBtn);
    expect(screen.getByRole("alert")).toHaveTextContent("Please choose your annual turnover");

    // Select Q3
    fireEvent.click(screen.getByRole("button", { name: "£100k – £250k" }));
    fireEvent.click(continueBtn);
    expect(screen.getByRole("alert")).toHaveTextContent("Please answer whether any directors or owners are homeowners");

    // Select Q4
    fireEvent.click(screen.getByRole("button", { name: "Yes" }));
    fireEvent.click(continueBtn);

    // Should now advance to Step 4
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Step 4 of 4 · Your details")).toBeInTheDocument();
  });
});

describe("GetFunding - Step 4 (Your details progressive field reveal)", () => {
  function navigateToStep4() {
    render(<GetFunding />);
    // Step 2: Answer both questions
    fireEvent.click(screen.getByRole("button", { name: "Stock or inventory" }));
    fireEvent.click(screen.getByRole("button", { name: "As soon as possible" }));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    // Step 3: Answer business questions
    fireEvent.click(screen.getByRole("button", { name: "Limited company" }));
    fireEvent.click(screen.getByRole("button", { name: "1–2 years" }));
    fireEvent.click(screen.getByRole("button", { name: "£100k – £250k" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes" }));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    // Now on Step 4
    expect(screen.getByText("Step 4 of 4 · Your details")).toBeInTheDocument();
  }

  it("initially displays ONLY summary banner, Full name, Back button, and Secure funding button", () => {
    navigateToStep4();
    expect(screen.getByText(/You're looking for/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /secure funding/i })).toBeInTheDocument();

    // Business name, Email, Phone, and Consent checkbox should be hidden by default
    expect(screen.queryByLabelText(/Business name/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Email/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Phone/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("progressively reveals fields one by one as the user types", () => {
    navigateToStep4();

    // 1. Type Full name -> Reveals Business name
    fireEvent.change(screen.getByLabelText(/Full name/i), { target: { value: "Alice Smith" } });
    expect(screen.getByLabelText(/Business name/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Email/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Phone/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();

    // 2. Type Business name -> Reveals Email
    fireEvent.change(screen.getByLabelText(/Business name/i), { target: { value: "Acme Ltd" } });
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Phone/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();

    // 3. Type Email -> Reveals Phone
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "alice@acme.com" } });
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();

    // 4. Type Phone -> Reveals Consent checkbox
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "07123456789" } });
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("keeps revealed fields visible even if an earlier field is edited", () => {
    navigateToStep4();

    const nameInput = screen.getByLabelText(/Full name/i);
    fireEvent.change(nameInput, { target: { value: "Alice Smith" } });
    const companyInput = screen.getByLabelText(/Business name/i);
    fireEvent.change(companyInput, { target: { value: "Acme Ltd" } });
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: "alice@acme.com" } });
    const phoneInput = screen.getByLabelText(/Phone/i);
    fireEvent.change(phoneInput, { target: { value: "07123456789" } });

    // All fields are visible
    expect(screen.getByRole("checkbox")).toBeInTheDocument();

    // Edit earlier field (Full name)
    fireEvent.change(nameInput, { target: { value: "Alice" } });

    // All subsequent fields remain visible and unlocked
    expect(screen.getByLabelText(/Business name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("validates all 4 fields and consent when Secure funding is clicked", () => {
    navigateToStep4();
    const submitBtn = screen.getByRole("button", { name: /secure funding/i });

    // 1. Missing name
    fireEvent.click(submitBtn);
    expect(screen.getByRole("alert")).toHaveTextContent("Please enter your full name");

    // Fill name
    fireEvent.change(screen.getByLabelText(/Full name/i), { target: { value: "Alice Smith" } });
    fireEvent.click(submitBtn);
    expect(screen.getByRole("alert")).toHaveTextContent("Please enter your business name");

    // Fill company
    fireEvent.change(screen.getByLabelText(/Business name/i), { target: { value: "Acme Ltd" } });
    fireEvent.click(submitBtn);
    expect(screen.getByRole("alert")).toHaveTextContent("Please enter a valid email address");

    // Fill email
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "alice@acme.com" } });
    fireEvent.click(submitBtn);
    expect(screen.getByRole("alert")).toHaveTextContent("Please enter your phone number");

    // Fill phone
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "07123456789" } });
    fireEvent.click(submitBtn);
    expect(screen.getByRole("alert")).toHaveTextContent("Please agree to the privacy policy and terms of service");

    // Check consent
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(submitBtn);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
