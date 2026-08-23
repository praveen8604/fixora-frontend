import {
  Card,
  Button,
  CardBody,
  Input,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import React from "react";
import { useTranslation } from "react-i18next";
import { FiSearch, FiRefreshCw, FiPlus } from "react-icons/fi";

// Internal imports
import CustomerTable from "@/components/customer/CustomerTable";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import CustomerServices from "@/services/CustomerServices";
import AnimatedContent from "@/components/common/AnimatedContent";

const Customers = () => {
  const { data, loading, error } = useAsync(CustomerServices.getAllCustomers);

  const {
    userRef,
    dataTable,
    serviceData,
    totalResults,
    resultsPerPage,
    setSearchUser,
    handleSubmitUser,
    handleChangePage,
  } = useFilter(data);

  const { t } = useTranslation();

  const handleResetField = () => {
    setSearchUser("");

    if (userRef.current) {
      userRef.current.value = "";
    }
  };

  return (
    <AnimatedContent>
      <div className="px-4 py-5 md:px-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Customers
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage and monitor all customers from one place.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white rounded-lg shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md bg-[var(--primary-color)]"
          >
            <FiPlus size={18} />
            Add Customer
          </button>
        </div>

        {/* Search / Filter */}
        <Card className="mb-6 min-w-0 overflow-hidden border border-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <CardBody className="p-5">
            <form
              onSubmit={handleSubmitUser}
              className="flex flex-col gap-4 lg:flex-row lg:items-center"
            >
              {/* Search */}
              <div className="relative flex-1">
                <FiSearch
                  size={18}
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400"
                />

                <Input
                  ref={userRef}
                  type="search"
                  name="search"
                  placeholder={
                    t("CustomersPageSearchPlaceholder") || "Search customers..."
                  }
                  className="h-12 pl-11 rounded-lg"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 lg:w-auto">
                <Button
                  type="submit"
                  className="h-12 px-6 text-white rounded-lg bg-[var(--primary-color)] hover:opacity-90"
                >
                  <FiSearch className="mr-2" size={16} />
                  Search
                </Button>

                <Button
                  layout="outline"
                  onClick={handleResetField}
                  type="button"
                  className="h-12 px-5 rounded-lg"
                >
                  <FiRefreshCw className="mr-2" size={16} />
                  Reset
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Customer Table */}
        <Card className="min-w-0 overflow-hidden border border-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {loading ? (
            <TableLoading row={10} col={6} width={190} height={20} />
          ) : error ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-red-500">
                Unable to load customers. Please try again.
              </p>
            </div>
          ) : serviceData?.length > 0 ? (
            <>
              <TableContainer className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <TableCell className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-200">
                        {t("CustomersId")}
                      </TableCell>

                      <TableCell className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-200">
                        {t("CustomersJoiningDate")}
                      </TableCell>

                      <TableCell className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-200">
                        {t("CustomersName")}
                      </TableCell>

                      <TableCell className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-200">
                        {t("CustomersEmail")}
                      </TableCell>

                      <TableCell className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-200">
                        {t("CustomersPhone")}
                      </TableCell>

                      <TableCell className="text-right text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-200">
                        {t("CustomersActions")}
                      </TableCell>
                    </tr>
                  </TableHeader>

                  <CustomerTable customers={dataTable} />
                </Table>
              </TableContainer>

              {/* Pagination */}
              <TableFooter className="border-t border-gray-100 dark:border-gray-700">
                <Pagination
                  totalResults={totalResults}
                  resultsPerPage={resultsPerPage}
                  onChange={handleChangePage}
                  label="Table navigation"
                />
              </TableFooter>
            </>
          ) : (
            <div className="py-10">
              <NotFound title="Sorry, there are no customers right now." />
            </div>
          )}
        </Card>
      </div>
    </AnimatedContent>
  );
};

export default Customers;
