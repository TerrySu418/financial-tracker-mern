import { useUser } from "@clerk/clerk-react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface FinancialRecord {
  _id?: string; //get it from MongoDB
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

interface FinancialRecordsContextType {
  records: FinancialRecord[]; //  is an array of FinancialRecord objects.
  addRecord: (record: FinancialRecord) => Promise<void>; //This is a function that takes a FinancialRecord object as an argument and doesn't return anything (void)
  updateRecord: (id: string, newRecord: FinancialRecord) => Promise<void>;
  deleteRecord: (id: string) => void
}

export const FinancialRecordsContext = createContext<
  FinancialRecordsContextType | undefined
>(undefined); //This is a React function used to create a Context object. Context provides a way to pass data through the component tree without having to pass props down manually at every level.

export const FinancialRecordsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const { user } = useUser();

  const fetchRecords = async () => {
    if (!user) return;
    const response = await fetch(
      `http://localhost:3001/financial-records/getAllByUserId/${user.id}`
    );
    if (response.ok) {
      const records = await response.json();
      console.log(records);
      setRecords(records);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const addRecord = async (record: FinancialRecord) => {
    const response = await fetch("http://localhost:3001/financial-records", {
      method: "POST",
      body: JSON.stringify(record),
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) => [...prev, newRecord]);
      }
    } catch (err) {}
  };

  const updateRecord = async (id: string, newRecord: FinancialRecord) => {
    const response = await fetch(
      `http://localhost:3001/financial-records/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(newRecord),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    try {
      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) => {
          return prev.map((record) => {
            return record._id === id ? newRecord : record;
          });
        });
      } else {
        console.error("Failed to update record");
      }
    } catch (err) {
      console.error("Error updating record:", err);
    }
  };

  const deleteRecord = async (id: string) => {
    const response = await fetch(`http://localhost:3001/financial-records/${id}`, {
      method: "DELETE",
    });

    try {
      if (response.ok) {
        const deletedRecord = await response.json();
        setRecords((prev) => prev.filter((record) => record._id !== deletedRecord._id));
      }
    } catch (err) {}
  };

  return (
    <FinancialRecordsContext.Provider
      value={{ records, addRecord, updateRecord, deleteRecord }}
    >
      {" "}
      {children}
    </FinancialRecordsContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext<FinancialRecordsContextType | undefined>(
    FinancialRecordsContext
  );
  if (!context) {
    throw new Error(
      "useFinancialRecords must be used within a FInancialRecordsProvider"
    );
  }
  return context;
};
