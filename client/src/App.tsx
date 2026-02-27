/*
 * ApexCare Medical Centre — App Router
 * Design: Warm Medical Humanity | Teal + Cream | Playfair + DM Sans
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Departments from "./pages/Departments";
import DepartmentDetail from "./pages/DepartmentDetail";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import BookAppointmentWithPayment from "./pages/BookAppointmentWithPayment";
import PatientPortal from "./pages/PatientPortal";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path="/about" component={About} />
      <Route path="/departments" component={Departments} />
      <Route path="/departments/:id" component={DepartmentDetail} />
      <Route path="/doctors" component={Doctors} />
      <Route path="/doctors/:id" component={DoctorDetail} />
      <Route path="/book-appointment" component={BookAppointmentWithPayment} />
      <Route path="/patient-portal" component={PatientPortal} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogDetail} />
      <Route path="/contact" component={Contact} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-right" richColors />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
