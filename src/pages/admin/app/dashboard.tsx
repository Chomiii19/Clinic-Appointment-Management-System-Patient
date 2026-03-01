import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import {
  AppointmentCountLineGraph,
  ServicesUsedBarGraph,
  TodayAppointmentDoughnutGraph,
} from "../../../components/admin/Graphs";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Menu, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import type { IDoctor, IService } from "../../../@types/interface";
import { BACKEND_DOMAIN } from "../../../configs/config";
import dayjs from "dayjs";
import formatPrice from "../../../utils/formatPrice";

function Dashboard() {
  const [openSidebar, setOpenSidebar] = useState(
    () =>
      window.innerWidth >= 1024 &&
      localStorage.getItem("sidebarOpen") === "true",
  );

  return (
    <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3">
      <Sidebar
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
        page="dashboard"
      />

      <div className="w-full h-full flex flex-col gap-4 lg:ml-58 p-5 pb-0">
        <div className="flex items-center gap-1 w-full">
          <Menu
            onClick={() => setOpenSidebar(true)}
            className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
          />
          <Header headline="Dashboard" />
        </div>
        <div className="flex flex-col lg:flex-row gap-3 overflow-y-auto no-scrollbar h-auto">
          <div className="flex flex-col gap-3 w-full lg:w-2/3">
            <Overview />
            <AppointmentsOverview />
            <ServicesAvailed />
          </div>
          <div className="w-full lg:w-1/3 gap-3 flex flex-col h-full mb-5">
            <Services />
            <Doctors />
          </div>
        </div>
      </div>
    </main>
  );
}

