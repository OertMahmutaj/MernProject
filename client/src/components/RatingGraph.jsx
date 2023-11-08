import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { Link } from 'react-router-dom'


const RatingGraph = () => {
    const chartRef = useRef(null);
    const [productData, setProductData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/ratinggraph')
            .then((response) => {
                setProductData(response.data);
                console.log(productData);
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
        const ratings = productData.map((product) => product.averageRating);

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const backgroundColor = generateRandomColors(productData.length);

        new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: ratings,
                        backgroundColor: backgroundColor,
                    },
                ],
            },
            options: {
                scale: {
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1,
                    },
                },
                elements: {
                    center: {
                        text: 'Ratings',
                        color: '#333',
                        fontStyle: 'Arial',
                        sidePadding: 20,
                    },
                },
            },
        });
    };

    const generateRandomColors = (count) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
                Math.random() * 256
            )}, ${Math.floor(Math.random() * 256)}, 0.6)`;
            colors.push(color);
        }
        return colors;
    };

    return (
        
        <div className="text-center">
            
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Product Ratings</h2>
            <div className="w-full max-w-xl mx-auto">
                <canvas ref={chartRef} width={800} height={800}></canvas>
            </div>
            <Link to="/reviewnumbergraph" className="text-blue-700 text-2xl font-semibold">
              Number of Reviews
            </Link><br />
            <Link to="/pricegraph" className="text-blue-700 text-2xl font-semibold">
              Price Graph
            </Link>
        </div>
    );
};

export default RatingGraph;
