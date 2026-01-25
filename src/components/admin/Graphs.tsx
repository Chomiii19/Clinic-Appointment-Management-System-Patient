import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  Chart,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import { useRef, useState, useEffect } from "react";
import { useDarkMode } from "../../hooks/useDarkMode";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

export function AppointmentCountLineGraph({
  labels,
  completedData,
  cancelledData,
}: {
  labels: string[];
  completedData: number[];
  cancelledData: number[];
}) {
  const chartRef = useRef<Chart<"line", number[], string> | null>(null);
  const [gradientCompleted, setGradientCompleted] = useState<
    string | CanvasGradient
  >();
  const [gradientCancelled, setGradientCancelled] = useState<
    string | CanvasGradient
  >();

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const ctx = chart.ctx;

    const gradient1 = ctx.createLinearGradient(0, 0, 0, chart.height);
    gradient1.addColorStop(0, "rgba(69, 141, 252, 0.5)");
    gradient1.addColorStop(1, "rgba(69, 141, 252, 0)");
    setGradientCompleted(gradient1);

    const gradient2 = ctx.createLinearGradient(0, 0, 0, chart.height);
    gradient2.addColorStop(0, "rgba(255, 87, 51, 0.5)");
    gradient2.addColorStop(1, "rgba(255, 87, 51, 0)");
    setGradientCancelled(gradient2);
  }, [labels, completedData, cancelledData]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Completed",
        data: completedData,
        borderColor: "#458dfc",
        backgroundColor: gradientCompleted,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#458dfc",
      },
      {
        label: "Cancelled",
        data: cancelledData,
        borderColor: "#FF5733",
        backgroundColor: gradientCancelled,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#FF5733",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { display: false },
        ticks: { beginAtZero: true, maxTicksLimit: 5 },
        min: 0,
      },
    },
    plugins: {
      legend: { position: "top" as const },
      title: { display: false, text: "Appointment Count" },
    },
  };

  return (
    <div className="h-64 w-full">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}

export function TodayAppointmentDoughnutGraph({
  todayCompletedCount,
  todayOngoingCount,
}: {
  todayCompletedCount: number;
  todayOngoingCount: number;
}) {
  const { darkMode } = useDarkMode();
  const total = todayCompletedCount + todayOngoingCount;
  const percentage =
    total === 0 ? 0 : Math.round((todayCompletedCount / total) * 100);
  const chartData =
    total === 0 ? [1, 0] : [todayCompletedCount, todayOngoingCount];

  const data = {
    labels: ["Completed", "Ongoing"],
    datasets: [
      {
        label: "Count",
        data: chartData,
        backgroundColor: ["#458dfc", "#FF5733"],
        hoverOffset: 4,
        borderWidth: 3,
        borderColor: darkMode ? "#272629" : "#fdfdfd",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    cutout: "80%",
  };

  return (
    <div className="w-full relative">
      <p
        className="absolute top-[60%] left-[51%] -translate-x-1/2 -translate-y-1/2
                    text-xl font-bold text-primary"
      >
        {percentage}%
      </p>
      <Doughnut data={data} options={options} />
    </div>
  );
}

export function ServicesUsedBarGraph({
  labels,
  counts,
}: {
  labels: string[];
  counts: number[];
}) {
  const data = {
    labels,
    datasets: [
      {
        label: "Count",
        data: counts,
        backgroundColor: "#D1D5DB",
        borderRadius: 10,
        hoverBackgroundColor: "#458dfc",
        borderSkipped: false,
        borderColor: "rgba(0, 0, 0, 0)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
        position: "top" as const,
      },
      title: {
        display: false,
        text: "Services Availed",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { display: true },
        border: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: { display: false },
        border: { display: false },
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Bar data={data} options={options} />
    </div>
  );
}
