import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

interface DataTableRowButtonsProps {
  dataType: string;
  handleEdit: (redirect: string) => void;
  handleDelete: (id: number) => void;
  isDeleteOnly: boolean;
  rowId: number;
}

function DataTableRowButtons(props: DataTableRowButtonsProps) {
  const { dataType, handleEdit, handleDelete, isDeleteOnly, rowId } = props;
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <div
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      {!isDeleteOnly && (
        <IconButton
          component="span"
          onClick={() => {
            handleEdit(`/${dataType}/${rowId}/edit`);
          }}
        >
          <EditIcon />
        </IconButton>
      )}
      <IconButton component="span" onClick={() => setIsDialogOpen(true)}>
        <DeleteIcon />
      </IconButton>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Delete {dataType}?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The campaign will be deleted from the database.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            No
          </Button>
          <Button
            onClick={() => {
              handleDelete(rowId);
              setIsDialogOpen(false);
            }}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DataTableRowButtons;
