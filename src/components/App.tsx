import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import CampaignForm from "./CampaignForm";
import CampaignsView from "./CampaignsView";
import HitForm from "./HitForm";
import HitsView from "./HitsView";
import ListenerForm from "./ListenerForm";
import ListenersView from "./ListenersView";
import SourceForm from "./SourceForm";
import SourcesView from "./SourcesView";
import SideNav from "./SideNav";
import TitleBar from "./TitleBar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

function App() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = (isOpen: boolean) => {
    setMobileOpen(isOpen);
  };

  return (
    <div className={classes.root}>
      <Router>
        <SideNav
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
        <TitleBar handleDrawerToggle={handleDrawerToggle} />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route path="/campaign/create">
              <CampaignForm />
            </Route>
            <Route path="/campaign/:id">
              <CampaignForm />
            </Route>
            <Route path="/campaign">
              <CampaignsView />
            </Route>
            <Route path="/hit/:id">
              <HitForm />
            </Route>
            <Route path="/hit">
              <HitsView />
            </Route>
            <Route path="/source/create">
              <SourceForm />
            </Route>
            <Route path="/source/:id/edit">
              <SourceForm />
            </Route>
            <Route path="/source/:id">
              <SourceForm />
            </Route>
            <Route path="/source">
              <SourcesView />
            </Route>
            <Route path="/listener/create">
              <ListenerForm />
            </Route>
            <Route path="/listener/:id/edit">
              <ListenerForm />
            </Route>
            <Route path="/listener/:id">
              <ListenerForm />
            </Route>
            <Route path="/listener">
              <ListenersView />
            </Route>
            <Route path="/">Home</Route>
          </Switch>
        </main>
      </Router>
    </div>
  );
}

export default App;
