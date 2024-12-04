import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Calendar, CalendarClock, MapPin } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import { FaCheckCircle, FaCircle, FaEnvelope, FaUser } from "react-icons/fa";
import dayjs from "dayjs";
import "react-toastify/dist/ReactToastify.css";
import BaseInputField from "@/components/molecules/formik-fields/BaseInputField";
import SelectMonth from "@/components/molecules/selects/SelectMonth";
import SelectNationality from "@/components/molecules/selects/SelectNationality";
import Dropdown from "./Dropdown";
import DatePickerModal from "@/components/molecules/dataPicker";
import { Spinner } from "../UI/Spinner";
import { notify } from "@/utils/toast";
import { Stepper, Step, StepLabel, Button } from "@mui/material";
import { useMutate } from "@/hooks/UseMutate";
import { ToastContainer } from "react-toastify";
import PickerBook from "./PickerBook";

function IntegratedBookingForm({ DetailTour, setIsThanksVisible }) {
  const { mutate, isPending } = useMutate({
    mutationKey: ["bookings"],
    endpoint: `bookings`,
    onSuccess: () => {
      setIsThanksVisible(true);
    },
    onError: (err) => {
      notify("error", err?.response?.data?.message);
    },
    fornoneata: true,
  });

  const [step, setStep] = useState(0);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rangeDays, setRangeDays] = useState(1);

  const handleDateChange = (date, days) => {
    setSelectedDate(date ? dayjs(date) : null);
    setRangeDays(days);
  };

  const handleSubmit = (values, { setSubmitting }) => {
    if (step === 0) {
      setStep(1);
      setSubmitting(false);
    } else {
      // Submit the booking data
      mutate({
        ...values,
        phone: values.phone.slice(2),
        start_at: selectedDate ? selectedDate.format("YYYY-MM-DD") : "",
      });
      setSubmitting(false);
    }
  };

  const validate = (values) => {
    const errors = {};

    if (step === 0) {
      if (!values.month) {
        errors.month = "Month is required";
      }
      if (!selectedDate) {
        errors.date = "Date is required";
      }
      if (
        values.num_of_adults +
          values.num_of_children +
          values.num_of_infants ===
        0
      ) {
        errors.travelers = "At least one traveler is required";
      }
    } else if (step === 1) {
      if (!values.name) {
        errors.name = "Name is required";
      }
      if (!values.email) {
        errors.email = "Email is required";
      }
      if (!values.nationality_id) {
        errors.nationality_id = "Nationality is required";
      }
      if (!values.phone) {
        errors.phone = "Phone number is required";
      }
    }

    return errors;
  };

  const renderStep1 = (values, setFieldValue, errors) => (
    <>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <Dropdown
          items={[]}
          selectedItem={DetailTour?.destination}
          onSelect={() => {}}
          placeholder="Where"
          isDropdownOpen={false}
          setIsDropdownOpen={() => {}}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="relative">
          <SelectMonth
            name="month"
            placeholder="Select Month"
            error={errors.month}
          />
          <div className="absolute left-3 top-5 text-gray-400">
            <Calendar size={16} />
          </div>
        </div>
        <div className="mt-2">
          <PickerBook
            onDateChange={handleDateChange}
            setFieldValue={setFieldValue}
          />

          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>
      </div>

      {/* <DatePickerModal
        open={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onDateChange={handleDateChange}
        setFieldValue={setFieldValue}
      /> */}

      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          { label: "Adults", name: "num_of_adults" },
          { label: "Children", name: "num_of_children" },
          { label: "Infants", name: "num_of_infants" },
        ].map(({ label, name }) => (
          <div key={name} className="bg-gray-50 rounded-lg p-2">
            <label className="text-sm font-medium mb-2 block">
              {label}
              <span className="text-xs text-gray-500 ml-1">
                {name === "num_of_adults"
                  ? "(12+)"
                  : name === "num_of_children"
                  ? "(2-11)"
                  : "(0-2)"}
              </span>
            </label>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setFieldValue(name, Math.max(values[name] - 1, 0))
                }
                className="bg-gray-100 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-lg focus:outline-none hover:bg-gray-200 transition-colors"
              >
                -
              </button>
              <span className="text-lg font-medium">{values[name]}</span>
              <button
                type="button"
                onClick={() => setFieldValue(name, values[name] + 1)}
                className="bg-gray-100 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-lg focus:outline-none hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      {errors.travelers && (
        <p className="text-red-500 text-sm mb-4">{errors.travelers}</p>
      )}
    </>
  );

  const renderStep2 = (values, setFieldValue, errors) => (
    <>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="relative">
          <BaseInputField
            name="name"
            placeholder="Name"
            type="text"
            error={errors.name}
            className="block w-full pl-10 bg-[#f0f1f2] focus:bg-transparent text-black text-sm border outline-[#007bff] rounded transition-all"
          />
          <div className="absolute left-3 top-5 text-gray-400">
            <FaUser size={16} />
          </div>
        </div>
        <div className="relative">
          <BaseInputField
            name="email"
            placeholder="Email"
            type="email"
            error={errors.email}
            className="block w-full pl-10 bg-[#f0f1f2] focus:bg-transparent text-black text-sm border outline-[#007bff] rounded transition-all"
          />
          <div className="absolute left-3 top-5 text-gray-400">
            <FaEnvelope size={16} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="relative">
          <SelectNationality
            name="nationality_id"
            placeholder="Nationality"
            error={errors.nationality_id}
          />
          <div className="absolute left-3 top-5 text-gray-400">
            <MapPin size={16} />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <PhoneInput
            international
            placeholder="Enter Your Number"
            value={values.phone}
            onChange={(value) => setFieldValue("phone", value)}
            defaultCountry="EG"
            error={errors.phone}
            className="block rounded-xl w-full my-3 mt-2 pb-3 p-2 bg-[#f0f1f2] focus:bg-transparent text-black text-sm border outline-[#007bff]  transition-all"
            inputStyle={{
              textAlign: "center",
            }}
          />
        </div>
      </div>
      <div className="mb-4">
        <Field
          as="textarea"
          name="details"
          placeholder="Tell us More Details"
          className="w-full p-3 bg-[#f0f1f2] focus:bg-transparent text-black text-sm border outline-none rounded transition-all"
          rows={4}
        />
      </div>
    </>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-300">
      <Stepper activeStep={step} alternativeLabel className="mb-3">
        <Step>
          <StepLabel>Choose Dates</StepLabel>
        </Step>
        <Step>
          <StepLabel>Personal Details</StepLabel>
        </Step>
      </Stepper>
      <Formik
        initialValues={{
          name: "",
          email: "",
          phone: "",
          month: "",
          num_of_adults: 0,
          num_of_children: 0,
          num_of_infants: 0,
          nationality_id: "",
          details: "",
        }}
        onSubmit={handleSubmit}
        validate={validate}
      >
        {({ values, setFieldValue, isSubmitting, errors }) => (
          <Form>
            {step === 0
              ? renderStep1(values, setFieldValue, errors)
              : renderStep2(values, setFieldValue, errors)}
            <div className="flex justify-between mt-4">
              {step === 1 && (
                <Button
                  type="button"
                  onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2"
                >
                  Back
                </Button>
              )}
              <div className="flex flex-grow justify-end">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    (step === 0 &&
                      (errors.month ||
                        errors.date ||
                        errors.travelers ||
                        values.num_of_adults +
                          values.num_of_children +
                          values.num_of_infants ===
                          0)) ||
                    (step === 1 &&
                      (errors.name ||
                        errors.email ||
                        errors.nationality_id ||
                        errors.phone))
                  }
                  className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
                >
                  {step === 1 ? (
                    isPending ? (
                      <Spinner size={20} />
                    ) : (
                      "Book Now"
                    )
                  ) : (
                    "Next"
                  )}
                </Button>
              </div>
            </div>
            <ToastContainer />
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default IntegratedBookingForm;
