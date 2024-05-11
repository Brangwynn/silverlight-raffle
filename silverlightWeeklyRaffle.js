//Adapted from the original script by Sinjhin, https://github.com/Sinjhin/sinjhin.github.io
const fs = require('fs');
const Papa = require('papaparse');

const inputFile = 'raffle_input.csv'; // Your input CSV file
const outputFile = 'raffle_output.csv'; // File to save the filtered data

// Read the CSV file
const csvData = fs.readFileSync(inputFile, 'utf8');

// Parse the CSV data
const results = Papa.parse(csvData, {
  header: false,
  skipEmptyLines: true,
});

// Process the data row by row
let ticketNumber = 1;
const assignedTickets = []; // Use an array to maintain order and duplicates

results.data.forEach((row) => {
  const name = row[1];
  const tickets = parseInt(row[3]);

  if (name && tickets) {
    for (let ticket = ticketNumber; ticket < ticketNumber + tickets; ticket++) {
      assignedTickets.push({ name: name, ticket: ticket });
    }
    ticketNumber += tickets;
  }
});

// Convert the assigned tickets data to an array of strings for output
const outputTickets = assignedTickets.map(item => `${item.name}: ${item.ticket}`);

// Define an array of names to skip
const skippedNames = ['simon_pinelock', 'Brangwynn', 'Sinjhin']; // Replace with your array of names to skip

// Function to get a random winner, excluding skipped names and previous winners
const getRandomWinner = (previousWinners) => {
  let winner;
  do {
    const randomIndex = Math.floor(Math.random() * assignedTickets.length);
    const candidate = assignedTickets[randomIndex];
    if (!skippedNames.includes(candidate.name) && !previousWinners.includes(candidate.name)) {
      winner = candidate;
    }
  } while (!winner);

  return winner;
};

// Array to store previous winners
const previousWinners = [];

// Get three random ticket numbers for first, second, and third prizes
const firstPrize = getRandomWinner(previousWinners);
previousWinners.push(firstPrize.name);

const secondPrize = getRandomWinner(previousWinners);
previousWinners.push(secondPrize.name);

const thirdPrize = getRandomWinner(previousWinners);

// Create a set for unique users
const uniqueUsers = new Set(assignedTickets.map(item => item.name));

// Prepare the output string
const output = `Prize Winners:
First Prize (Ticket #${firstPrize.ticket}): ${firstPrize.name}
Second Prize (Ticket #${secondPrize.ticket}): ${secondPrize.name}
Third Prize (Ticket #${thirdPrize.ticket}): ${thirdPrize.name}

Unique Users:
${Array.from(uniqueUsers).join('\n')}

Assigned Tickets:
${outputTickets.join('\n')}`;

// Output the results to the console
console.log(output);

// Save the filtered data and prize information to a new CSV file
fs.writeFileSync(outputFile, output, 'utf8');

console.log(`Assigned tickets and prize information saved to ${outputFile}`);
