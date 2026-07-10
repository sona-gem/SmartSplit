export function calculateBalances(expenses, members) {
  //tracks net amt for each member,
  //if positive => shoudl get money back
  //if negative => owes money
  const balance = {};
  members.forEach((m) => (balance[m.name] = 0)); //initialize the balance array with 0 for all members

  expenses.forEach((exp) => {
    const share = exp.amount / exp.splitAmong.length;

    balance[exp.paidBy] += exp.amount; //person who paid gets creditied full amt

    exp.splitAmong.forEach((name) => {
      balance[name] -= share;
    });
  });
  return balance;
}
