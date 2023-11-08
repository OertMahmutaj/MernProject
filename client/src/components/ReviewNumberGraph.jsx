import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { Link } from'react-router-dom'

const generateRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const alpha = 0.6; 
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const ReviewNumberGraph = () => {
  const chartRef = useRef(null);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/reviewnumbergraph')
      .then((response) => {
        setProductData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (productData.length > 0) {
      createChart();
    }
  }, [productData]);

  const createChart = () => {
    const ctx = chartRef.current.getContext('2d');
    const labels = productData.map((product) => product.name);
    const reviewNumbers = productData.map((product) => product.reviews);
    const backgroundColors = productData.map(() => generateRandomColor());

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            data: reviewNumbers,
            backgroundColor: backgroundColors,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            borderRadius: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            stepSize: 1,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Review Numbers',
            color: 'blue', 
            font: {
              size: 24,
            },
          },
        },
      },
    });
  };

  return (
    <div className="text-center">
      <div className="w-full max-w-xl mx-auto">
        <canvas ref={chartRef} width={600} height={400} />
      </div>
      <Link to="/ratinggraph" className="text-blue-700 text-2xl font-semibold">
              Product Rating
            </Link>
    </div>
  );
};

export default ReviewNumberGraph;
