const myTheme = {
  // Alert
  alert: {
    base: "p-4 pl-12 relative rounded-xl leading-5 shadow-sm border",
    withClose: "pr-12",
    success: "bg-emerald-50 border-emerald-100 text-emerald-800",
    danger: "bg-red-50 border-red-100 text-red-800",
    warning: "bg-amber-50 border-amber-100 text-amber-800",
    neutral: "bg-slate-50 border-slate-100 text-slate-800",
    info: "bg-blue-50 border-blue-100 text-blue-800",
    icon: {
      base: "h-5 w-5",
      success: "text-emerald-500",
      danger: "text-red-500",
      warning: "text-amber-500",
      neutral: "text-slate-500",
      info: "text-blue-500",
    },
  },
  // Pagination
  pagination: {
    base: "flex flex-col justify-between text-sm sm:flex-row text-slate-600",
  },
  // TableFooter
  tableFooter: {
    base: "px-4 py-3 border-t border-slate-200 bg-slate-50 text-slate-600 rounded-b-xl",
  },
  // TableRow
  tableRow: {
    base: "transition-colors duration-150 hover:bg-slate-50/80",
  },
  // TableHeader
  tableHeader: {
    base: "text-xs font-bold tracking-wider text-left text-slate-500 uppercase border-b border-slate-200 bg-slate-50",
  },
  // TableContainer
  tableContainer: {
    base: "w-full overflow-hidden border border-slate-200 rounded-xl shadow-sm bg-white",
  },
  // TableCell
  tableCell: {
    base: "px-4 py-3 text-sm text-slate-700",
  },
  // TableBody
  tableBody: {
    base: "bg-white divide-y divide-slate-100",
  },
  // DropdownItem
  dropdownItem: {
    base: "mb-1 last:mb-0",
  },
  // Dropdown
  dropdown: {
    base: "absolute w-56 p-2 mt-2 text-slate-700 bg-white border border-slate-100 rounded-xl shadow-lg min-w-max-content",
    align: {
      left: "left-0",
      right: "right-0",
    },
  },
  // Avatar
  avatar: {
    base: "relative rounded-full inline-block ring-2 ring-white shadow-sm",
    size: {
      large: "w-10 h-10",
      regular: "w-8 h-8",
      small: "w-6 h-6",
    },
  },
  // Modal
  modal: {
    base: "w-full px-6 py-5 overflow-hidden bg-white rounded-2xl shadow-2xl sm:m-4 sm:max-w-xl custom-modal transform transition-all",
  },
  // ModalBody
  modalBody: {
    base: "mb-6 text-sm text-slate-600",
  },
  // ModalFooter
  modalFooter: {
    base: "flex flex-col items-center justify-end px-6 py-4 -mx-6 -mb-5 space-y-3 sm:space-y-0 sm:space-x-3 sm:flex-row bg-slate-50 border-t border-slate-100",
  },
  // ModalHeader
  modalHeader: {
    base: "mt-2 mb-4 text-xl font-bold text-slate-900 tracking-tight",
  },
  // Badge
  badge: {
    base: "inline-flex px-2.5 py-0.5 text-xs font-semibold leading-5 rounded-full border",
    success: "text-emerald-700 bg-emerald-50 border-emerald-200",
    danger: "text-red-700 bg-red-50 border-red-200",
    warning: "text-amber-700 bg-amber-50 border-amber-200",
    neutral: "text-slate-600 bg-slate-50 border-slate-200",
    primary: "text-slate-700 bg-slate-50 border-slate-200",
  },
  // Backdrop
  backdrop: {
    base: "fixed inset-0 z-40 flex items-end bg-slate-900/40 backdrop-blur-sm sm:items-center sm:justify-center transition-opacity",
  },
  // Textarea
  textarea: {
    base: "block w-full border border-slate-300 bg-white text-sm text-slate-900 rounded-lg focus:outline-none p-3 shadow-sm transition-all hover:border-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-500/10",
    active: "",
    disabled: "cursor-not-allowed opacity-60 bg-slate-50 text-slate-500",
    valid: "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/10",
    invalid: "border-red-500 focus:border-red-500 focus:ring-red-500/10",
  },
  // Select
  select: {
    base: "block w-full h-11 border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none rounded-lg form-select shadow-sm transition-all hover:border-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-500/10",
    active: "",
    select: "leading-5",
    disabled: "cursor-not-allowed opacity-60 bg-slate-50 text-slate-500",
    valid: "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/10",
    invalid: "border-red-500 focus:border-red-500 focus:ring-red-500/10",
  },
  // Label
  label: {
    base: "block text-sm font-semibold text-slate-700 mb-1",
    check: "inline-flex items-center",
    disabled: "opacity-50 cursor-not-allowed",
  },
  // Input
  input: {
    base: "block w-full h-11 border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none leading-5 rounded-lg bg-white shadow-sm transition-all hover:border-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-500/10",
    active: "",
    disabled: "cursor-not-allowed opacity-60 bg-slate-50 text-slate-500",
    valid: "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/10",
    invalid: "border-red-500 focus:border-red-500 focus:ring-red-500/10",
    radio: "text-slate-600 form-radio focus:ring-slate-500/20 focus:outline-none",
    checkbox: "text-slate-600 form-checkbox focus:ring-slate-500/20 focus:outline-none rounded border-slate-300",
  },
  // HelperText
  helperText: {
    base: "text-[11px] font-medium mt-1",
    valid: "text-emerald-600",
    invalid: "text-red-600",
  },
  // Card
  card: {
    base: "min-w-0 rounded-xl overflow-hidden bg-white shadow-sm border border-slate-100",
    default: "",
  },
  cardBody: {
    base: "p-5",
  },
  // Button
  button: {
    base: "align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-all duration-200 font-semibold focus:outline-none",
    block: "w-full",
    size: {
      larger: "px-10 py-4 rounded-xl text-base",
      large: "px-6 py-3 rounded-lg text-sm",
      regular: "px-4 py-2 rounded-lg text-sm",
      small: "px-3 py-1.5 rounded-md text-xs",
      icon: {
        larger: "p-4 rounded-xl",
        large: "p-3 rounded-lg",
        regular: "p-2.5 rounded-lg",
        small: "p-2 rounded-md",
      },
      pagination: "px-3 py-1 rounded-md text-xs",
    },
    icon: {
      larger: "h-6 w-6",
      large: "h-5 w-5",
      regular: "h-4 w-4",
      small: "h-3 w-3",
      left: "mr-2 -ml-1",
      right: "ml-2 -mr-1",
    },
    primary: {
      base: "text-white bg-[#0a2540] border border-transparent shadow-sm hover:bg-[#0d3257] hover:shadow focus:ring-4 focus:ring-[#0a2540]/20",
      active: "",
      disabled: "opacity-60 cursor-not-allowed hover:bg-slate-800",
    },
    modern: {
      base: "text-white bg-[#0d3257] border border-transparent shadow-sm hover:bg-[#0a2540] hover:shadow focus:ring-4 focus:ring-[#0a2540]/20",
      active: "",
      disabled: "opacity-60 cursor-not-allowed",
    },
    outline: {
      base: "text-[#0a2540] bg-white border border-[#0a2540] shadow-sm hover:bg-[#d1fae5] hover:border-[#0d3257] focus:ring-4 focus:ring-[#0a2540]/10",
      active: "",
      disabled: "opacity-60 cursor-not-allowed hover:bg-white",
    },
    delete: {
      base: "text-red-700 bg-red-50 border border-red-200 shadow-sm hover:bg-red-100 hover:border-red-300 focus:ring-4 focus:ring-red-500/20",
      active: "",
      disabled: "opacity-60 cursor-not-allowed hover:bg-red-50",
    },
    link: {
      base: "text-slate-600 focus:outline-none border border-transparent hover:text-slate-600 hover:bg-slate-50 rounded-lg",
      active: "",
      disabled: "opacity-60 cursor-not-allowed",
    },
    dropdownItem: {
      base: "inline-flex items-center cursor-pointer w-full px-3 py-2 text-sm font-medium transition-colors duration-150 rounded-lg hover:bg-slate-50 hover:text-slate-900",
    },
  },
};
export default myTheme;
