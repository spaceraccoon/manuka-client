import React from "react";
import {
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import RadioIcon from "@material-ui/icons/Radio";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    drawerPaper: {
      width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
  })
);

interface SideNavProps {
  mobileOpen: boolean;
  handleDrawerToggle: (isOpen: boolean) => void;
}

function SideNav(props: SideNavProps) {
  const { mobileOpen, handleDrawerToggle } = props;
  const classes = useStyles();

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List onClick={() => handleDrawerToggle(false)}>
        <ListItem button component={Link} to="/campaign">
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Campaigns" />
        </ListItem>
        <ListItem button component={Link} to="/hit">
          <ListItemIcon>
            <TrackChangesIcon />
          </ListItemIcon>
          <ListItemText primary="Hits" />
        </ListItem>
        <ListItem button component={Link} to="/listener">
          <ListItemIcon>
            <RadioIcon />
          </ListItemIcon>
          <ListItemText primary="Listeners" />
        </ListItem>
        <ListItem button component={Link} to="/source">
          <ListItemIcon>
            <LibraryBooksIcon />
          </ListItemIcon>
          <ListItemText primary="Sources" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => handleDrawerToggle(false)}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
}

export default SideNav;
