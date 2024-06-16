import React, { useState, useContext, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { Context } from "../../../main";
import { observer } from "mobx-react-lite";
import boxImage from "../../images/box.png";
import Published from "../Published/Published";
import Filter from "../Filter/Filter"; // Подставьте свой путь до компонента Filter

// Custom styled components
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  border: "1px solid black",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    border: "1px solid black"
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "black",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "black",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: "white",
  boxShadow:
    "0px 2px 4px -1px rgba(0,0,0,0.1), 0px 4px 5px 0px rgba(0,0,0,0.05), 0px 1px 10px 0px rgba(0,0,0,0.12)",
}));

const Overlay = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: alpha(theme.palette.common.black, 0.5),
  zIndex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
}));

const SearchResultsContainer = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: "white",
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  zIndex: 2,
  width: "100%",
  maxWidth: "100%",
  maxHeight: "100%",
  overflowY: "auto"
}));

// PrimarySearchAppBar component
const PrimarySearchAppBar = observer(() => {
  const { store } = useContext(Context);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    handleFilterChange(selectedCategories);
  }, [selectedCategories]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories);
  };

  const handleFilterChange = (selectedCategories) => {
    setSelectedCategories(selectedCategories);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link to={"/moderator-page"}>
        <MenuItem style={{ color: "black" }} onClick={handleMenuClose}>
          Профиль
        </MenuItem>
      </Link>
      <Link to="/login">
        <MenuItem style={{ color: "black" }} onClick={() => store.logout()}>
          Выйти
        </MenuItem>
      </Link>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Профиль</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="fixed">
        <Toolbar>
          <h2
            className="Header__h2"
            style={{
              display: "flex",
              alignItems: "center",
              columnGap: "8px",
              color: "black",
              fontSize: "28px",
              whiteSpace: "nowrap",
              marginRight: "10px",
            }}
          >
            <img
              style={{ width: "40px", marginBottom: "7px" }}
              src={boxImage}
              alt="Makala Box"
            />
            Makala Box
          </h2>
          <Box sx={{ flexGrow: 1.5 }} />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Поиск…"
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={handleSearchChange}
              color="black"
            />
          </Search>
          <IconButton
            size="small"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="black"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </StyledAppBar>
      {searchQuery && (
        <Overlay>
          <SearchResultsContainer>
            <Published
              searchQuery={searchQuery}
              selectedCategories={selectedCategories}
            />
          </SearchResultsContainer>
        </Overlay>
      )}
      <Filter onCategoryChange={handleCategoryChange} />
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
});

export default PrimarySearchAppBar;
