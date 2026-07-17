//greedy algo - O(n^2logn)
//find the person who owes the most(largets -ve bal)
//find the person who should receive teh most (largest +ve bal)
//update their balances
//repeate until all balances are approx zero

export function simplifyDebts(balances) {
  //convert balances obj to array
  const people = Object.entries(balances)
    .map(([name, amount]) => ({
      name,
      amount,
    }))
    .filter(
      (p) =>
        p.amount !== undefined && !isNaN(p.amount) && Math.abs(p.amount) > 0.01,
    );

  if (people.length === 0) return [];

  const transactions = [];

  while (people.length >= 2) {
    people.sort((a, b) => a.amount - b.amount);
    const debtor = people[0]; //owes the most
    const creditor = people[people.length - 1]; //is owed the most

    //if everyone is settled
    if (Math.abs(debtor.amount) < 0.01 && Math.abs(creditor.amount) < 0.01)
      break;

    if (debtor.name === creditor.name) break;
    //settle as much as possible
    const amount = Math.min(-debtor.amount, creditor.amount);

    transactions.push({
      from: debtor.name,
      to: creditor.name,
      amount: parseFloat(amount.toFixed(2)),
    });

    debtor.amount += amount;
    creditor.amount -= amount;
  }
  return transactions;
}
