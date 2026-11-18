
"use client";

import { useState, useActionState } from "react";
import {
  bulkImportStudentsAction,
  type BulkStudentActionState,
} from "./actions";

const initialState: BulkStudentActionState = {};

const REQUIRED_HEADERS = [
  "fullName",
  "email",
  "registrationNo",
  "departmentCode",
  "admissionYear",
  "academicSession",
  "academicLevel",
];

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      if (insideQuotes && text[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      row.push(field.trim());
      field = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && text[i + 1] === "\n") i++;

      row.push(field.trim());

      if (row.some((value) => value !== "")) {
        rows.push(row);
      }

      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (insideQuotes) {
    throw new Error("The CSV contains an unclosed quotation mark.");
  }

  row.push(field.trim());

  if (row.some((value) => value !== "")) {
    rows.push(row);
  }

  return rows;
}

export default function BulkStudentImport() {
  const [state, formAction, pending] = useActionState(
    bulkImportStudentsAction,
    initialState
  );

  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [fileError, setFileError] = useState("");

  const template =
    "fullName,email,registrationNo,departmentCode,admissionYear,academicSession,academicLevel\n" +
    "Musa Ibrahim,musa@example.com,MIU/23/CMP/001,SWE,2023,2026/2027,300\n";

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setRows([]);
    setFileError("");

    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setFileError("Please select a CSV file.");
      return;
    }

    if (file.size > 1024 * 1024) {
      setFileError("The CSV file must not exceed 1 MB.");
      return;
    }

    try {
      const text = await file.text();
      const parsedRows = parseCSV(text.replace(/^\uFEFF/, ""));

      if (parsedRows.length < 2) {
        throw new Error("The CSV must contain a heading and at least one student.");
      }

      const headers = parsedRows[0].map((header) => header.trim());

      if (new Set(headers).size !== headers.length) {
        throw new Error("The CSV contains duplicate column headings.");
      }

      const missingHeaders = REQUIRED_HEADERS.filter(
        (header) => !headers.includes(header)
      );

      if (missingHeaders.length > 0) {
        throw new Error(
          `Missing required columns: ${missingHeaders.join(", ")}`
        );
      }

      const dataRows = parsedRows.slice(1);

      if (dataRows.length > 100) {
        throw new Error("A maximum of 100 students is allowed per batch.");
      }

      const formattedRows = dataRows.map((values, index) => {
        if (values.length !== headers.length) {
          throw new Error(
            `Row ${index + 2} has an incorrect number of columns.`
          );
        }

        const record: Record<string, string> = {};

        headers.forEach((header, columnIndex) => {
          record[header] = values[columnIndex] ?? "";
        });

        return record;
      });

      setRows(formattedRows);
    } catch (error) {
      setFileError(
        error instanceof Error
          ? error.message
          : "Unable to read this CSV file."
      );
    }
  }

  function downloadCredentials() {
    const credentials = state.report?.credentials;
    if (!credentials?.length) return;

    const csvRows = [
      ["Full Name", "Registration Number", "Username", "Password"],
      ...credentials.map((item) => [
        item.fullName,
        item.registrationNo,
        item.username,
        item.password,
      ]),
    ];

    const csvContent = csvRows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "student-login-credentials.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <section className="space-y-5 rounded-lg border border-slate-200 bg-white p-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Bulk Student Registration
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Upload a CSV file to register multiple students at once.
          Maximum 100 students per batch.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(template)}`}
          download="miu-student-import-template.csv"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Download CSV Template
        </a>
      </div>

      <div>
        <label
          htmlFor="student-csv"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Select CSV File
        </label>

        <input
          id="student-csv"
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="block w-full rounded-md border border-slate-300 p-2 text-sm"
        />
      </div>

      {fileError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {fileError}
        </p>
      )}

      {rows.length > 0 && (
        <>
          <div>
            <h4 className="font-medium text-slate-900">
              Import Preview ({rows.length} students)
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              Review the uploaded records before importing. Database
              validation will take place during import.
            </p>
          </div>

          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  {REQUIRED_HEADERS.map((header) => (
                    <th key={header} className="whitespace-nowrap px-3 py-3">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {rows.slice(0, 5).map((row, index) => (
                  <tr key={index}>
                    {REQUIRED_HEADERS.map((header) => (
                      <td
                        key={header}
                        className="whitespace-nowrap px-3 py-3 text-slate-700"
                      >
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rows.length > 5 && (
            <p className="text-xs text-slate-500">
              Showing the first 5 of {rows.length} records.
            </p>
          )}

          <form action={formAction} className="space-y-3">
            <input
              type="hidden"
              name="rows"
              value={JSON.stringify(rows)}
            />

            <button
              type="submit"
              disabled={pending || rows.length === 0}
              className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "Importing Students..." : "Import Students"}
            </button>
          </form>
        </>
      )}

      {state.message && (
        <div
          className={`rounded-md p-4 text-sm ${
            state.success
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </div>
      )}

      {state.report && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-xl font-bold text-slate-900">
                {state.report.total}
              </p>
            </div>

            <div className="rounded-md bg-green-50 p-3">
              <p className="text-xs text-green-700">Successful</p>
              <p className="text-xl font-bold text-green-800">
                {state.report.successful}
              </p>
            </div>

            <div className="rounded-md bg-red-50 p-3">
              <p className="text-xs text-red-700">Failed</p>
              <p className="text-xl font-bold text-red-800">
                {state.report.failed}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-3">CSV Row</th>
                  <th className="px-3 py-3">Registration No.</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Message</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {state.report.results.map((result, index) => (
                  <tr key={index}>
                    <td className="px-3 py-3">{result.row}</td>
                    <td className="px-3 py-3">
                      {result.registrationNo ?? "-"}
                    </td>
                    <td className="px-3 py-3">
                      {result.success ? "Success" : "Failed"}
                    </td>
                    <td className="px-3 py-3">{result.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {state.report.credentials.length > 0 && (
            <div className="space-y-3 rounded-md border border-amber-200 bg-amber-50 p-4">
              <h4 className="font-semibold text-amber-900">
                Student Login Credentials
              </h4>

              <p className="text-sm text-amber-800">
                These passwords are displayed only after registration.
                Download and store this file securely, then distribute
                credentials privately to the respective students.
              </p>

              <button
                type="button"
                onClick={downloadCredentials}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Download Login Credentials
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
