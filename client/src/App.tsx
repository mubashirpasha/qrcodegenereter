import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import PageMeta from "./components/PageMeta";

const GeneratorPage = lazy(() => import("./pages/GeneratorPage"));
const AboutPage = lazy(() => import("./pages/InfoPage").then((module) => ({ default: module.AboutPage })));
const CodeTypesPage = lazy(() => import("./pages/InfoPage").then((module) => ({ default: module.CodeTypesPage })));
const ContactPage = lazy(() => import("./pages/InfoPage").then((module) => ({ default: module.ContactPage })));
const FAQPage = lazy(() => import("./pages/InfoPage").then((module) => ({ default: module.FAQPage })));
const PrivacyPage = lazy(() => import("./pages/InfoPage").then((module) => ({ default: module.PrivacyPage })));
const QRUseCasePage = lazy(() => import("./pages/InfoPage").then((module) => ({ default: module.QRUseCasePage })));
const TermsPage = lazy(() => import("./pages/InfoPage").then((module) => ({ default: module.TermsPage })));

function RouteLoader() { return <div className="route-loader" role="status" aria-live="polite"><span className="signal-dot" />Loading code studio…</div>; }


function Router() {
  return (
    <><PageMeta /><Suspense fallback={<RouteLoader />}><Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/qr-generator"}>{() => <GeneratorPage mode="qr" />}</Route>
      <Route path={"/barcode-generator"}>{() => <GeneratorPage mode="barcode" />}</Route>
      <Route path={"/wifi-qr-code-generator"}>{() => <QRUseCasePage kind="wifi" />}</Route>
      <Route path={"/vcard-qr-code-generator"}>{() => <QRUseCasePage kind="vcard" />}</Route>
      <Route path={"/qr-types"}>{() => <CodeTypesPage type="qr" />}</Route>
      <Route path={"/barcode-types"}>{() => <CodeTypesPage type="barcode" />}</Route>
      <Route path={"/about"} component={AboutPage} />
      <Route path={"/faq"} component={FAQPage} />
      <Route path={"/contact"} component={ContactPage} />
      <Route path={"/privacy"} component={PrivacyPage} />
      <Route path={"/terms"} component={TermsPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch></Suspense></>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
