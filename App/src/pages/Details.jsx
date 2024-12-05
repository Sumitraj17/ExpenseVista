const Details = (props) => {
  const { data, update } = props || {};

  // Validate that data exists
  if (!data) {
    return null; // Render nothing if no data is provided
  }

  // Safely access and format the date and bills
  const eventDate = data.date ||  "N/A";
  const totalCost = data.title || 0;
  const bills = data.bills || []; // Fallback to an empty array if no bills

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Day's Expense Details</h2>
        <p className="text-gray-700">
          <strong>Date:</strong> {eventDate}
        </p>
        <p className="text-gray-700">
          <strong>Total Expense:</strong> {totalCost}
        </p>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Bills:</h3>
          {bills.length > 0 ? (
            bills.map((bill, index) => (
              <div
                key={index}
                className="border-b border-gray-300 py-2 text-sm text-gray-800"
              >
                <p>
                  <strong>Title:</strong> {bill.title || "N/A"}
                </p>
                <p>
                  <strong>Cost:</strong> ₹{bill.cost || "N/A"}
                </p>
                <p>
                  <strong>Description:</strong> {bill.description || "N/A"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No bills available for this date.</p>
          )}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          onClick={() => update(null, false)} // Close the modal
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Details;
