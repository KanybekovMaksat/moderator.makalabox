import React from "react";
import Box from "@mui/joy/Box";
import Drawer from "@mui/joy/Drawer";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import ModalClose from "@mui/joy/ModalClose";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import TuneIcon from "@mui/icons-material/TuneRounded";
import Stack from "@mui/joy/Stack";
import Checkbox from "@mui/joy/Checkbox";
import Sheet from "@mui/joy/Sheet";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import iconDesign from "../../images/web-design.png";
import iconMarketing from "../../images/marketing.png";
import iconLeader from "../../images/leader.png";
import iconProgramming from "../../images/programming.png";
import icondevelopYourself from "../../images/developYourself.png";
import iconSport from "../../images/sport.png";
import $api from "../../../http";

const icons = [
  iconDesign,
  iconMarketing,
  iconLeader,
  iconProgramming,
  icondevelopYourself,
  iconSport,
]; 

export default function DrawerFilters({
  onCategoryChange,
  onOrganizationChange,
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedOrganization, setSelectedOrganization] = React.useState(null);
  const [categories, setCategories] = React.useState([]);
  const [organizations, setOrganizations] = React.useState([]);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [categoryLocked, setCategoryLocked] = React.useState(false);
  const [organizationLocked, setOrganizationLocked] = React.useState(false);

  React.useEffect(() => {
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

  React.useEffect(() => {
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
    if (categoryLocked && selectedCategory !== itemName) {
      setSnackbarOpen(true);
      return;
    }
    const updatedCategory = selectedCategory === itemName ? null : itemName;
    setSelectedCategory(updatedCategory);
    setCategoryLocked(!!updatedCategory);
  };

  const handleCardClick = (itemName) => {
    if (organizationLocked && selectedOrganization !== itemName) {
      setSnackbarOpen(true);
      return;
    }
    const updatedOrganization =
      selectedOrganization === itemName ? null : itemName;
    setSelectedOrganization(updatedOrganization);
    setOrganizationLocked(!!updatedOrganization);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const getCategoryIndex = (categoryName) => {
    return selectedCategory === categoryName ? 1 : 0;
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedOrganization(null);
    setCategoryLocked(false);
    setOrganizationLocked(false);
  };

  const handleSave = () => {
    if (onCategoryChange && typeof onCategoryChange === 'function') {
      onCategoryChange(selectedCategory ? [selectedCategory] : []);
    }
    if (onOrganizationChange && typeof onOrganizationChange === 'function') {
      onOrganizationChange(selectedOrganization ? [selectedOrganization] : []);
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
          "@media (max-width: 546px)": {
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
                  justifyContent: "center", // Центрирование карточек по горизонтали
                }}
              >
                {categories.map((category, index) => {
                  const icon = icons[index % icons.length];
                  const categoryIndex = getCategoryIndex(category.name);
                  return (
                    <Card
                      key={category.id}
                      sx={{
                        width: "calc(40% - 8px)", // Adjust the width to fit within the flex container
                        boxShadow: "none",
                        borderRadius: 16,
                        cursor: "pointer", // Добавляем cursor: pointer
                        position: "relative",
                        "&:hover": {
                          boxShadow: "0px 0px 10px 5px #00000054",
                        },
                        ...(selectedCategory === category.name && {
                          border: "2px solid black",
                        }),
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
                            src={icon}
                            alt={category.name}
                            style={{
                              width: 48,
                              height: 48,
                              marginBottom: 8,
                            }}
                          />
                          {categoryIndex > 0 && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                backgroundColor: "black",
                                color: "white",
                                borderRadius: "50%",
                                width: 24,
                                height: 24,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {categoryIndex}
                            </Box>
                          )}
                          <Typography
                            level="title-md"
                            sx={{ wordWrap: "break-word" }}
                          >
                            {category.name}
                          </Typography>
                          <Checkbox
                            checked={selectedCategory === category.name}
                            sx={{ display: "none" }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
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
                  justifyContent: "center", // Центрирование карточек по горизонтали
                }}
              >
                {organizations.map((organization) => {
                  return (
                    <Card
                      key={organization.id}
                      sx={{
                        width: "calc(40% - 8px)", // Adjust the width to fit within the flex container
                        boxShadow: "none",
                        borderRadius: 16,
                        cursor: "pointer",
                        "&:hover": {
                          boxShadow: "0px 0px 10px 5px #00000054",
                        },
                        ...(selectedOrganization === organization.name && {
                          border: "2px solid black",
                        }),
                      }}
                      onClick={() => handleCardClick(organization.name)}
                    >
                      <CardContent>
                        <Box
                          pointer=""
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
                            sx={{ wordWrap: "break" }}
                          >
                            {organization.name}
                          </Typography>
                          <Checkbox
                            checked={selectedOrganization === organization.name}
                            sx={{ display: "none" }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
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
        <MuiAlert
          onClose={handleSnackbarClose}
          severity="warning"
          sx={{ width: "100%" }}
        >
          Можно выбрать не более одной категории или одной организации!
        </MuiAlert>
      </Snackbar>
    </React.Fragment>
  );
}
