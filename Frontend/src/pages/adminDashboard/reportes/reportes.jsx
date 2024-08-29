import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import HeaderAdmin from '../../../components/HeaderAdmin';
import 'chart.js/auto';
import './reportes.css'

function Reportes() {
  const [topPosts, setTopPosts] = useState([]);
  const [postsByCategory, setPostsByCategory] = useState([]);
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    fetchTopPosts();
    fetchPostsByCategory();
    fetchTopUsers();
  }, []);

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    },
    responsive: false,
    maintainAspectRatio: false
  };
  
  
  const fetchTopPosts = async () => {
    const response = await fetch('http://localhost:3000/posts');
    const posts = await response.json();
    const sortedPosts = posts.sort((a, b) => b.likes - a.likes).slice(0, 5);
    setTopPosts(sortedPosts);
    console.log(topUsersData);

  };

  const fetchPostsByCategory = async () => {
    const response = await fetch('http://localhost:3000/posts');
    const posts = await response.json();
    const categoryCounts = posts.reduce((acc, post) => {
      acc[post.categoría] = (acc[post.categoría] || 0) + 1;
      return acc;
    }, {});
    setPostsByCategory(Object.entries(categoryCounts).map(([key, value]) => ({ category: key, count: value })));
  };

  const fetchTopUsers = async () => {
    try {
      const usersResponse = await fetch('http://localhost:3000/users');
      const usersData = await usersResponse.json();

      const postsResponse = await fetch('http://localhost:3000/posts');
      const postsData = await postsResponse.json();

      const userPostCounts = postsData.reduce((acc, post) => {
        acc[post.códigousuario] = (acc[post.códigousuario] || 0) + 1;
        return acc;
      }, {});

      const usersWithPostCounts = usersData.map(user => ({
        username: user.username,
        posts: userPostCounts[user.id] || 0
      })).sort((a, b) => b.posts - a.posts).slice(0, 10);

      console.log("Top Users Data:", usersWithPostCounts);
      setTopUsers(usersWithPostCounts);
    } catch (error) {
      console.error('Error fetching data for top users:', error);
    }
  };

  const pieOptions = {
    responsive: false,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const topPostsData = {
    labels: topPosts.map(post => `ID ${post.id}`), // Usando el ID y el título del post
    datasets: [{
      data: topPosts.map(post => post.likes),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#E7E9ED', '#4BC0C0'],
    }]
  };

  const postsByCategoryData = {
    labels: postsByCategory.map(post => post.category),
    datasets: [{
      data: postsByCategory.map(post => post.count),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#E7E9ED'],
    }]
  };

  const topUsersData = {
    labels: topUsers.map(user => user.username),
    datasets: [{
        label: 'Número de Publicaciones',
        data: topUsers.map(user => user.posts), 
        backgroundColor: 'rgba(54, 162, 235, 0.2)', 
        borderColor: 'rgba(54, 162, 235, 1)', 
        borderWidth: 1
    }]
};

  return (
    <div className="report-container">
  <HeaderAdmin />
  <h1>Reportes de USocial</h1>
  <div className="charts-container">
    <div className="chart-box">
      <div className="chart-title">Top 5 Posts con más Likes</div>
      <Pie data={topPostsData} options={pieOptions} />
    </div>
    <div className="chart-box">
      <div className="chart-title">Posts por Categoría</div>
      <Pie data={postsByCategoryData} options={pieOptions} />
    </div>
    <div className="chart-box">
      <div className="chart-title">Top 10 Usuarios con más Publicaciones</div>
      <Bar data={topUsersData} options={barOptions} />
    </div>
  </div>
</div>
  );
}

export default Reportes;
