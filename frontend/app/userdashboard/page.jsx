'use client';

import ecoCoin from '../../public/ecoCoin.png'

import Image from "next/image";
import React from "react";
import amazonlogo from "../../public/amazonLogo.png";
import rating1 from "../../public/rating1.png";
import rating2 from "../../public/rating2.png";
import rating3 from "../../public/rating3.png";
import rating4 from "../../public/rating4.png";
import rating5 from "../../public/rating5.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Leaf,
  Thermometer,
  BatteryCharging,
  TreeDeciduous,
  BarChart2,
  Star,
  Package,
  ShoppingCart,
  Repeat
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const EcoCard = ({ icon: Icon, title, value, className = "", imageSrc }) => (
  <div className={`flex items-center gap-4 rounded-xl p-4 shadow-sm border ${className}`}>
    <div className="p-3 rounded-full text-green-700 bg-green-100">
      {Icon ? (
        <Icon className="h-6 w-6" />
      ) : (
        imageSrc && <Image src={imageSrc} alt={title} width={70} height={70} />
      )}
    </div>
    <div className='flex justify-center items-center flex-col'>
      <h3 className="text-green-800 font-bold text-lg">{title}</h3>
      <p className="text-green-700 font-semibold text-xl">{value}</p>
    </div>
  </div>
);

const EcoRating = () => {
  const ratings = [80, 55, 90, 40, 75];
  const ratingImages = [rating1, rating2, rating3, rating4, rating5];

  return (
    <Card className="bg-white border-green-200 shadow-sm">
      <CardContent className="p-4">
        <h3 className="text-green-900 font-semibold mb-4 text-lg">Eco Purchases</h3>
        {ratings.map((percent, i) => (
          <div key={i} className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <Image src={ratingImages[i]} alt={`Rating ${i + 1}`} width={40} height={40} />
              {/* <span className="text-green-700 font-medium">Rating {i + 1}</span> */}
              <span className="ml-auto text-green-800 font-bold">{percent}%</span>
            </div>
            <div className="w-full bg-green-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};


const EventsCO2Box = () => (
  <Card className="bg-white border-green-200 shadow-sm">
    <CardContent className="p-4">
      <h3 className="text-green-900 font-semibold mb-4 text-lg">CO₂ Reduced by Events</h3>
      <div className="space-y-4 text-green-700 font-semibold">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-6 h-6 text-green-600" />
          <span>Group Order:</span>
          <span className="ml-auto text-green-800 font-bold">250 tons</span>
        </div>
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-green-600" />
          <span>Eco Packing:</span>
          <span className="ml-auto text-green-800 font-bold">100 tons</span>
        </div>
        <div className="flex items-center gap-3">
          <Repeat className="w-6 h-6 text-green-600" />
          <span>Package Return:</span>
          <span className="ml-auto text-green-800 font-bold">150 tons</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const EcoCoinsList = () => {
  const data = [
    { date: "2025-06-01", event: "Group Order", products: 3, coins: 30 },
    { date: "2025-06-02", event: "Package Return", products: 2, coins: 20 },
    { date: "2025-06-03", event: "Group Order", products: 1, coins: 10 },
    { date: "2025-06-04", event: "Eco Packing", products: 2, coins: 20 },
  ];

  return (
    <Card className="bg-white border-green-200 shadow-sm">
      <CardContent className="p-4 space-y-3">
        <h3 className="text-green-900 font-semibold text-lg">EcoCoins Earned by Event</h3>
        {data.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-green-700 text-sm">
            <span>{item.date}</span>
            <span>{item.event}</span>
            <span>× {item.products}</span>
            <span className="font-semibold text-green-900">{item.coins} ecoCoins</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const chartData = [
  { date: "May 30", co2: 120, plastic: 40 },
  { date: "May 31", co2: 180, plastic: 60 },
  { date: "June 1", co2: 140, plastic: 45 },
  { date: "June 2", co2: 200, plastic: 80 },
  { date: "June 3", co2: 160, plastic: 50 },
];

const EcoChart = () => (
  <Card className="bg-white border-green-200 shadow-sm">
    <CardContent className="p-4">
      <h3 className="text-green-900 font-semibold text-lg mb-2">CO₂ & Plastic Reduction Over Time</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
          <XAxis dataKey="date" stroke="#4b7a43" />
          <YAxis stroke="#4b7a43" />
          <Tooltip
            contentStyle={{ backgroundColor: "#f0fdf4", borderRadius: 6, border: "1px solid #4b7a43" }}
            itemStyle={{ color: "#4b7a43" }}
          />
          <Legend />
          <Line type="monotone" dataKey="co2" stroke="#82c91e" strokeWidth={2} name="CO₂ (kg)" />
          <Line type="monotone" dataKey="plastic" stroke="#a3d977" strokeWidth={2} name="Plastic (g)" />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const Page = () => {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      // background: "linear-gradient(135deg, #e6f2d6 0%, #f7f9e8 50%, #fff9e1 100%)"
    }}>
      <div className="bg-[#FFE599] px-8 py-6 flex items-center justify-between shadow-xl shadow-green-200 rounded-b-2xl z-10">
        <div className="flex items-center gap-4">
          <Image src={amazonlogo} width={120} height={40} alt="Amazon Logo" />
          <div className="flex items-center gap-2 text-green-700 font-medium text-sm bg-green-100 px-2 py-1 rounded-lg shadow-inner">
            <Leaf className="h-4 w-4 text-green-600" />
            <span>EcoMode</span>
          </div>
        </div>
        <div className="flex-grow text-center -ml-16">
          <h1 className="text-2xl md:text-3xl font-extrabold text-green-900">♻️ User-Eco-Dashboard</h1>
        </div>
        <Avatar className="h-14 w-14 border-2 border-green-600 shadow-lg shadow-green-200 mr-4">
          <AvatarFallback className="bg-white text-green-900 font-bold text-lg">AB</AvatarFallback>
        </Avatar>
      </div>

      <div className="p-6 space-y-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EcoCard
            icon={Leaf}
            title="Carbon Emission Reduced (tons)"
            value="500"
            className="bg-yellow-50 border-green-200"
          />
          <EcoCard
            icon={BarChart2}
            title="Eco Products Analytics"
            value="Insights & Trends"
            className="bg-green-50 border-green-200"
          />
          <EcoCard
   imageSrc={ecoCoin}
  title="Total EcoCoins Earned"
  value="100"
  className="bg-yellow-50 border-green-200"
/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EcoChart />
          <EcoRating />
          <EventsCO2Box />
        </div>

        <EcoCoinsList />
      </div>

      <footer className="bg-green-200 bg-opacity-30 text-green-900 text-center py-4 mt-12 z-10 rounded-t-xl shadow-inner">
        <Leaf className="inline-block h-5 w-5 mr-2 animate-pulse" />
        <span className="font-semibold">Committed to a Greener Future 🌿</span>
      </footer>
    </div>
  );
};

export default Page;
