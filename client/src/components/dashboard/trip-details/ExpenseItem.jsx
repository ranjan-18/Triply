const ExpenseItem = ({
expense,
}) => {
return ( <div className="border rounded-2xl p-5 flex justify-between"> <div> <h3 className="font-semibold">
{expense.title} </h3>

```
    <p className="text-slate-500">
      {expense.category}
    </p>

    <p className="text-sm text-slate-400">
      Paid by: {expense.paidBy?.name}
    </p>
  </div>

  <div className="text-right">
    <p className="font-bold text-xl">
      ₹{expense.amount}
    </p>

    <p className="text-slate-500">
      {new Date(
        expense.date
      ).toLocaleDateString()}
    </p>
  </div>
</div>

);
};

export default ExpenseItem;
