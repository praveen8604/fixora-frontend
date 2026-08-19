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

  return (
    <AnimatedContent>
      <div className="pb-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mt-4 mb-6 pb-5 border-b border-[#E2E8F0]">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#50589C] mb-1.5">
              Operations
            </p>
            <h1 className="text-[22px] font-semibold text-[#211e27] leading-tight">
              Overview
            </h1>
            <p className="text-sm text-[#A3AED0] mt-1">
              Users, service volume, and request status
            </p>
          </div>
          <OverviewDate value={selectedDate} onChange={setSelectedDate} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-5 gap-x-8 mb-8">
          {[
            { label: "Users", value: getUserCount("all_users") },
            { label: "Open services", value: pendingServices },
            { label: "Completed", value: getServiceCount("completed") },
            {
              label: "Revenue",
              value: dashboardOrderCount?.totalDeliveredOrder || 0,
            },
          ].map((item, index) => (
            <div
              key={item.label}
              className={`lg:pl-6 ${
                index === 0 ? "lg:pl-0" : "lg:border-l lg:border-[#E2E8F0]"
              }`}
            >
              <p className="text-[11px] tracking-[0.14em] uppercase text-[#A3AED0] mb-1.5">
                {item.label}
              </p>
              <p className="text-2xl font-semibold tabular-nums text-[#211e27]">
                {Number(item.value || 0).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#A3AED0] mb-3">
          Directory
        </p>
        <div className="grid gap-3 mb-7 xl:grid-cols-4 md:grid-cols-2">
          <Link to="/users" className="block h-full">
            <CardItemTwo
              mode={mode}
              title="Total Users"
              title2="Total Users"
              Icon={FaUser}
              price={getUserCount("all_users")}
              loading={loadingOrderAmount}
              cardBg="var(--linear-elite-color)"
              cardTextColor="text-[var(--primary-color)]"
            />
          </Link>
          <Link to="/users/customer" className="block h-full">
            <CardItemTwo
              mode={mode}
              title="Total Customers"
              title2="Total Customers"
              Icon={FaUser}
              cash={todayCashPayment || 0}
              card={todayCardPayment || 0}
              credit={todayCreditPayment || 0}
              price={getUserCount("customer")}
              loading={loadingOrderAmount}
              cardBg="var(--linear-elite-color)"
              cardTextColor="text-[var(--primary-color)]"
            />
          </Link>
          <Link to="/users/technician" className="block h-full">
            <CardItemTwo
              mode={mode}
              title="Total Technician"
              title2="Total Technician"
              Icon={FaTools}
              price={getUserCount("technician") + getUserCount("admin") || 0}
              loading={loadingOrderAmount}
              cardBg="var(--linear-elite-color)"
              cardTextColor="text-[var(--primary-color)]"
            />
          </Link>
          <Link to="/users/rider" className="block h-full">
            <CardItemTwo
              mode={mode}
              title="Total Rider"
              title2="Total Rider"
              Icon={FaMotorcycle}
              price={getUserCount("rider")}
              cardBg="var(--linear-elite-color)"
              cardTextColor="text-[var(--primary-color)]"
              loading={loadingOrderAmount}
            />
          </Link>
        </div>

        <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#A3AED0] mb-3">
          Service pipeline
        </p>
        <div className="grid gap-3 mb-7 xl:grid-cols-4 md:grid-cols-2">
          <Link to="/services/servicerequests" className="block h-full">
            <CardItemTwo
              mode={mode}
              title2="Total Services"
              Icon={FaRegChartBar}
              price={getServiceCount("all_servicerequests")}
              cardBg="var(--linear-elite-color)"
              cardTextColor="text-[var(--primary-color)]"
              loading={loadingOrderAmount}
              accent="var(--primary-elite-color)"
            />
          </Link>
          <Link to="/services/servicerequests" className="block h-full">
            <CardItemTwo
              mode={mode}
              title2="Completed Services"
              Icon={IoMdDoneAll}
              loading={loadingOrderAmount}
              price={getServiceCount("completed")}
              cardBg="var(--linear-elite-color)"
              cardTextColor="text-[var(--primary-color)]"
              accent="var(--primary-elite-color)"
            />
          </Link>
          <Link to="/services/servicerequests" className="block h-full">
            <CardItemTwo
              mode={mode}
              title2="Pending Services"
              Icon={AiOutlineExclamationCircle}
              price={pendingServices}
              cardBg="var(--linear-elite-color)"
              cardTextColor="text-[var(--primary-color)]"
              accent="var(--primary-elite-color)"
              loading={loadingOrderAmount}
            />
          </Link>
          <Link to="/services/servicerequests" className="block h-full">
            <CardItemTwo
              mode={mode}
              title2="Cancelled Services"
              Icon={MdCancelPresentation}
              price={getServiceCount("canceled")}
              cardBg="var(--linear-elite-color)"
              cardTextColor="text-[var(--primary-color)]"
              accent="var(--primary-elite-color)"
              loading={loadingOrderAmount}
            />
          </Link>
        </div>

        <div className="grid gap-3 xl:grid-cols-5 items-stretch">
          <div className="xl:col-span-3 flex flex-col gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <CardItem
                title={t("Closed Service Request")}
                Icon={FaCheckCircle}
                loading={loadingOrderCount}
                quantity={getServiceCount("closed")}
                className="text-[var(--primary-color)] bg-[var(--secondary-elite-color)]"
              />
              <CardItem
                title={t("Total Revenue")}
                Icon={FaWallet}
                loading={loadingOrderCount}
                quantity={dashboardOrderCount?.totalDeliveredOrder || 0}
                className="text-[var(--primary-color)] bg-[var(--primary-elite-color)]"
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
