import { FinanceProvider } from "../../src/context/FinanceContext";
import DashboardLayout from "../../src/layouts/DashboardLayout";

export default function FinanceLayout({ children }) {
  return (
    <FinanceProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </FinanceProvider>
  );
}
