import React from "react";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import InboxIcon from "@material-ui/icons/MoveToInbox";

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
  })
);

interface SideNavProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

function SideNav(props: SideNavProps) {
  const { mobileOpen, handleDrawerToggle } = props;
  const classes = useStyles();

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h4" noWrap>
          Manuka
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Campaigns" />
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
          onClose={handleDrawerToggle}
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
