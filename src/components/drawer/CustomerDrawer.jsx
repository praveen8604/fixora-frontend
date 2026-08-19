import React from "react";
import Scrollbars from "react-custom-scrollbars-2";

// Internal imports
import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import useCustomerSubmit from "@/hooks/useCustomerSubmit";
import DrawerButton from "@/components/form/button/DrawerButton";

const CustomerDrawer = ({ id }) => {
  const { register, handleSubmit, onSubmit, errors, isSubmitting } =
    useCustomerSubmit(id);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="relative px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="absolute left-0 top-0 h-full w-1 bg-[var(--primary-color)]" />

        {id ? (
          <Title
            title="Update Customer"
            description="Update your customer's necessary information from here"
          />
        ) : (
          <Title
            title="Add Customer"
            description="Add your customer's necessary information from here"
          />
        )}
      </div>

      {/* Form Content */}
      <Scrollbars
        autoHide
        className="flex-1 w-full dark:bg-gray-800 dark:text-gray-200"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col min-h-full"
        >
          <div className="px-6 py-7 pb-32">
            {/* Section Header */}
            <div className="mb-7">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                Customer Information
              </h3>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter the customer's basic information below.
              </p>
            </div>

            {/* Name */}
            <div className="mb-6">
              <LabelArea label="Name" />

              <div className="mt-2 w-full">
                <InputArea
                  required={true}
                  register={register}
                  label="Name"
                  name="name"
                  type="text"
                  placeholder="Enter customer name"
                />

                <Error errorName={errors.name} />
              </div>
            </div>

            {/* Email */}
            <div className="mb-6">
              <LabelArea label="Email" />

              <div className="mt-2 w-full">
                <InputArea
                  required={true}
                  register={register}
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter customer email"
                />

                <Error errorName={errors.email} />
              </div>
            </div>

            {/* Phone */}
            <div className="mb-6">
              <LabelArea label="Phone" />

              <div className="mt-2 w-full">
                <InputArea
                  register={register}
                  label="Phone"
                  name="phone"
                  type="text"
                  placeholder="Enter phone number"
                />

                <Error errorName={errors.phone} />
              </div>
            </div>

            {/* Address */}
            <div className="mb-6">
              <LabelArea label="Address" />

              <div className="mt-2 w-full">
                <InputArea
                  register={register}
                  label="Address"
                  name="address"
                  type="text"
                  placeholder="Enter customer address"
                />

                <Error errorName={errors.address} />
              </div>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="sticky bottom-0 z-20 px-6 py-4 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <DrawerButton
              id={id}
              title="Customer"
              isSubmitting={isSubmitting}
            />
          </div>
        </form>
      </Scrollbars>
    </div>
  );
};

export default CustomerDrawer;