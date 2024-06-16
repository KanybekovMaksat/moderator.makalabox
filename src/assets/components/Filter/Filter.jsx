import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TuneIcon from "@mui/icons-material/TuneRounded";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { DialogTitle } from "@mui/material";
import $api from "../../../http";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CheckboxCustom = ({ checked }) => {
  return (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: 4,
        border: "1px solid #999",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        backgroundColor: checked ? "#2196f3" : "transparent",
        transition: "background-color 0.3s ease",
      }}
    >
      {checked && (
        <svg
          width="12"
          height="10"
          viewBox="0 0 12 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.556 0.982913C10.1673 0.592918 9.53469 0.592918 9.14598 0.982913L3.73399 6.39491L2.85498 5.51592C2.46597 5.12691 1.83395 5.12691 1.44494 5.51592C1.05593 5.90493 1.05593 6.53787 1.44494 6.92688L3.05998 8.54192C3.44899 8.93093 4.08198 8.93093 4.47099 8.54192L10.556 2.45691C10.945 2.0679 10.945 1.43494 10.556 0.982913Z"
            fill="white"
          />
        </svg>
      )}
    </div>
  );
};

const DrawerFilters = ({ onCategoryChange, onOrganizationChange }) => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState([]);
  const [categories, setCategories] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await $api.get("articles/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Ошибка при получении категорий:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await $api.get("articles/organizations/");
        setOrganizations(response.data);
      } catch (error) {
        console.error("Ошибка при получении организаций:", error);
      }
    };

    fetchOrganizations();
  }, []);

  const handleCategoryClick = (category) => {
    const currentIndex = selectedCategory.indexOf(category);
    const newSelected = [...selectedCategory];

    if (currentIndex === -1) {
      newSelected.push(category);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedCategory(newSelected);
  };

  const handleOrganizationClick = (organization) => {
    const currentIndex = selectedOrganization.indexOf(organization);
    const newSelected = [...selectedOrganization];

    if (currentIndex === -1) {
      newSelected.push(organization);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedOrganization(newSelected);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleReset = () => {
    setSelectedCategory([]);
    setSelectedOrganization([]);
  };

  const handleSave = () => {
    if (onCategoryChange && typeof onCategoryChange === "function") {
      onCategoryChange(selectedCategory);
    }
    if (onOrganizationChange && typeof onOrganizationChange === "function") {
      onOrganizationChange(selectedOrganization);
    }
    setOpen(false);
    setSnackbarOpen(true);
  };

  const renderCategories = (categories, nested = false) => {
    return categories.map((category) => (
      <React.Fragment key={category.id}>
        <Card
          sx={{
            width: "100%",
            borderRadius: 5,
            border: selectedCategory.includes(category)
              ? "2px solid black"
              : "1px solid #e0e0e0",
            "&:hover": {
              boxShadow: "0px 0px 10px 5px #00000054",
            },
            cursor: "pointer",
            transition: "box-shadow 0.3s ease",
            marginBottom: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 10px",
            position: "relative",
            "@media (max-width: 465px)": {
              width: "300px",
            },
          }}
          onClick={() => handleCategoryClick(category)}
        >
          <Typography variant="body1" gutterBottom>
            {category.name}
          </Typography>
          <CheckboxCustom checked={selectedCategory.includes(category)} />
        </Card>
        {selectedCategory.includes(category) && category.children && (
          <Box sx={{ pl: 2 }}>{renderCategories(category.children, true)}</Box>
        )}
      </React.Fragment>
    ));
  };

  const renderOrganizations = (organizations = []) => {
    return organizations.map((organization) => (
      <Card
        key={organization.id}
        sx={{
          cursor: "pointer",
          border: selectedOrganization.includes(organization.name)
            ? "1px solid black"
            : "1px solid #e0e0e0",
          "&:hover": {
            boxShadow: "0px 0px 10px 5px #00000054",
          },
          borderRadius: 5,
          marginBottom: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 10px",
          position: "relative",
          "@media (max-width: 465px)": {
            width: "300px",
          },
        }}
        onClick={() => handleOrganizationClick(organization.name)}
      >
        <Typography variant="body1" gutterBottom>
          {organization.name}
        </Typography>
        <CheckboxCustom
          checked={selectedOrganization.includes(organization.name)}
        />
      </Card>
    ));
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<TuneIcon />}
        onClick={() => setOpen(true)}
        sx={{ marginBottom: 2 }}
      >
        Фильтры
      </Button>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 370,
            padding: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DialogTitle>
            Фильтры
            <Button onClick={() => setOpen(false)}>
              <Typography variant="body1" color="inherit">
                Закрыть
              </Typography>
            </Button>
          </DialogTitle>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography variant="h6">Категории</Typography>
            {renderCategories(categories)}
          </Stack>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography variant="h6">Организации</Typography>
            {renderOrganizations(organizations)}
          </Stack>
          <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
            <Button onClick={handleReset}>Сбросить</Button>
            <Button variant="contained" onClick={handleSave}>
              Применить
            </Button>
          </Box>
        </Box>
      </Drawer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="info">
          Фильтры успешно применены!
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default DrawerFilters;