function Overview() {
  const [filter, setFilter] = useState("W");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loadingTodaySummary, setLoadingTodaySummary] = useState(false);
  const [loadingOverview, setLoadingOverview] = useState(false);

  const [todayCompletedCount, setTodayCompletedCount] = useState(0);
  const [todayOngoingCount, setTodayOngoingCount] = useState(0);
  const [todayCancelledCount, setTodayCancelledCount] = useState(0);

  const [totalCurrent, setTotalCurrent] = useState(0);
  const [totalPrevious, setTotalPrevious] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const [totalCurrentCompleted, setTotalCurrentCompleted] = useState(0);
  const [totalPreviousCompleted, setTotalPreviousCompleted] = useState(0);
  const [percentageCompleted, setPercentageCompleted] = useState(0);

  const fetchTodayAppointmentSummary = async () => {
    try {
      setLoadingTodaySummary(true);
      const response = await axios.get(
        `${BACKEND_DOMAIN}/api/v1/appointments/counts/today`,
        { withCredentials: true },
      );
      setTodayCompletedCount(response.data.completedCount);
      setTodayOngoingCount(response.data.ongoingCount);
      setTodayCancelledCount(response.data.cancelledCount);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setLoadingTodaySummary(false);
    }
  };

  const getFilterDate = () =>
    filter === "W" ? "week" : filter === "M" ? "month" : "year";

  const fetchPatientOverview = async () => {
    try {
      setLoadingOverview(true);
      const url =
        filter === "C"
          ? `${BACKEND_DOMAIN}/api/v1/users/counts/range?from=${from}&to=${to}`
          : `${BACKEND_DOMAIN}/api/v1/users/counts/${getFilterDate()}`;
      const response = await axios.get(url, { withCredentials: true });
      setTotalCurrent(response.data.totalCurrent);
      setTotalPrevious(response.data.totalPrevious);
      setPercentage(response.data.percentage);
    } catch (error) {
      console.error("Failed to fetch patient overview", error);
    } finally {
      setLoadingOverview(false);
    }
  };

  const fetchCompletedAppointmentsOverview = async () => {
    try {
      setLoadingOverview(true);
      const url =
        filter === "C"
          ? `${BACKEND_DOMAIN}/api/v1/appointments/completed/range?from=${from}&to=${to}`
          : `${BACKEND_DOMAIN}/api/v1/appointments/completed/${getFilterDate()}`;
      const response = await axios.get(url, { withCredentials: true });
      setTotalCurrentCompleted(response.data.totalCurrent);
      setTotalPreviousCompleted(response.data.totalPrevious);
      setPercentageCompleted(response.data.percentage);
    } catch (error) {
      console.error("Failed to fetch completed appointments", error);
    } finally {
      setLoadingOverview(false);
    }
  };

  useEffect(() => {
    if (filter === "C" && (!from || !to)) return;
    fetchPatientOverview();
    fetchCompletedAppointmentsOverview();
  }, [filter, from, to]);

  useEffect(() => {
    fetchTodayAppointmentSummary();
  }, []);

  const periodLabel =
    filter === "W"
      ? "last week"
      : filter === "M"
        ? "last month"
        : filter === "Y"
          ? "last year"
          : `${from} – ${to}`;

  return (
    <div className="w-full flex flex-col lg:flex-row gap-3">
      <section className="bg-system-white dark:bg-system-black rounded-2xl w-full lg:w-auto h-full p-3 flex flex-col shadow-sm">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Today's Appointments</h2>
          <button
            title="Refresh"
            onClick={fetchTodayAppointmentSummary}
            disabled={loadingTodaySummary}
          >
            <RefreshCcw
              className={`w-5 cursor-pointer transition-colors duration-150 ease-in-out text-zinc-400 hover:text-zinc-700 ${loadingTodaySummary ? "animate-spin text-primary" : ""}`}
            />
          </button>
        </header>
        <TodayAppointmentDoughnutGraph
          todayCompletedCount={todayCompletedCount}
          todayOngoingCount={todayOngoingCount}
        />
        <p className="text-sm text-zinc-500">
          Cancelled: {todayCancelledCount}
        </p>
      </section>

      <section className="bg-system-white dark:bg-system-black rounded-2xl w-full h-full p-3 flex flex-col shadow-sm">
        <header className="flex items-center justify-between w-full mb-1.5 flex-wrap gap-2">
          <h2 className="text-lg font-bold">Overview</h2>
          <aside className="flex items-center gap-3">
            <button
              title="Refresh"
              onClick={() => {
                fetchPatientOverview();
                fetchCompletedAppointmentsOverview();
              }}
              disabled={loadingOverview}
            >
              <RefreshCcw
                className={`w-5 cursor-pointer transition-colors duration-150 ease-in-out text-zinc-400 hover:text-zinc-700 ${loadingOverview ? "animate-spin text-primary" : ""}`}
              />
            </button>
            <FilterButton
              filter={filter}
              setFilter={setFilter}
              from={from}
              to={to}
              setFrom={setFrom}
              setTo={setTo}
            />
          </aside>
        </header>

        <div className="flex items-center justify-between w-full h-full gap-3 bg-[#F6F6F6] dark:bg-off-black p-1.5 rounded-4xl shadow-[inset_0_1px_4px_rgba(0,0,0,0.12)]">
          <section className="bg-system-white dark:bg-system-black rounded-3xl w-full h-full p-3 flex flex-col justify-center items-center shadow-sm">
            <header className="flex items-center gap-2 font-bold text-zinc-600 mb-1">
              <h3>Patients</h3>
            </header>
            <div className="flex flex-col lg:flex-row items-center lg:gap-3.5">
              <b
                title={`${formatPrice(totalCurrent)}`}
                className="text-5xl text-zinc-950 dark:text-zinc-50"
              >
                {totalCurrent.toLocaleString()}
              </b>
              <div className="flex flex-col gap-0.5 items-center">
                <span
                  title={`${periodLabel}: ${totalPrevious}`}
                  className={`font-medium border rounded-lg flex items-center w-fit px-2 text-sm ${
                    totalCurrent > totalPrevious
                      ? "text-green-500 border-green-500 bg-green-500/20"
                      : "text-orange-500 border-orange-500 bg-orange-500/20"
                  }`}
                >
                  {totalCurrent > totalPrevious ? (
                    <ArrowUp className="w-4" />
                  ) : (
                    <ArrowDown className="w-4" />
                  )}
                  {percentage}%
                </span>
                <p className="text-xs text-zinc-500">vs {periodLabel}</p>
              </div>
            </div>
          </section>

          <section className="w-full h-full flex justify-center items-center flex-col">
            <header className="flex items-center gap-2 font-bold text-zinc-600 mb-1">
              <h3 className="text-center">Completed Appointments</h3>
            </header>
            <div className="flex flex-col lg:flex-row items-center lg:gap-3.5">
              <b
                title={`${formatPrice(totalCurrentCompleted)}`}
                className="text-5xl text-zinc-950 dark:text-zinc-50"
              >
                {totalCurrentCompleted.toLocaleString()}
              </b>
              <div className="flex flex-col gap-0.5 items-center">
                <span
                  title={`${periodLabel}: ${totalPreviousCompleted}`}
                  className={`font-medium border rounded-lg flex items-center w-fit px-2 text-sm ${
                    totalCurrentCompleted > totalPreviousCompleted
                      ? "text-green-500 border-green-500 bg-green-500/20"
                      : "text-orange-500 border-orange-500 bg-orange-500/20"
                  }`}
                >
                  {totalCurrentCompleted > totalPreviousCompleted ? (
                    <ArrowUp className="w-4" />
                  ) : (
                    <ArrowDown className="w-4" />
                  )}
                  {percentageCompleted}%
                </span>
                <p className="text-xs text-zinc-500">vs {periodLabel}</p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function AppointmentsOverview() {
  const [filter, setFilter] = useState("W");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [cancelledData, setCancelledData] = useState([]);

  const getFilterDate = () =>
    filter === "W" ? "week" : filter === "M" ? "month" : "year";

  const fetchAppointmentTrends = async () => {
    try {
      setLoading(true);
      const url =
        filter === "C"
          ? `${BACKEND_DOMAIN}/api/v1/appointments/counts/range?from=${from}&to=${to}`
          : `${BACKEND_DOMAIN}/api/v1/appointments/counts/${getFilterDate()}`;
      const response = await axios.get(url, { withCredentials: true });
      setLabels(response.data.labels);
      setCompletedData(response.data.completed);
      setCancelledData(response.data.cancelled);
    } catch (error) {
      console.error("Failed to fetch appointments report", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filter === "C" && (!from || !to)) return;
    fetchAppointmentTrends();
  }, [filter, from, to]);

  return (
    <section className="bg-system-white dark:bg-system-black rounded-2xl w-full p-3 flex flex-col shadow-sm">
      <header className="flex items-center justify-between w-full flex-wrap gap-2">
        <h2 className="text-lg font-bold">Appointment Status Trends</h2>
        <aside className="flex items-center gap-3">
          <button
            title="Refresh"
            onClick={fetchAppointmentTrends}
            disabled={loading}
          >
            <RefreshCcw
              className={`w-5 cursor-pointer transition-colors duration-150 ease-in-out text-zinc-400 hover:text-zinc-700 ${loading ? "animate-spin text-primary" : ""}`}
            />
          </button>
          <FilterButton
            filter={filter}
            setFilter={setFilter}
            from={from}
            to={to}
            setFrom={setFrom}
            setTo={setTo}
          />
        </aside>
      </header>
      <AppointmentCountLineGraph
        labels={labels}
        completedData={completedData}
        cancelledData={cancelledData}
      />
    </section>
  );
}

function ServicesAvailed() {
  const [filter, setFilter] = useState("W");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState([]);
  const [counts, setCounts] = useState([]);
  const [totalCurrent, setTotalCurrent] = useState(0);
  const [totalPrevious, setTotalPrevious] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const getFilterDate = () =>
    filter === "W" ? "week" : filter === "M" ? "month" : "year";

  const fetchServicesReport = async () => {
    try {
      setLoading(true);
      const url =
        filter === "C"
          ? `${BACKEND_DOMAIN}/api/v1/services/counts/range?from=${from}&to=${to}`
          : `${BACKEND_DOMAIN}/api/v1/services/counts/${getFilterDate()}`;
      const response = await axios.get(url, { withCredentials: true });
      setLabels(response.data.labels);
      setCounts(response.data.counts);
      setTotalCurrent(response.data.totalCurrent);
      setTotalPrevious(response.data.totalPrevious);

      if (response.data.totalPrevious === 0) setPercentage(100);
      else {
        const percentChange =
          ((response.data.totalCurrent - response.data.totalPrevious) /
            response.data.totalPrevious) *
          100;
        setPercentage(Number(percentChange.toFixed(1)));
      }
    } catch (error) {
      console.error("Failed to fetch services report", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filter === "C" && (!from || !to)) return;
    fetchServicesReport();
  }, [filter, from, to]);

  const periodLabel =
    filter === "W"
      ? "last week"
      : filter === "M"
        ? "last month"
        : filter === "Y"
          ? "last year"
          : `${from} – ${to}`;

  return (
    <section className="bg-system-white dark:bg-system-black rounded-2xl w-full p-3 flex flex-col shadow-sm">
      <header className="flex items-center justify-between w-full mb-1 flex-wrap gap-2">
        <h2 className="text-lg font-bold">Services Availed Report</h2>
        <aside className="flex items-center gap-3">
          <button
            title="Refresh"
            onClick={fetchServicesReport}
            disabled={loading}
          >
            <RefreshCcw
              className={`w-5 cursor-pointer transition-colors duration-150 ease-in-out text-zinc-400 hover:text-zinc-700 ${loading ? "animate-spin text-primary" : ""}`}
            />
          </button>
          <FilterButton
            filter={filter}
            setFilter={setFilter}
            from={from}
            to={to}
            setFrom={setFrom}
            setTo={setTo}
          />
        </aside>
      </header>
      <div className="w-full flex flex-col lg:flex-row gap-2 items-center overflow-x-auto">
        <div className="flex flex-row lg:flex-col gap-2 lg:gap-0">
          <b
            title={`₱${totalCurrent.toLocaleString()}`}
            className="text-4xl lg:text-7xl text-zinc-950 dark:text-zinc-50"
          >
            <span className="text-zinc-700 dark:text-zinc-400 text-2xl lg:text-5xl">
              ₱
            </span>
            {formatPrice(totalCurrent)}
          </b>
          <div className="flex gap-1.5 items-center">
            <span
              title={`${periodLabel}: ${totalPrevious}`}
              className={`font-medium bg-green-500/20 border border-green-500 rounded-lg flex items-center w-fit px-2 text-xs lg:text-sm ${
                totalCurrent > totalPrevious
                  ? "text-green-500 border-green-500 bg-green-500/20"
                  : "text-orange-500 border-orange-500 bg-orange-500/20"
              }`}
            >
              {totalCurrent > totalPrevious ? (
                <ArrowUp className="w-3 lg:w-4" />
              ) : (
                <ArrowDown className="w-3 lg:w-4" />
              )}
              {percentage}%
            </span>
            <p className="text-xs text-zinc-500">vs {periodLabel}</p>
          </div>
        </div>
        <ServicesUsedBarGraph labels={labels} counts={counts} />
      </div>
    </section>
  );
}

function Services() {
  const [services, setServices] = useState<IService[]>([]);

  useEffect(() => {
    const fetchTopServices = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_DOMAIN}/api/v1/services/reports/top`,
          {
            withCredentials: true,
          },
        );

        setServices(response.data.data);
      } catch (error) {
        console.error("Failed to fetch services report", error);
      }
    };

    fetchTopServices();
  }, []);

  return (
    <section className="bg-system-white dark:bg-system-black rounded-2xl w-full p-3 flex flex-col shadow-sm">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Popular Services</h2>
        <Link
          to="/services"
          className="text-sm px-2 py-0.5 border border-zinc-400 text-zinc-500 rounded-lg"
        >
          View All
        </Link>
      </header>

      <ul className="flex flex-col gap-3 mt-3.5">
        {services.map((service, i) => (
          <li key={i} className="flex items-center justify-between ">
            <div className="flex gap-3">
              <img
                src="/assets/images/consultation.jpg"
                alt="consultation"
                className="w-14 h-14 rounded-xl border border-zinc-300"
              />
              <aside>
                <h3 className="font-bold">{service.name}</h3>
                <p
                  className={`text-xs px-1.5 py-0.5 border w-fit rounded-lg ${
                    service.status === "Available"
                      ? "text-green-500 border-green-500 bg-green-200/30"
                      : "text-orange-500 border-orange-500 bg-orange-200/30"
                  }`}
                >
                  {service.status}
                </p>
              </aside>
            </div>

            <p>₱{service.price}.00</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Doctors() {
  const [data, setData] = useState<IDoctor[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND_DOMAIN}/api/v1/doctors`, {
          withCredentials: true,
        });
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="bg-system-white dark:bg-system-black rounded-2xl w-full p-3 flex flex-col shadow-sm">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Doctors</h2>
        <Link
          to="/doctors"
          className="text-sm px-2 py-0.5 border border-zinc-400 text-zinc-500 rounded-lg"
        >
          View All
        </Link>
      </header>

      <ul className="flex flex-col gap-3 mt-3.5">
        {data.slice(0, 6).map((doctor, i) => (
          <li key={i} className="flex items-center justify-between ">
            <div className="flex gap-3">
              <img
                src="/assets/images/profile-doctor.jpg"
                alt="consultation"
                className="w-14 h-14 rounded-xl border border-zinc-300"
              />
              <aside>
                <h3 className="font-bold">
                  {doctor.firstname} {doctor.middlename} {doctor.surname}
                </h3>
                <p className="text-blue-500 text-xs px-1.5 py-0.5 bg-blue-200/30 border border-blue-500 w-fit rounded-lg">
                  {doctor.specialization}
                </p>
              </aside>
            </div>

            <p className="whitespace-normal text-sm w-16">
              {dayjs(doctor.schedule).format("MM/DD/YY, hh:mm:ss")}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FilterButton({
  filter,
  setFilter,
  from,
  to,
  setFrom,
  setTo,
}: {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  from: string;
  to: string;
  setFrom: React.Dispatch<React.SetStateAction<string>>;
  setTo: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-1 bg-[#F6F6F6] dark:bg-off-black p-0.5 text-sm rounded-lg text-zinc-400 shadow-[inset_0_1px_4px_rgba(0,0,0,0.12)]">
        <button
          title="Weekly"
          onClick={() => setFilter("W")}
          className={`px-2.5 py-1 rounded-lg cursor-pointer text-xs ${filter === "W" ? "bg-system-white dark:bg-system-black text-zinc-950 dark:text-zinc-50 shadow-sm" : ""}`}
        >
          W
        </button>
        <button
          title="Monthly"
          onClick={() => setFilter("M")}
          className={`px-2.5 py-1 rounded-lg cursor-pointer text-xs ${filter === "M" ? "bg-system-white dark:bg-system-black text-zinc-950 dark:text-zinc-50 shadow-sm" : ""}`}
        >
          M
        </button>
        <button
          title="Yearly"
          onClick={() => setFilter("Y")}
          className={`px-2.5 py-1 rounded-lg cursor-pointer text-xs ${filter === "Y" ? "bg-system-white dark:bg-system-black text-zinc-950 dark:text-zinc-50 shadow-sm" : ""}`}
        >
          Y
        </button>
        <button
          title="Custom range"
          onClick={() => setFilter("C")}
          className={`px-2.5 py-1 rounded-lg cursor-pointer text-xs ${filter === "C" ? "bg-system-white dark:bg-system-black text-zinc-950 dark:text-zinc-50 shadow-sm" : ""}`}
        >
          Custom
        </button>
      </div>

      {filter === "C" && (
        <div className="flex items-center gap-1.5 text-xs">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-1.5 py-0.5 bg-system-white dark:bg-system-black text-zinc-700 dark:text-zinc-300 w-32"
          />
          <span className="text-zinc-400">–</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-1.5 py-0.5 bg-system-white dark:bg-system-black text-zinc-700 dark:text-zinc-300 w-32"
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
