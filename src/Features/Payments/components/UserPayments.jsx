import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { useGetCustomerPayments } from "../hooks/usePaymentApi";
import { classNames } from "primereact/utils";

const UserPayments = () => {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [expandedRows, setExpandedRows] = useState(null);

  const { data, isLoading, isSuccess } = useGetCustomerPayments(page, rows);

  // Extract payments from the API response
  const payments = isSuccess ? data.data.payments : [];
  const totalRecords = isSuccess ? data.total : 0;

  const formatCurrency = (value, currency) => {
    const currencySymbols = {
      usd: "$",
      egp: "E£",
    };

    return `${currencySymbols[currency] || ""}${(value / 100).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusTemplate = (rowData) => {
    const statusMap = {
      // Payment statuses
      uncaptured: { severity: "info", icon: "pi pi-info-circle" },
      succeeded: { severity: "success", icon: "pi pi-check-circle" },
      canceled: { severity: "danger", icon: "pi pi-times-circle" },
      disputed: { severity: "danger", icon: "pi pi-exclamation-triangle" },
      expired: { severity: "danger", icon: "pi pi-ban" },
      // Transaction statuses
      pending: { severity: "warning", icon: "pi pi-clock" },
      completed: { severity: "success", icon: "pi pi-check-circle" },
      failed: { severity: "danger", icon: "pi pi-exclamation-circle" },
    };

    const status = statusMap[rowData.status] || {
      severity: "info",
      icon: "pi pi-info-circle",
    };

    return (
      <Tag
        severity={status.severity}
        icon={status.icon}
        value={rowData.status.charAt(0).toUpperCase() + rowData.status.slice(1)}
      />
    );
  };

  const paymentMethodTemplate = (rowData) => {
    const methodIcons = {
      card: "pi pi-credit-card",
      paypal: "pi pi-paypal",
      bank_transfer: "pi pi-wallet",
    };

    return (
      <div className="row">
        <i
          className={`${methodIcons[rowData.paymentMethod] || "pi pi-credit-card"} mr-2`}
        ></i>
        <span className="capitalize">{rowData.paymentMethod.replace("_", " ")}</span>
      </div>
    );
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3 animate-fadeIn bg-[#f8f9fa] rounded-lg mt-2">
        <h5 className="mb-3 font-medium">Transaction Details</h5>
        <DataTable
          value={data.transactions}
          size="small"
          emptyMessage="No transactions found"
        >
          <Column field="_id" header="Transaction ID" className="w-1/5" />
          <Column
            field="type"
            header="Type"
            body={(rowData) => (
              <Tag
                value={rowData.type.charAt(0).toUpperCase() + rowData.type.slice(1)}
                severity={
                  rowData.type === "refund"
                    ? "warning"
                    : rowData.type === "payment"
                    ? "success"
                    : "info"
                }
              />
            )}
          />
          <Column
            field="amount"
            header="Amount"
            body={(rowData) => formatCurrency(rowData.amount, rowData.currency)}
          />
          <Column field="status" header="Status" body={statusTemplate} />
          <Column
            field="createdAt"
            header="Date"
            body={(rowData) => formatDate(rowData.createdAt)}
          />
        </DataTable>

        {data.netAmount !== undefined && (
          <div className="mt-4 p-3 bg-white rounded border border-gray-200">
            <h6 className="font-medium mb-2">Payment Summary</h6>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Net Amount</p>
                <p className="font-medium">
                  {formatCurrency(data.netAmount, data.currency)}
                </p>
              </div>
              {data.platformFee !== undefined && (
                <div>
                  <p className="text-gray-500 text-sm">Platform Fee</p>
                  <p className="font-medium">
                    {formatCurrency(data.platformFee, data.currency)}
                  </p>
                </div>
              )}
              {data.providerFee !== undefined && (
                <div>
                  <p className="text-gray-500 text-sm">Provider Fee</p>
                  <p className="font-medium">
                    {formatCurrency(data.providerFee, data.currency)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
      <DataTable
        value={payments}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="_id"
        emptyMessage="No payments found"
        stripedRows
        paginator
        rows={rows}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} payments"
        lazy
        totalRecords={totalRecords}
        loading={isLoading}
        onPage={(e) => {
          setPage(e.page + 1);
          setRows(e.rows);
        }}
        pt={{
          paginator: {
            pageButton: ({ context }) =>
              context.active && "bg-neutral-100 text-neutral-700",
            RPPDropdown: {
              root: ({ state }) =>
                classNames("hover:border-yellow-400", {
                  "shadow-[0_0_0_0.2rem_rgba(254,249,195,1)] border-yellow-400":
                    state.focused,
                }),
              item: ({ context }) =>
                context.selected && "bg-neutral-200 text-neutral-600",
            },
          },
        }}
      >
        <Column expander className="w-12" />
        <Column field="_id" header="Payment ID" sortable className="w-1/5" />
        <Column
          field="activityType"
          header="Activity"
          body={(rowData) => (
            <span className="font-semibold">{rowData.activityType}</span>
          )}
          sortable
        />
        <Column
          field="amount"
          header="Amount"
          body={(rowData) => formatCurrency(rowData.amount, rowData.currency)}
          sortable
        />
        <Column
          field="paymentMethod"
          header="Method"
          body={paymentMethodTemplate}
          sortable
        />
        <Column field="status" header="Status" body={statusTemplate} sortable />
        <Column
          field="createdAt"
          header="Date"
          body={(rowData) => formatDate(rowData.createdAt)}
          sortable
        />
        {isSuccess && data?.data?.payments?.[0]?.netAmount !== undefined && (
          <Column
            field="netAmount"
            header="Net Amount"
            body={(rowData) => formatCurrency(rowData.netAmount, rowData.currency)}
            sortable
          />
        )}
      </DataTable>
    </div>
  );
};

export default UserPayments;
