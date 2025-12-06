export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

export const formatCurrency = (amount, currency = "CAD") => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatSalaryRange = (salary) => {
  if (!salary || salary.trim() === "") return "Not specified";
  // Salary is stored as string: "100000-120000 CAD"
  return salary;
};

export const getDaysAgo = (dateString) => {
  const now = new Date();
  const pastDate = new Date(dateString);
  const diffTime = Math.abs(now - pastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};
