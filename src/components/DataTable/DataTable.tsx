import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DataTable.module.css";

interface TableData {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const DataTable: React.FC = () => {
  const [data, setData] = useState<TableData[]>([]);
  const [filteredData, setFilteredData] = useState<TableData[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSort = (column: keyof TableData) => {
    const direction = sortDirection === "asc" ? "desc" : "asc";
    const sortedData = [...filteredData].sort((a, b) => {
      if (a[column] < b[column]) return direction === "asc" ? -1 : 1;
      if (a[column] > b[column]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredData(sortedData);
    setSortDirection(direction);
  };

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = data.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(searchTerm)
    );
    setFilteredData(filtered);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTableHeaderCellElement>,
    column: keyof TableData
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      handleSort(column);
    }
  };

  return (
    <div className="dataTableWrapper">
      <div className="stickyHeader">
        <h1>Data Table</h1>
        <input
          type="text"
          placeholder="Search..."
          onChange={handleFilter}
          className="searchInput"
          aria-label="Search Table"
        />
      </div>
      <div className="tableContainer">
        <table role="table" aria-label="Data Table">
          <thead>
            <tr role="row">
              <th
                role="columnheader"
                tabIndex={0}
                aria-sort={
                  sortDirection === "asc"
                    ? "ascending"
                    : sortDirection === "desc"
                    ? "descending"
                    : "none"
                }
                onClick={() => handleSort("userId")}
                onKeyDown={(event) => handleKeyDown(event, "userId")}
              >
                User ID
              </th>
              <th
                role="columnheader"
                tabIndex={0}
                aria-sort={
                  sortDirection === "asc"
                    ? "ascending"
                    : sortDirection === "desc"
                    ? "descending"
                    : "none"
                }
                onClick={() => handleSort("id")}
                onKeyDown={(event) => handleKeyDown(event, "id")}
              >
                ID
              </th>
              <th
                role="columnheader"
                tabIndex={0}
                onClick={() => handleSort("title")}
                onKeyDown={(event) => handleKeyDown(event, "title")}
              >
                Title
              </th>
              <th
                role="columnheader"
                tabIndex={0}
                onClick={() => handleSort("body")}
                onKeyDown={(event) => handleKeyDown(event, "body")}
              >
                Body
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id} role="row">
                <td role="cell">{row.userId}</td>
                <td role="cell">{row.id}</td>
                <td role="cell">{row.title}</td>
                <td role="cell">{row.body}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div aria-live="polite">{filteredData.length} results displayed.</div>
    </div>
  );
};

export default DataTable;
