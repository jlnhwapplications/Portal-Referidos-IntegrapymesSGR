import { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import {
  DataGrid,
  GridToolbar,
  gridFilteredSortedRowIdsSelector,
  selectedGridRowsSelector,
  esES
} from '@mui/x-data-grid';
import QuickSearchToolbar from "../../../@core/components/table/QuickSearchToolbar";
import { LinearProgress, useMediaQuery, useTheme } from "@mui/material";

const Table = ({ data, columns, name, addRow, toggle, canExport, description }) => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const theme = useTheme()
  const isDark = theme?.palette?.mode === 'dark'
  const esPantallaChica = useMediaQuery(theme => theme.breakpoints.down('xl'))
  const escapeRegExp = (value) => {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };
  const handleSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");

    const filteredRows = data.filter((row) => {
      return Object.keys(row).some((field) => {
        const fieldValue = row[field];
        if (fieldValue !== undefined && fieldValue !== null) {
          // Verificar si fieldValue no es undefined ni null antes de llamar a toString()
          return searchRegex.test(fieldValue.toString());
        }
        return false; // Si fieldValue es undefined o null, no realizar la búsqueda
      });
    });
    if (searchValue.length) {
      setFilteredData(filteredRows);
    } else {
      setFilteredData([]);
    }
  };

  const getSelectedRowsToExport = ({ apiRef }) => {
    const selectedRowIds = selectedGridRowsSelector(apiRef);
    if (selectedRowIds.size > 0) {
      return Array.from(selectedRowIds.keys());
    }

    return gridFilteredSortedRowIdsSelector(apiRef);
  };

  // export default function PrintExportSelectedRows() {
  //   const { data, loading } = useDemoData({
  //     dataSet: 'Commodity',
  //     rowLength: 10,
  //     maxColumns: 6,
  //   });

  return (
    <Card
      sx={{
        borderRadius: 4,
        background: isDark
          ? "linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)"
          : "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}`,
        boxShadow: isDark ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "0 8px 32px rgba(0, 0, 0, 0.08)",
        overflow: "hidden",
      }}
    >
      {/* {
        name ?
          <CardHeader title={name} sx={{ pt: 2 }} /> : null
      } */}
      <DataGrid
        getRowId={(row) => row.id}
        autoHeight
        checkboxSelection={canExport}
        rows={filteredData.length ? filteredData : data}
        columns={columns}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rowHeight={esPantallaChica ? 50 : 60}
        slots={{
          toolbar: QuickSearchToolbar,
          loadingOverlay: LinearProgress,
        }}
        slotProps={{
          toolbar: {
            value: searchText,
            clearSearch: () => handleSearch(""),
            onChange: (event) => handleSearch(event.target.value),
            addRow: addRow,
            toggle: toggle,
            canExport: canExport,
          },
        }}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          border: "none",
          "& .MuiDataGrid-main": {
            borderRadius: 0,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
            borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
            minHeight: { xs: "26px !important", xl: "46px !important" },
            "& .MuiDataGrid-columnHeader": {
              fontWeight: 600,
              fontSize: { xs: "0.6rem", xl: "0.8rem" },
              color: theme.palette.text.primary,
              display: "flex",
              alignItems: "center",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600,
              fontSize: { xs: "0.7rem", xl: "0.8rem" },
            },
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}`,
            display: "flex",
            alignItems: "center",
            "&:focus": {
              outline: "none",
            },
          },
          "& .MuiDataGrid-row": {
            minHeight: { xs: "50px !important", xl: "60px !important" },
            maxHeight: { xs: "50px !important", xl: "60px !important" },
            "&:hover": {
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
            },
            "&.Mui-selected": {
              backgroundColor: isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)",
              "&:hover": {
                backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.08)",
              },
            },
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
            minHeight: "56px",
          },
          "& .MuiCheckbox-root": {
            color: theme.palette.primary.main,
          },
          "& .MuiDataGrid-selectedRowCount": {
            color: theme.palette.text.secondary,
          },
          "& .MuiDataGrid-virtualScroller": {
            // Asegurar que el scroll funcione correctamente
            overflowX: "auto",
          },
        }}
      />
    </Card>
  );
};

export default Table;
