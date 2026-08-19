import { WindmillContext } from "@windmill/react-ui";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegChartBar } from "react-icons/fa";
import { IoMdDoneAll } from "react-icons/io";
import useAsync from "@/hooks/useAsync";
import LineChart from "@/components/chart/LineChart/LineChart";
import CardItem from "@/components/dashboard/CardItem";
import CardItemTwo from "@/components/dashboard/CardItemTwo";
import ChartCard from "@/components/chart/ChartCard";
import ChartCard2 from "@/components/chart/ChartCard2";
import OrderServices from "@/services/OrderServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import { MdCancelPresentation } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { FaMotorcycle } from "react-icons/fa";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FaCheckCircle, FaWallet } from "react-icons/fa";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import { Link } from "react-router-dom";
import SrChart from "@/components/chart/SrChart";
import OverviewDate from "@/components/dashboard/OverviewDate";

const Dashboard = () => {
  const { t } = useTranslation();
  const { mode } = useContext(WindmillContext);

  dayjs.extend(isBetween);
  dayjs.extend(isToday);
  dayjs.extend(isYesterday);

  const [dashData, setDashData] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [todayCashPayment] = useState(0);
  const [todayCardPayment] = useState(0);
  const [todayCreditPayment] = useState(0);

  const { loading: loadingBestSellerProduct } = useAsync(
    OrderServices.getBestSellerProductChart
  );

  const { data: dashboardOrderCount, loading: loadingOrderCount } = useAsync(
    OrderServices.getDashboardCount
  );

  const { data: dashboardOrderAmount, loading: loadingOrderAmount } = useAsync(
    OrderServices.getDashboardAmount
  );

  useEffect(() => {
    DashboardServices.getDashboardData()
      .then((res) => {
        if (res) {
          const decodedata = DecryptData(res);
          setDashData(decodedata.data);
          console.log("asasas", decodedata);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [dashboardOrderAmount]);

  const getUserCount = (id) =>
    dashData?.dashBoardCount?.userCount?.find((d) => d._id === id)?.count || 0;

  const getServiceCount = (id) =>
    dashData?.dashBoardCount?.serviceRequestCount?.find((d) => d._id === id)
      ?.count || 0;

  const pendingServices =
    getServiceCount("in-progress") + getServiceCount("received");

  const hour = dayjs().hour();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const overviewMetrics = [
    {
      label: "Users",
      value: getUserCount("all_users"),
      accent: "#50589C",
      soft: "#EEF0FA",
    },
    {
      label: "Open services",
      value: pendingServices,
      accent: "#D97706",
      soft: "#FFF6E9",
    },
    {
      label: "Completed",
      value: getServiceCount("completed"),
      accent: "#0F9F6E",
      soft: "#E8F8F1",
    },
    {
      label: "Revenue",
      value: dashboardOrderCount?.totalDeliveredOrder || 0,
      accent: "#0EA5E9",
      soft: "#E8F6FE",
    },
  ];

  return (
    <AnimatedContent>
      <div className="w-full pt-6 pb-12">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between mb-8 dash-enter dash-d1">
          <div>
            <p className="flex items-center gap-2 text-[12px] font-medium text-[#50589C] mb-2">
              <span className="dash-live" />
              Live operations
            </p>
            <h1 className="text-[28px] font-semibold tracking-tight text-[#1B2559] leading-none">
              {greeting}
            </h1>
            <p className="mt-2 text-[15px] text-[#64748B]">
              Operations summary for {selectedDate.format("dddd, D MMMM")}
            </p>
          </div>
          <OverviewDate value={selectedDate} onChange={setSelectedDate} />
        </div>

        <div className="kpi-shine-card mb-8 dash-enter dash-d2">
          <div className="kpi-shine-inner dash-overview">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {overviewMetrics.map((item, index) => (
                <div
                  key={item.label}
                  className={`dash-metric-cell px-6 py-6 ${
                    index % 2 === 1 ? "border-l border-[#EEF1F6]" : ""
                  } ${
                    index > 1 ? "border-t border-[#EEF1F6] lg:border-t-0" : ""
                  } ${index === 2 ? "lg:border-l lg:border-[#EEF1F6]" : ""} ${
                    index === 3 ? "lg:border-l lg:border-[#EEF1F6]" : ""
                  }`}
                  style={{ background: item.soft }}
                >
                  <p className="flex items-center gap-2 text-[13px] text-[#64748B] mb-3">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: item.accent }}
                    />
                    {item.label}
                  </p>
                  <p
                    className="text-[32px] leading-none font-semibold tracking-tight tabular-nums"
                    style={{ color: item.accent }}
                  >
                    {Number(item.value || 0).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8 dash-enter dash-d3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-medium text-[#1B2559]">People</h2>
            <Link
              to="/users"
              className="text-[13px] text-[#50589C] hover:text-[#1B2559]"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2 dash-stagger">
            <Link to="/users" className="block h-full">
              <CardItemTwo
                mode={mode}
                title="Total Users"
                title2="Total users"
                Icon={FaUser}
                price={getUserCount("all_users")}
                loading={loadingOrderAmount}
                accent="#50589C"
                accentSoft="#EEF0FA"
              />
            </Link>
            <Link to="/users/customer" className="block h-full">
              <CardItemTwo
                mode={mode}
                title="Total Customers"
                title2="Customers"
                Icon={FaUser}
                cash={todayCashPayment || 0}
                card={todayCardPayment || 0}
                credit={todayCreditPayment || 0}
                price={getUserCount("customer")}
                loading={loadingOrderAmount}
                accent="#0EA5E9"
                accentSoft="#E8F6FE"
              />
            </Link>
            <Link to="/users/technician" className="block h-full">
              <CardItemTwo
                mode={mode}
                title="Total Technician"
                title2="Technicians"
                Icon={FaTools}
                price={getUserCount("technician") + getUserCount("admin") || 0}
                loading={loadingOrderAmount}
                accent="#7C3AED"
                accentSoft="#F3E8FF"
              />
            </Link>
            <Link to="/users/rider" className="block h-full">
              <CardItemTwo
                mode={mode}
                title="Total Rider"
                title2="Riders"
                Icon={FaMotorcycle}
                price={getUserCount("rider")}
                loading={loadingOrderAmount}
                accent="#DB2777"
                accentSoft="#FCE7F3"
              />
            </Link>
          </div>
        </div>

        <div className="mb-8 dash-enter dash-d4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-medium text-[#1B2559]">
              Service pipeline
            </h2>
            <Link
              to="/services/servicerequests"
              className="text-[13px] text-[#50589C] hover:text-[#1B2559]"
            >
              View requests
            </Link>
          </div>
          <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2 dash-stagger">
            <Link to="/services/servicerequests" className="block h-full">
              <CardItemTwo
                mode={mode}
                title2="All services"
                Icon={FaRegChartBar}
                price={getServiceCount("all_servicerequests")}
                loading={loadingOrderAmount}
                accent="#50589C"
                accentSoft="#EEF0FA"
              />
            </Link>
            <Link to="/services/servicerequests" className="block h-full">
              <CardItemTwo
                mode={mode}
                title2="Completed"
                Icon={IoMdDoneAll}
                loading={loadingOrderAmount}
                price={getServiceCount("completed")}
                accent="#0F9F6E"
                accentSoft="#E8F8F1"
              />
            </Link>
            <Link to="/services/servicerequests" className="block h-full">
              <CardItemTwo
                mode={mode}
                title2="Pending"
                Icon={AiOutlineExclamationCircle}
                price={pendingServices}
                loading={loadingOrderAmount}
                accent="#D97706"
                accentSoft="#FFF6E9"
              />
            </Link>
            <Link to="/services/servicerequests" className="block h-full">
              <CardItemTwo
                mode={mode}
                title2="Cancelled"
                Icon={MdCancelPresentation}
                price={getServiceCount("canceled")}
                loading={loadingOrderAmount}
                accent="#E11D48"
                accentSoft="#FFE4E8"
              />
            </Link>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-5 items-stretch dash-enter dash-d5">
          <div className="xl:col-span-3 flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <CardItem
                title={t("Closed Service Request")}
                Icon={FaCheckCircle}
                loading={loadingOrderCount}
                quantity={getServiceCount("closed")}
                className="text-[#0F9F6E] bg-[#E8F8F1]"
              />
              <CardItem
                title={t("Total Revenue")}
                Icon={FaWallet}
                loading={loadingOrderCount}
                quantity={dashboardOrderCount?.totalDeliveredOrder || 0}
                className="text-[#0EA5E9] bg-[#E8F6FE]"
              />
            </div>

            <ChartCard
              mode={mode}
              loading={loadingOrderAmount}
              title={t("Service Requests ")}
            >
              <LineChart salesReport={dashData?.formattedReport} />
            </ChartCard>
          </div>

          <div className="xl:col-span-2">
            <ChartCard2
              mode={mode}
              loading={loadingBestSellerProduct}
              title={t("Recent Service Requests ")}
              data={getServiceCount("all_servicerequests")}
            >
              <SrChart recentSr={dashData?.recentServiceRequests} />
            </ChartCard2>
          </div>
        </div>
      </div>
    </AnimatedContent>
  );
};

export default Dashboard;
