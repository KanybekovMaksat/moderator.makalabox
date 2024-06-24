import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  DialogTitle,
  DialogContent,
  Divider,
  Typography,
  Drawer,
  ModalClose,
  Stack,
  Checkbox,
  Sheet,
  Snackbar,
} from "@mui/joy";
import MuiAlert from "@mui/material/Alert";
import TuneIcon from "@mui/icons-material/TuneRounded";
import CheckIcon from "@mui/icons-material/CheckCircleOutlineRounded"; // Import the check icon
import $api from "../../../http";
import iconDesign from "../../images/web-design.png";
import iconMarketing from "../../images/marketing.png";
import iconLeader from "../../images/leader.png";
import iconProgramming from "../../images/programming.png";
import iconDevelopYourself from "../../images/developYourself.png";
import iconSport from "../../images/sport.png";
import iconArchitecture from "../../images/architecture.png";
import iconHistory from "../../images/history.png";

const icons = [
  iconArchitecture,
  iconDesign,
  iconHistory,
  iconMarketing,
  iconLeader,
  iconProgramming,
  iconDevelopYourself,
  iconSport,
];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function DrawerFilters({
  onCategoryChange,
  onSubCategoryChange,
  onOrganizationChange,
  onSubOrganizationChange,
}) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [categories, setCategories] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [selectedOrganizationSubcategories,setSelectedOrganizationSubcategories] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await $api.get("articles/categories/");
        console.log("Полученные категории:", response.data);
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
        console.log("Получение организации:", response.data);
        setOrganizations(response.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchOrganizations();
  }, []);

  const handleCardsClick = (itemName) => {
    setSelectedCategory((prevSelectedCategory) => {
      if (prevSelectedCategory.includes(itemName)) {
        return prevSelectedCategory.filter((item) => item !== itemName);
      } else {
        return [...prevSelectedCategory, itemName];
      }
    });
  };

  const handleCardClick = (itemName) => {
    if (selectedOrganization && selectedOrganization !== itemName) {
      setSnackbarOpen(true);
    } else {
      setSelectedOrganization((prevSelectedOrganization) =>
        prevSelectedOrganization === itemName ? null : itemName
      );
    }
  };

  const handleSubcategoryClick = (categoryName, subcategoryName) => {
    setSelectedSubcategories((prev) => {
      const categorySubcategories = prev[categoryName] || [];
      if (categorySubcategories.includes(subcategoryName)) {
        return {
          ...prev,
          [categoryName]: categorySubcategories.filter(
            (item) => item !== subcategoryName
          ),
        };
      } else {
        return {
          ...prev,
          [categoryName]: [...categorySubcategories, subcategoryName],
        };
      }
    });
  };

  const handleOrganizationSubcategoryClick = (organizationName, subcategoryName ) => {
    setSelectedOrganizationSubcategories((prev) => {
      const organizationSubcategories = prev[organizationName] || [];
      if (organizationSubcategories.includes(subcategoryName)) {
        return {
          ...prev,
          [organizationName]: organizationSubcategories.filter(
            (item) => item !== subcategoryName
          ),
        };
      } else {
        return {
          ...prev,
          [organizationName]: [...organizationSubcategories, subcategoryName],
        };
      }
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleReset = () => {
    setSelectedCategory([]);
    setSelectedOrganization(null);
    setSelectedSubcategories({});
    setSelectedOrganizationSubcategories({});
  };

  const handleSave = () => {
    if (onCategoryChange && typeof onCategoryChange === "function") {
      onCategoryChange(selectedCategory);
    }
    if (onOrganizationChange && typeof onOrganizationChange === "function") {
      onOrganizationChange(selectedOrganization ? [selectedOrganization] : []);
    }
    if (onSubCategoryChange && typeof onSubCategoryChange === "function") {
      onSubCategoryChange(selectedSubcategories);
    }
    if (
      onSubOrganizationChange &&
      typeof onSubOrganizationChange === "function"
    ) {
      onSubOrganizationChange(selectedOrganizationSubcategories);
    }
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="neutral"
        startDecorator={<TuneIcon />}
        onClick={() => setOpen(true)}
        sx={{
          background: "white",
          "@media (max-width: 608px)": {
            "& .button-text": {
              display: "none",
            },
          },
        }}
      >
        <span className="button-text">Фильтрация</span>
      </Button>
      <Drawer
        size="md"
        variant="plain"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          content: {
            sx: {
              bgcolor: "transparent",
              p: { md: 3, sm: 0 },
              boxShadow: "none",
              width: "80vw",
              maxWidth: "600px",
            },
          },
        }}
      >
        <Sheet
          sx={{
            borderRadius: "md",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            height: "100%",
            overflow: "auto",
          }}
        >
          <DialogTitle>Фильтрация</DialogTitle>
          <ModalClose />
          <Divider sx={{ mt: "auto" }} />
          <DialogContent sx={{ gap: 2 }}>
            <Typography sx={{ typography: "title-md", fontWeight: "bold" }}>
              Категории
            </Typography>
            <Stack spacing={1.5}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "16px",
                  justifyContent: "center",
                }}
              >
                {categories.map((category, index) => {
                  const icon = icons[index % icons.length];
                  const isSelected = selectedCategory.includes(category.name);
                  return (
                    <React.Fragment key={category.id}>
                      <Card
                        sx={{
                          width: "calc(40% - 8px)", // Adjust the width to fit within the flex container
                          boxShadow: "none",
                          borderRadius: 16,
                          cursor: "pointer",
                          position: "relative",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            boxShadow: "0px 0px 10px 5px #00000054",
                            transform: "scale(0.99)",
                          },
                          ...(isSelected && {
                            border: "2px solid black",
                          }),
                          "@media (max-width: 465px)": {
                            width: "300px",
                          },
                        }}
                        onClick={() => handleCardsClick(category.name)}
                      >
                        <CardContent>
                          <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            textAlign="center"
                          >
                            <img
                              src={category.photo}
                              alt={category.name}
                              style={{
                                width: 48,
                                height: 48,
                                marginBottom: 8,
                              }}
                            />
                            <Typography
                              level="title-md"
                              sx={{ wordWrap: "break-word" }}
                            >
                              {category.name}
                            </Typography>
                            {isSelected && (
                              <CheckIcon
                                sx={{
                                  position: "absolute",
                                  top: 8,
                                  right: 8,
                                  color: "green",
                                }}
                              />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                      {isSelected &&
                        category.children &&
                        category.children.length > 0 && (
                          <Box sx={{ width: "100%", paddingLeft: 2 }}>
                            <Typography
                              sx={{
                                typography: "subtitle1",
                                fontWeight: "bold",
                                marginTop: 2,
                                marginBottom: 1,
                              }}
                            >
                              Подкатегории для {category.name}
                            </Typography>
                            {category.children.map((subcategory) => {
                              const isSubcategorySelected = (
                                selectedSubcategories[category.name] || []
                              ).includes(subcategory.name);
                              return (
                                <Box
                                  key={subcategory.id}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: 1,
                                    cursor: "pointer",
                                    padding: 1,
                                    borderRadius: 8,
                                    transition:
                                      "background-color 0.2s, transform 0.2s",
                                    background: isSubcategorySelected
                                      ? "#f0f0f0"
                                      : "transparent",
                                    "&:hover": {
                                      background: "#e0e0e0",
                                      transform: "scale(0.99)",
                                    },
                                  }}
                                  onClick={() =>
                                    handleSubcategoryClick(
                                      category.name,
                                      subcategory.name
                                    )
                                  }
                                >
                                  <Checkbox checked={isSubcategorySelected} />
                                  <Typography sx={{ marginLeft: 1 }}>
                                    {subcategory.name}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        )}
                    </React.Fragment>
                  );
                })}
              </Box>
              <div
                className="line"
                style={{ width: "100%", height: "1px", background: "black" }}
              ></div>
              <Typography sx={{ typography: "title-md", fontWeight: "bold" }}>
                Организация
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "16px",
                  justifyContent: "center",
                }}
              >
                {organizations.map((organization) => {
                  const isSelected = selectedOrganization === organization.name;
                  return (
                    <React.Fragment key={organization.id}>
                      <Card
                        sx={{
                          width: "calc(40% - 8px)", // Adjust the width to fit within the flex container
                          boxShadow: "none",
                          borderRadius: 16,
                          cursor: "pointer",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            boxShadow: "0px 0px 10px 5px #00000054",
                            transform: "scale(1.05)",
                          },
                          ...(isSelected && {
                            border: "2px solid black",
                          }),
                          "@media (max-width: 465px)": {
                            width: "300px",
                          },
                        }}
                        onClick={() => handleCardClick(organization.name)}
                      >
                        <CardContent>
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            textAlign="center"
                          >
                            <img
                              src={organization.photo}
                              alt={organization.name}
                              style={{
                                width: 48,
                                height: 48,
                                marginBottom: 8,
                              }}
                            />
                            <Typography
                              level="title-md"
                              sx={{ wordWrap: "break-word" }}
                            >
                              {organization.name}
                            </Typography>
                            {isSelected && (
                              <CheckIcon
                                sx={{
                                  position: "absolute",
                                  top: 8,
                                  right: 8,
                                  color: "green",
                                }}
                              />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                      
                      {isSelected &&
                        organization.children &&
                        organization.children.length > 0 && (
                          <Box sx={{ width: "100%", paddingLeft: 2 }}>
                            <Typography
                              sx={{
                                typography: "subtitle1",
                                fontWeight: "bold",
                                marginTop: 2,
                                marginBottom: 1,
                              }}
                            >
                              Подкатегории для {organization.name}
                            </Typography>
                            {organization.children.map((subcategory) => {
                              const isSubcategorySelected = (
                                selectedOrganizationSubcategories[
                                  organization.name
                                ] || []
                              ).includes(subcategory.name);
                              return (
                                <Box
                                  key={subcategory.id}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: 1,
                                    cursor: "pointer",
                                    padding: 1,
                                    borderRadius: 8,
                                    transition:
                                      "background-color 0.2s, transform 0.2s",
                                    background: isSubcategorySelected
                                      ? "#f0f0f0"
                                      : "transparent",
                                    "&:hover": {
                                      background: "#e0e0e0",
                                      transform: "scale(0.99)",
                                    },
                                  }}
                                  onClick={() =>
                                    handleOrganizationSubcategoryClick(
                                      organization.name,
                                      subcategory.name
                                    )
                                  }
                                >
                                  <Checkbox checked={isSubcategorySelected} />
                                  <Typography sx={{ marginLeft: 1 }}>
                                    {subcategory.name}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        )}
                    </React.Fragment>
                  );
                })}
              </Box>
            </Stack>
          </DialogContent>
          <Divider sx={{ mt: "auto" }} />
          <Stack
            justifyContent="space-between"
            display="flex"
            useFlexGap
            spacing={1}
          >
            <Button onClick={handleReset}>Сбросить</Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </Stack>
        </Sheet>
      </Drawer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="warning"
          sx={{ width: "100%" }}
        >
          Можно выбрать не более одной организации!
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
