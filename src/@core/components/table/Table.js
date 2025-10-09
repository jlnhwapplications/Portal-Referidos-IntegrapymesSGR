import { useEffect, useMemo, useState } from "react";
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

const Table = ({ data, columns, name, addRow, toggle, canExport, description, exportFileName }) => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const localeText = useMemo(() => ({
    ...esES.components.MuiDataGrid.defaultProps.localeText,
    toolbarExportCSV: "Descargar",
  }), []);
  const isSearching = searchText.trim().length > 0;
  const rawRows = isSearching ? filteredData : data;
  const rowsToShow = Array.isArray(rawRows) ? rawRows : [];
  const hasRows = rowsToShow.length > 0;
  const processedColumns = useMemo(() => {
    if (!Array.isArray(columns)) return [];
    return columns.map(column => ({
      ...column,
      headerAlign: column?.headerAlign ?? "left",
      align: column?.align ?? "left",
    }));
  }, [columns]);
  const exportColumnFields = useMemo(() => {
    if (!Array.isArray(processedColumns)) return [];
    return processedColumns
      .filter(column => !!column?.field)
      .filter(column => column.disableExport !== true)
      .filter(column => {
        const field = column.field;
        if (column.hide) return false;
        if (columnVisibilityModel[field] === false) return false;
        return true;
      })
      .map(column => column.field);
  }, [processedColumns, columnVisibilityModel]);

  useEffect(() => {
    if (!Array.isArray(columns) || columns.length === 0) {
      setColumnVisibilityModel({});
      return;
    }

    setColumnVisibilityModel(prevModel => {
      const updatedModel = { ...prevModel };
      let hasChanges = false;
      const columnFields = new Set();

      columns.forEach(column => {
        const field = column?.field;
        if (!field) return;

        columnFields.add(field);

        if (column.hide) {
          if (updatedModel[field] !== false) {
            updatedModel[field] = false;
            hasChanges = true;
          }
        } else if (updatedModel[field] === false) {
          delete updatedModel[field];
          hasChanges = true;
        }
      });

      Object.keys(updatedModel).forEach(field => {
        if (!columnFields.has(field)) {
          delete updatedModel[field];
          hasChanges = true;
        }
      });

      return hasChanges ? updatedModel : prevModel;
    });
  }, [columns]);
  const theme = useTheme()
  const isDark = theme?.palette?.mode === 'dark'
  const esPantallaChica = useMediaQuery(theme => theme.breakpoints.down('xl'))
  const escapeRegExp = (value) => {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };
  const handleSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");

    const sourceRows = Array.isArray(data) ? data : [];
    const filteredRows = sourceRows.filter((row) => {
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
        checkboxSelection={Boolean(canExport && hasRows)}
        rows={rowsToShow}
        columns={processedColumns}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={setColumnVisibilityModel}
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
            canExport: canExport && hasRows,
            exportFileName,
            exportColumnFields,
          },
        }}
        localeText={localeText}
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
              justifyContent: "flex-start",
              textAlign: "left",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600,
              fontSize: { xs: "0.7rem", xl: "0.8rem" },
              textAlign: "left",
            },
            "& .MuiDataGrid-columnHeaderTitleContainer": {
              justifyContent: "flex-start",
            },
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            textAlign: "left",
            "&:focus": {
              outline: "none",
            },
          },
          "& .MuiDataGrid-cellContent": {
            textAlign: "left",
            width: "100%",
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
