import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";

export default function CustomDataTable(props) {
  const num = props.pageSize;

  return (
    <div style={{ minWidth: "350px", maxWidth: "996px" }}>
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2
          style={{
            color: "var(--primary-100)",
            fontWeight: "500",
          }}
        >
          {props.tableTitle}
        </h2>
        {props.link && (
          <Link
            to={props.link}
            style={{ textDecoration: "none", color: "#000" }}
          >
            View All
          </Link>
        )}
      </div>
      <div
        style={{
          height: 200,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DataGrid
          rows={props.rows}
          columns={props.columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: num },
            },
          }}
          sx={{
            "& [data-field='requestStatus'], [data-field='bookingStatus']": {
              fontFamily: "Outfit",
              fontSize: "13px",
              fontWeight: 500,
              lineHeight: 1.5,
              borderRadius: "15px",
              textAlign: "center",
              height: "fit-content",
              width: "fir-content",
              margin: "auto 0",
              padding: "2px 8px",
            },

            "& [title='Approved']": {
              backgroundColor: "#E7F8F7",
              color: "#33C5BD",
            },

            "& [title='paid']": {
              backgroundColor: "#E7F8F7",
              color: "#33C5BD",
            },

            "& [title='Declined']": {
              backgroundColor: "rgba(224, 18, 18, 0.07)",
              color: "#E01212",
            },

            "& [title='unpaid']": {
              backgroundColor: "rgba(224, 18, 18, 0.07)",
              color: "#E01212",
            },

            "& [title='Pending']": {
              backgroundColor: "#FFF3E5",
              color: "#FCAB44",
            },
          }}
          checkboxSelection
        />
      </div>
    </div>
  );
}
