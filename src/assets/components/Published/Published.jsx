import { useEffect, useContext, useState } from "react";
import { Context } from "../../../main";
import { animateScroll as scroll } from "react-scroll";
import dayjs from "dayjs";
import user from "../../images/user (2).png";
import $api from "../../../http";
import calendar from "../../images/calendar.png";
import writer from "../../images/writer.png";
import clock from "../../images/clock.svg";
import icon from "../../images/examinationIcon.png";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Filter from "../Filter/Filter";
import "./Published.scss";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function RecipeReviewCard({ searchQuery }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOrganizations, setSelectedOrganizations] = useState([]);

  const { store } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await $api.get(`articles/moderation/`);
        const fetchedPosts = response.data.results;
        setPosts(fetchedPosts);
        localStorage.setItem("cachedPosts", JSON.stringify(fetchedPosts));
        setIsLoading(false);
      } catch (e) {
        if (e.response?.status === 401) {
          await store.checkAuth();
        } else {
          console.log(e);
          setError("Ошибка загрузки данных");
          setIsLoading(false);
        }
      }
    };

    setIsLoading(true);
    fetchPosts();
  }, [store]);

  useEffect(() => {
    let filtered = posts;

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(lowercasedQuery);
        const authorMatch = post.author.fullName
          .toLowerCase()
          .includes(lowercasedQuery);
        const orgMatch = post.organization.name
          .toLowerCase()
          .includes(lowercasedQuery);
        const categoryMatch = post.categories.some((category) =>
          category.toLowerCase().includes(lowercasedQuery)
        );

        return titleMatch || authorMatch || categoryMatch || orgMatch;
      });
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((post) =>
        post.categories.some((category) =>
          selectedCategories.includes(category)
        )
      );
    }

    // if (selectedOrganizations.length > 0) {
    //   filtered = filtered.filter((post) =>
    //     post.organization.some((org) =>
    //       selectedOrganizations.includes(org)
    //     )
    //   );
    // }

    setFilteredPosts(filtered);
  }, [searchQuery, posts, selectedCategories, selectedOrganizations]);

  const handleFilterChange = (selectedCategories, selectedOrganizations) => {
    setSelectedCategories(selectedCategories);
    setSelectedOrganizations(selectedOrganizations);
  };

  return (
    <section className="Card__section">
      <div className="Card__content">
        {!searchQuery && (
          <div className="Filter__content">
            <h2>Статьи для проверки</h2>
            <Filter onCategoryChange={handleFilterChange} />
          </div>
        )}
        <div className="flex__card">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div className="Card__block" key={index}>
                <div className="Card__info">
                  <div className="Card__author">
                    <Skeleton circle={true} width={54} height={54} />
                    <p className="Card__writer">
                      <img src={writer} alt="" style={{ width: "25px" }} />

                      <Skeleton width={100} height={20} />
                    </p>
                  </div>
                  <div className="Card__infoDate">
                    <p className="Card__date">
                      <img src={calendar} alt="" />

                      <Skeleton width={100} height={20} />
                    </p>
                    <p className="Card__clock">
                      <img src={clock} alt="" />
                      <Skeleton width={100} height={20} />
                    </p>
                  </div>
                </div>
                <h2 className="Card__title">
                  {" "}
                  <Skeleton maxwidth={750} height={35} />
                  <Skeleton maxwidth={650} height={25} />
                  <Skeleton maxwidth={650} height={25} />
                </h2>
                <div className="Card__photo">
                  <Skeleton maxwidth={800} height={268} />
                </div>
                <div className="Card__category">
                  <h4>Категории</h4>
                  <div className="Card__categories">
                    <ul>
                      {Array.from({ length: 3 }).map((_, index) => (
                        <li key={index}>
                          {" "}
                          <Skeleton width={90} height={20} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="Card__organization">
                  <h4>Организация</h4>
                  <div className="Card__org">
                    <ul>
                      <li>
                        {" "}
                        <Skeleton width={90} height={20} />{" "}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="Card__btn">
                  <Skeleton width={180} height={35}></Skeleton>
                </div>
              </div>
            ))
          ) : filteredPosts && filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <div className="Card__block" key={index}>
                <div className="Card__info">
                  <div className="Card__author">
                    <img
                      src={post.author.photo ? post.author.photo : user}
                      alt="Author Avatar"
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "50%",
                      }}
                    />
                    <p className="Card__writer">
                      <img src={writer} alt="" style={{ width: "25px" }} />
                      {post.author.fullName}
                    </p>
                  </div>
                  <div className="Card__infoDate">
                    <p className="Card__date">
                      <img src={calendar} alt="" />
                      {dayjs(post.created)
                        .locale("ru")
                        .format("DD MMM/ HH:MM/ YYYY")}
                    </p>
                    <p className="Card__clock">
                      <img src={clock} alt="" />
                      {post.readTime} мин
                    </p>
                  </div>
                </div>
                <h2 className="Card__title">{post.title}</h2>
                <p className="Card__subtitle">{post.subtitle}</p>
                <div className="Card__photo">
                  <img src={post.photo} alt="Post Photo" />
                </div>
                <div className="Card__category">
                  <h4>Категории:</h4>
                  <div className="Card__categories">
                    <ul>
                      {post.categories.map((category, index) => (
                        <li key={index}>{category}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="Card__organization">
                  <h4>Организация</h4>
                  <div className="Card__org">
                    <ul>
                      <li> {post.organization.name}</li>
                    </ul>
                  </div>
                </div>
                <div className="Card__btn">
                  <button
                    onClick={() => {
                      scroll.scrollToTop({ smooth: true });
                      navigate(`/examination/${post.id}`);
                    }}
                  >
                    <img src={icon} alt="Examination Icon" />
                    Проверить
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Нет доступных данных</p>
          )}
        </div>
      </div>
    </section>
  );
}

RecipeReviewCard.propTypes = {
  searchQuery: PropTypes.string,
};
