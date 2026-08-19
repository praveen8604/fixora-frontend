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

const Dashboard = () => {
  const { t } = useTranslation();
  const { mode } = useContext(WindmillContext);

  dayjs.extend(isBetween);
  dayjs.extend(isToday);
  dayjs.extend(isYesterday);

  // react hook
  const [dashData, setDashData] = useState("");
  const [todayCashPayment] = useState(0);
  const [todayCardPayment] = useState(0);
  const [todayCreditPayment] = useState(0);

  const { loading: loadingBestSellerProduct } = useAsync(
    OrderServices.getBestSellerProductChart,
  );

  const { data: dashboardOrderCount, loading: loadingOrderCount } = useAsync(
    OrderServices.getDashboardCount,
  );

  const { data: dashboardOrderAmount, loading: loadingOrderAmount } = useAsync(
    OrderServices.getDashboardAmount,
  );

  useEffect(() => {
    DashboardServices.getDashboardData()
      .then((res) => {
        if (res) {
          const decodedata = DecryptData(res);
          setDashData(decodedata?.data || "");
          console.log("asasas", decodedata);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [dashboardOrderAmount]);

  return (
    <>
      <AnimatedContent>
        <div className="grid gap-2 mb-4 xl:grid-cols-4 md:grid-cols-2 mt-4">
          <Link to="/users">
            <CardItemTwo
              mode={mode}
              title="Total Users"
              title2="Total Users"
              Icon={FaUser}
              price={
                dashData?.dashBoardCount?.userCount?.find(
                  (d) => d._id === "all_users",
                )?.count || 0
              }
              loading={loadingOrderAmount}
              cardBg="var(--linear-elite-color)"
              cardTextColor="text-[var(--primary-color)]"
            />
          </Link>
          <Link to="/users/customer">
            <CardItemTwo
              mode={mode}
              title="Total Customers"
              title2="Total Customers"
              Icon={FaUser}
              cash={todayCashPayment || 0}
              card={todayCardPayment || 0}
              credit={todayCreditPayment || 0}
              price={
                dashData?.dashBoardCount?.userCount?.find(
                  (d) => d._id === "customer",
                )?.count || 0
              }
              loading={loadingOrderAmount}
              cardBg="var(--linear-elite-color)"
              cardTextColor="text-[var(--primary-color)]"
            />
          </Link>
          <Link to="/users/technician">
            <CardItemTwo
              mode={mode}
              title="Total Technician"
              title2="Total Technician"
              Icon={FaTools}
              price={
                dashData?.dashBoardCount?.userCount?.find(
                  (d) => d._id === "technician",
                )?.count +
                  dashData?.dashBoardCount?.userCount.find(
                    (d) => d._id === "admin",
                  )?.count || 0
              }
              loading={loadingOrderAmount}
              cardBg="var(--linear-elite-color)"
              cardTextColor="text-[var(--primary-color)]"
            />
          </Link>
          <Link to="/users/rider">
            <CardItemTwo
              mode={mode}
              title="Total Rider"
              title2="Total Rider"
              Icon={FaMotorcycle}
              price={
                dashData?.dashBoardCount?.userCount?.find(
                  (d) => d._id === "rider",
                )?.count || 0
              }
              cardBg="var(--linear-elite-color)"
              cardTextColor="text-[var(--primary-color)]"
              loading={loadingOrderAmount}
            />
          </Link>
          <Link to="/services/servicerequests">
            <CardItemTwo
              mode={mode}
              title2="Total Services"
              Icon={FaRegChartBar}
              price={
                dashData?.dashBoardCount?.serviceRequestCount?.find(
                  (d) => d._id === "all_servicerequests",
                )?.count || 0
              }
              cardBg="var(--linear-elite-color)"
              cardTextColor="text-[var(--primary-color)]"
              loading={loadingOrderAmount}
            />
          </Link>
          <Link to="/services/servicerequests">
            <CardItemTwo
              mode={mode}
              title2="Completed Services"
              Icon={IoMdDoneAll}
              loading={loadingOrderAmount}
              price={
                dashData?.dashBoardCount?.serviceRequestCount?.find(
                  (d) => d._id === "completed",
                )?.count || 0
              }
              cardBg="var(--linear-elite-color)"
              cardTextColor="text-[var(--primary-color)]"
            />
          </Link>
          <Link to="/services/servicerequests">
            <CardItemTwo
              mode={mode}
              title2="Pending Services"
              Icon={AiOutlineExclamationCircle}
              price={
                (dashData?.dashBoardCount?.serviceRequestCount?.find(
                  (d) => d._id === "in-progress",
                )?.count || 0) +
                (dashData?.dashBoardCount?.serviceRequestCount?.find(
                  (d) => d._id === "received",
                )?.count || 0)
              }
              cardBg="var(--linear-elite-color)"
              cardTextColor="text-[var(--primary-color)]"
              loading={loadingOrderAmount}
            />
          </Link>
          <Link to="/services/servicerequests">
            <CardItemTwo
              mode={mode}
              title2="Cancelled Services"
              Icon={MdCancelPresentation}
              price={
                dashData?.dashBoardCount?.serviceRequestCount?.find(
                  (d) => d._id === "canceled",
                )?.count || 0
              }
              cardBg="var(--linear-elite-color)"
              cardTextColor="text-[var(--primary-color)]"
              loading={loadingOrderAmount}
            />
          </Link>
        </div>
        {/* 
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <CardItem
            title="Total Order"
            Icon={FiShoppingCart}
            loading={loadingOrderCount}
            quantity={dashboardOrderCount?.totalOrder || 0}
            className="text-orange-600 dark:text-orange-100 bg-orange-100 dark:bg-orange-500"
          />
          <CardItem
            title={t("OrderPending")}
            Icon={FiRefreshCw}
            loading={loadingOrderCount}
            quantity={dashboardOrderCount?.totalPendingOrder??.count || 0}
            amount={dashboardOrderCount?.totalPendingOrder?.total || 0}
            className="text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-500"
          />

          <SrChart userData={userData} getUserData={getUserData} />
        </div> */}

        <div className="grid gap-4 md:grid-cols-2 my-8">
          <div>
            <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-2 mb-4">
              <CardItem
                title={t("Closed Service Request")}
                Icon={FaCheckCircle}
                loading={loadingOrderCount}
                quantity={
                  dashData?.dashBoardCount?.serviceRequestCount?.find(
                    (d) => d._id === "closed",
                  )?.count || 0
                }
                className="text-[var(--primary-color)] bg-[var(--secondary-elite-color)] "
              />
              <CardItem
                title={t("Total Revenue")}
                Icon={FaWallet}
                loading={loadingOrderCount}
                quantity={dashboardOrderCount?.totalDeliveredOrder || 0}
                className="text-[var(--primary-color)] bg-[var(--primary-elite-color)] "
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

          <ChartCard2
            mode={mode}
            loading={loadingBestSellerProduct}
            title={t("Recent Service Requests ")}
            data={
              dashData?.dashBoardCount?.serviceRequestCount?.find(
                (d) => d._id === "all_servicerequests",
              )?.count || 0
            }
          >
            {/* <PieChart data={data} /> */}
            <SrChart recentSr={dashData?.recentServiceRequests} />
          </ChartCard2>
        </div>
      </AnimatedContent>

      {/* <PageTitle>{t("RecentOrder")}</PageTitle> */}

      {/* <Loading loading={loading} /> */}

      {/* {loadingRecentOrder ? (
        <TableLoading row={5} col={4} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>{t("InvoiceNo")}</TableCell>
                <TableCell>{t("TimeTbl")}</TableCell>
                <TableCell>{t("CustomerName")} </TableCell>
                <TableCell> {t("MethodTbl")} </TableCell>
                <TableCell> {t("AmountTbl")} </TableCell>
                <TableCell>{t("OderStatusTbl")}</TableCell>
                <TableCell>{t("ActionTbl")}</TableCell>
                <TableCell className="text-right">{t("InvoiceTbl")}</TableCell>
              </tr>
            </TableHeader>

            <OrderTable orders={dataTable} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={dashboardRecentOrder?.totalOrder}
              resultsPerPage={8}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no orders right now." />
      )
      } */}
    </>
  );
};

export default Dashboard;
