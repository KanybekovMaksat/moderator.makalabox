import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from '@mui/material/Alert';
import ok from "../../images/task.png";
import no from "../../images/no.png";

const CustomSnackbar = ({ open, onClose, message, severity }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <MuiAlert elevation={6} variant="filled" onClose={onClose} severity={severity}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

CustomSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']).isRequired
};

const ActionButtons = ({
  articleVisible,
  confirmAction,
  setConfirmAction,
  dialogOpen,
  setDialogOpen,
  handleDialogClose,
  openSnackbar,
  snackbarAnchor,
  handleCloseSnackbar,
  messageText,
  messageColor,
  handleReject,
  handleApprove,
  moderatorComment,
  setModeratorComment,
}) => {
  return (
    <>
      <div className="ExaminationArticle__btn">
        {articleVisible && (
          <>
            <button
              className={`ExaminationArticle__reject ${
                confirmAction === "reject" ? "confirmed" : ""
              }`}
              onClick={() => {
                setConfirmAction("reject");
                setDialogOpen(true);
              }}
            >
              Отклонить
              <img style={{ width: "25px" }} src={no} alt="" />
            </button>
            <button
              className={`ExaminationArticle__publish ${
                confirmAction === "publish" ? "confirmed" : ""
              }`}
              onClick={() => {
                setConfirmAction("publish");
                setDialogOpen(true);
              }}
            >
              Опубликовать
              <img style={{ width: "25px" }} src={ok} alt="" />
            </button>
          </>
        )}
      </div>

      <CustomSnackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={messageText}
        severity={messageColor === "red" ? "error" : "success"}
      />

      <Dialog
        open={dialogOpen}
        onClose={() => handleDialogClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {confirmAction === "reject"
            ? "Отклонить статью?"
            : "Опубликовать статью?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmAction === "reject"
              ? "Введите причину отклонения статьи:"
              : "Вы уверены, что хотите опубликовать эту статью?"}
          </DialogContentText>
          {confirmAction === "reject" && (
            <TextField
              autoFocus
              margin="dense"
              id="rejection-reason"
              label="Причина отклонения"
              type="text"
              fullWidth
              value={moderatorComment}
              onChange={(e) => setModeratorComment(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            Отмена
          </Button>
          {confirmAction === "reject" ? (
            <Button onClick={handleReject} color="primary" autoFocus>
              Подтвердить отклонение
            </Button>
          ) : (
            <Button onClick={handleApprove} color="primary" autoFocus>
              Подтвердить публикацию
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

ActionButtons.propTypes = {
  articleId: PropTypes.string.isRequired,
  articleVisible: PropTypes.bool.isRequired,
  confirmAction: PropTypes.string,
  setConfirmAction: PropTypes.func.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  setDialogOpen: PropTypes.func.isRequired,
  moderatorComment: PropTypes.string,
  setModeratorComment: PropTypes.func.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  openSnackbar: PropTypes.bool.isRequired,
  snackbarAnchor: PropTypes.object, // изменено на необязательный
  handleCloseSnackbar: PropTypes.func.isRequired,
  messageText: PropTypes.string.isRequired,
  messageColor: PropTypes.string.isRequired,
  handleReject: PropTypes.func.isRequired,
  handleApprove: PropTypes.func.isRequired,
};

export default ActionButtons;