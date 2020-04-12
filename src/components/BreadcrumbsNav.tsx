import React from "react";
import { Breadcrumbs, Link, Typography } from "@material-ui/core";
import { Link as RouterLink, Route } from "react-router-dom";

function BreadcrumbsNav() {
  return (
    <Route>
      {({ location }) => {
        const pathnames = location.pathname.split("/").filter((x) => x);
        return (
          <Breadcrumbs aria-label="Breadcrumb">
            <Link component={RouterLink} to="/">
              Home
            </Link>
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join("/")}`;
              const slug = value.charAt(0).toUpperCase() + value.slice(1);

              return last ? (
                <Typography color="textPrimary" key={to}>
                  {slug}
                </Typography>
              ) : (
                <Link component={RouterLink} to={to} key={to}>
                  {slug}
                </Link>
              );
            })}
          </Breadcrumbs>
        );
      }}
    </Route>
  );
}

export default BreadcrumbsNav;
