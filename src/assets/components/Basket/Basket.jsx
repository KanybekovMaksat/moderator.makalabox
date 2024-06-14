import React, { useEffect, useState } from "react";
import $api from "../../../http"; // Ensure the path to $api is correct
import './Basket.scss';

const Basket = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(); // Default to approved status

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await $api.get('articles/moderation/all/', {
          params: { status: statusFilter }
        });
        setArticles(response.data); // Assuming response.data is an array of articles
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, [statusFilter]);

  return (
    <div className="basket-container">
      <h2>Basket</h2>

      <div className="filters">
        <label>Status:</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
          {/* Add other status options as needed */}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="article-list">
          {articles.map(article => (
            <div key={article.id} className="article">
              <h3>{article.title}</h3>
              <p>{article.subtitle}</p>
              <p>Author: {article.author.fullName}</p>
              <p>Organization: {article.organization.name}</p>
              {/* Render other article details as needed */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Basket;
