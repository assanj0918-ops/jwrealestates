import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import PropertiesPage from "@/pages/properties";
import PropertyDetailPage from "@/pages/property-detail";
import AgentsPage from "@/pages/agents";
import ContactPage from "@/pages/contact";
import BlogPage from "@/pages/blog";
import BlogPostPage from "@/pages/blog-post";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import DashboardPage from "@/pages/dashboard";
import AdminDashboard from "@/pages/admin/index";
import PropertyFormPage from "@/pages/admin/property-form";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/properties" component={PropertiesPage} />
      <Route path="/properties/:id" component={PropertyDetailPage} />
      <Route path="/agents" component={AgentsPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/properties/new" component={PropertyFormPage} />
      <Route path="/admin/properties/:id/edit" component={PropertyFormPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
