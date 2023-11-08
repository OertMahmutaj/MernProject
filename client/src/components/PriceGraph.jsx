import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { Link } from'react-router-dom'

const PriceGraph = () => {
  const chartRef = useRef(null);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/pricegraph')
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

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
  };

  const createChart = () => {
    const ctx = chartRef.current.getContext('2d');
    const labels = productData.map((product) => product.name);
    const prices = productData.map((product) => product.price);
    const backgroundColors = labels.map(() => getRandomColor());

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: prices,
            backgroundColor: backgroundColors,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
      },
    });
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Price Graph</h2>
      <div className="w-full max-w-xl mx-auto">
        <canvas ref={chartRef} width={600} height={400} />
      </div>
      <Link to="/ratinggraph" className="text-blue-700 text-2xl font-semibold">
              Product Rating
            </Link>
    </div>
  );
};

export default PriceGraph;
