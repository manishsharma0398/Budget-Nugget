import React, { useState, useEffect } from "react";
import FormStructure from "./components/FormStructure";
import Navbar from "./components/Navbar";
import FormField from "./components/FormField";
import { formatDistanceToNow } from "date-fns";

const App = () => {
  const url = "https://budget-nugget.firebaseio.com/transactions";

  const [exTitle, setExTitle] = useState("");
  const [exAmount, setExAmount] = useState("");

  const [inTitle, setInTitle] = useState("");
  const [inAmount, setInAmount] = useState("");

  const [transactions, setTransactions] = useState([]);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const [initialLoading, setInitialLoading] = useState(true);

  const summary = () => {
    let Intotal = 0;
    let Extotal = 0;

    for (let i = 0; i < transactions.length; i++) {
      const transactionType = transactions[i].type;
      transactionType === "income"
        ? (Intotal += parseInt(transactions[i].amount))
        : (Extotal += parseInt(transactions[i].amount));
      console.log("af");
    }

    let balance = Intotal - Extotal;

    setTotalBalance(balance);
    setTotalExpense(Extotal);
    setTotalIncome(Intotal);

    console.log("summary function called");
  };

  useEffect(() => {
    const getAllTransactions = async () => {
      let response = await fetch(url + ".json");

      let commits = await response.json();

      console.log(commits);

      let dataKeys;
      let dataValues;

      if (commits == null || commits.length === 0) {
        dataKeys = [];
        dataValues = [];
      } else {
        dataKeys = Object.keys(commits);
        dataValues = Object.values(commits);
      }

      const transacts = [];

      for (let i = 0; i < dataKeys.length; i++) {
        const key = dataKeys[i];
        const value = dataValues[i];

        value["id"] = key;
        transacts.push(value);

        // transacts.reverse();
      }

      setTransactions(transacts);

      setInitialLoading(false);
    };

    getAllTransactions();
  }, []);

  useEffect(() => {
    console.log("calling summary function inside hooks");
    summary();
  }, [summary]);

  const clearFields = (transactionType) => {
    if (transactionType === "income") {
      setInTitle("");
      setInAmount("");
    } else {
      setExAmount("");
      setExTitle("");
    }
  };

  const writeData = async (transactionType, e) => {
    e.preventDefault();

    const dataToWrite = {
      type: transactionType,
      title: transactionType === "income" ? inTitle : exTitle,
      amount: transactionType === "income" ? inAmount : exAmount,
      createdAt: `${new Date()}`,
    };

    clearFields(transactionType);

    const transact = [...transactions];
    transact.unshift(dataToWrite);
    setTransactions(transact);

    summary();

    let response = await fetch(url + ".json", {
      method: "POST",
      body: JSON.stringify(dataToWrite),
    });

    let resData = await response.json();

    transact.forEach((trans) => {
      if (
        trans.amount === dataToWrite["amount"] &&
        trans.title === dataToWrite["title"] &&
        trans.type === dataToWrite["type"] &&
        trans.id === undefined
      ) {
        trans["id"] = resData.name;
      }
    });

    setTransactions(transact);
  };

  const deleteTransaction = async (transactionId) => {
    let response = await fetch(url + `/${transactionId}.json`, {
      method: "DELETE",
    });

    let resData = await response.json();

    let index;

    for (let i = 0; i < transactions.length; i++) {
      const element = transactions[i];

      if (element.id === transactionId) {
        index = i;
      }
    }

    if (resData == null) {
      const transact = [...transactions];

      transact.splice(index, 1);

      setTransactions(transact);
      summary();
    }
  };

  const updateTransaction = (id, type) => {
    const data = [];

    for (let i = 0; i < transactions.length; i++) {
      const element = transactions[i];
      // console.log(element);

      if (element.id === id) {
        console.log(element);
      }
    }

    // let response = await fetch(url + `/${transactionId}.json`, {
    //   method: "PATCH",
    // });

    // let resData = await response.json();

    // console.log(id, type);
  };

  return initialLoading ? (
    <div className="container">
      <div className="row col-6">
        <div className="mx-auto text-center">
          <img
            className="mx-auto text-center"
            src={process.env.PUBLIC_URL + "/images/loading.gif"}
            alt=""
          />
        </div>
      </div>
    </div>
  ) : (
    <>
      <Navbar />
      <div className="py-4">
        <div className="container">
          <div className="row">
            {/* Income and Expense Forms */}
            <div className="col-sm-12 col-md-6">
              {/* Income */}
              <div className="mt-3">
                <FormStructure
                  submitForm={(e) => writeData("income", e)}
                  formBorderColor="border border-success"
                  formComponent={
                    <>
                      <FormField
                        label="Income Title"
                        id="income-title"
                        placeholder="Enter Income Title Here"
                        value={inTitle}
                        onChangeInput={(e) => setInTitle(e.target.value)}
                        type="text"
                      />
                      <FormField
                        label="Income Amount"
                        id="income-amount"
                        placeholder="Enter Income Amount Here"
                        value={inAmount}
                        onChangeInput={(e) => setInAmount(e.target.value)}
                      />
                    </>
                  }
                  submitText="Add Income"
                  btnClass="success"
                />
              </div>

              {/* Expense */}
              <div className="mt-3">
                <FormStructure
                  submitForm={(e) => writeData("expense", e)}
                  formBorderColor="border border-danger"
                  formComponent={
                    <>
                      <FormField
                        label="Expense Title"
                        id="expense-title"
                        placeholder="Enter Expense Title Here"
                        value={exTitle}
                        type="text"
                        onChangeInput={(e) => setExTitle(e.target.value)}
                      />
                      <FormField
                        label="Expense Amount"
                        id="expense-amount"
                        placeholder="Enter Expense Amount Here"
                        value={exAmount}
                        onChangeInput={(e) => setExAmount(e.target.value)}
                      />
                    </>
                  }
                  submitText="Add Expense"
                  btnClass="danger"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="col-sm-12 col-md-6">
              <div className="row bg-light py-3 px-0">
                <div className="col text-center">
                  <span className="text-uppercase roboto-bold d-block">
                    Income
                  </span>
                  <img
                    style={{ height: "40px" }}
                    className="my-2"
                    src={process.env.PUBLIC_URL + "/images/note.jpg"}
                    alt=""
                  />
                  <span className="text-uppercase text-success roboto-bold d-block">
                    ₹ {totalIncome}
                  </span>
                </div>
                <div className="col text-center">
                  <span className="text-uppercase roboto-bold d-block">
                    Expense
                  </span>
                  <img
                    style={{ height: "40px" }}
                    className="my-2"
                    src={process.env.PUBLIC_URL + "/images/card.png"}
                    alt=""
                  />
                  <span className="text-uppercase text-danger roboto-bold d-block">
                    ₹ {totalExpense}
                  </span>
                </div>
                <div className="col text-center">
                  <span className="text-uppercase roboto-bold d-block">
                    Balance
                  </span>
                  <img
                    style={{ height: "40px" }}
                    className="my-2"
                    src={process.env.PUBLIC_URL + "/images/rupee-symbol.png"}
                    alt=""
                  />
                  <span className="text-uppercase roboto-bold d-block">
                    ₹ {totalBalance}
                  </span>
                </div>
              </div>

              {transactions.length > 0 ? (
                <table className="table mt-5">
                  <thead>
                    <tr>
                      <th className="roboto-bold" scope="col">
                        Date
                      </th>
                      <th className="roboto-bold" scope="col">
                        Title
                      </th>
                      <th className="roboto-bold" scope="col">
                        Amount
                      </th>
                      <th className="roboto-bold" scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td
                          className={
                            transaction.type === "income"
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          {formatDistanceToNow(new Date(transaction.createdAt))}
                        </td>
                        <td
                          className={
                            transaction.type === "income"
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          {transaction.title}
                        </td>
                        <td
                          className={
                            transaction.type === "income"
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          {transaction.type === "income" ? "+ " : "- "}
                          {transaction.amount}
                        </td>
                        <td>
                          <img
                            onClick={() =>
                              updateTransaction(
                                transaction.id,
                                transaction.type
                              )
                            }
                            className="mr-3"
                            style={{ cursor: "pointer" }}
                            src={process.env.PUBLIC_URL + "/images/pencil.svg"}
                            alt=""
                          />
                          <img
                            onClick={() => deleteTransaction(transaction.id)}
                            style={{ cursor: "pointer" }}
                            src={process.env.PUBLIC_URL + "/images/delete.svg"}
                            alt=""
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
