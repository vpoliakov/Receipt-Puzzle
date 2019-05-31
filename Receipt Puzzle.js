/*
Your task is to process the following menu of food items, and determine which food items could be purchased for the "receipt" values below.

The Menu: (I'll try to provide this in a hash or map data structure as an input)

veggie sandwich: 6.85
extra veggies: 2.20
chicken sandwich: 7.85
extra chicken: 3.20
cheese: 1.25
chips: 1.40
nachos: 3.45
soda: 2.05

The receipt values to test (your script should process as many of these as possible in under 30 seconds)

4.85, 11.05, 13.75, 17.75, 18.25, 19.40, 28.25, 40.30, 75.00

- you must use 100% of the money, we don't want any money left over
- you can order any quantity of any menu item
- none of the receipt values are "tricks", they all have answers
- the higher the value of the receipt, the more answers you'll be able to find

Primary Goal: Identify the menu items that add up to the receipt total

Secondary Goal:
Since each receipt can have many answers, try to find a way to identify an answer which contains fewer total items than other answers

Example:
4.85
- best: nachos, chips (2 items)
alternates:
- extra veggies, chips, cheese (3 times)
- chips, chips, soda (3 items)

Your output should present the receipt total, and a list of items and a way to identify their quantities. For example:

13.75, 3 items, ['veggie sandwich', 'nachos', 'nachos']
or
13.75, 3 items, {'veggie sandwich': 1, 'nachos': 2}
*/

let receipts = [4.85, 11.05, 13.75, 17.75, 18.25, 19.40, 40.30, 75.00];
receipts = receipts.map(receipt => Math.round(receipt * 100)); // convert prices to cents

const menu = {
  'veggie sandwich': 6.85,
  'extra veggies': 2.20,
  'chicken sandwich': 7.85,
  'extra chicken': 3.20,
  'cheese': 1.25,
  'chips': 1.40,
  'nachos': 3.45,
  'soda': 2.05,
};

// convert prices to cents
for (const item in menu) {
  menu[item] = Math.round(menu[item] * 100);
}

// Returns a memoization table of the given size
const createDPTable = function (receipt) {
  const dp = [{
    possible: true,
    items: 0,
    lastItem: undefined // used as a link to "prev index"
  }];

  for (let i = 1; i <= receipt; i++) {
    dp[i] = { // default values
      possible: false,
      items: Infinity,
      lastItem: undefined
    }

    for (const item in menu) { // check all menu items
      const prev = i - menu[item]; // index
      if (!dp[prev] || !dp[prev].possible) continue;

      if (dp[prev].items + 1 < dp[i].items) { // can minimize number of items
        dp[i] = {
          possible: true,
          items: dp[prev].items + 1,
          lastItem: item
        };
      }
    }
  }

  return dp;
}

const printReceipts = function (receipts) {
  const dp = createDPTable(Math.max.apply(null, receipts));

  for (let receipt of receipts) {
    const items = [];

    console.log(receipt, (() => { // traverses the table and returns items for that receipt
      while (receipt >= 0) {
        if (receipt == 0) return items;
        items.push(dp[receipt].lastItem);
        receipt -= menu[dp[receipt].lastItem];
      }
    })());
  }
}

printReceipts(receipts);