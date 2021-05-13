import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";
import "tailwindcss/dist/tailwind.css";

import Home from "./routes/home";
import Profile from "./routes/profile";
import NotFoundPage from "./routes/notfound";
import Header from "./components/header";

console.clear();
const App: FunctionalComponent = () => (
  <div id="preact_root">
    <Header />
    <Router>
      <Route path="/" component={Home} />
      <Route path="/profile/" component={Profile} user="me" />
      <Route path="/profile/:user" component={Profile} />
      <NotFoundPage default />
    </Router>
  </div>
);

export default App;
