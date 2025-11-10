import React, { useEffect, useState } from "react";

const CoachList = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  const sheetCSVUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRNmPDTOG-F_ExRksptSy5SiUeqXkDnGTSvKXu5eEX9b3LVb_oQdhR-ihBYG4Fm8yrcFfZ_hUJKWZ0q/pub?output=csv";

  useEffect(() => {
    fetch(sheetCSVUrl)
      .then((res) => res.text())
      .then((csvText) => {
        const lines = csvText.split("\n");
        const headers = lines[0].split(",");

        const data = lines.slice(1).map((line) => {
          const values = line.split(",");
          const obj = {};
          headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim();
          });
          return obj;
        });

        setCoaches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch coaches:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">Coach Submissions</h2>

      {loading ? (
        <p>Loading coach data...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {coaches.length > 0 &&
                  Object.keys(coaches[0]).map((key) => (
                    <th key={key} className="border border-gray-300 px-4 py-2 text-left">
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {coaches.map((coach, idx) => (
                <tr key={idx} className="even:bg-gray-100">
                  {Object.values(coach).map((val, i) => (
                    <td key={i} className="border border-gray-300 px-4 py-2">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CoachList;
