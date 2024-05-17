function runTest(input) {
  return new Promise((resolve, reject) => {
      try {
          // Parse input data
          const entries = input.split(';').map(item => {
              const [name, tickets] = item.split(',').map(str => str.trim());
              return { name, tickets: parseInt(tickets, 10) };
          });

          // Process the data
          let ticketNumber = 1;
          const assignedTickets = [];
          entries.forEach(({ name, tickets }) => {
              for (let i = 0; i < tickets; i++) {
                  assignedTickets.push({ name, ticket: ticketNumber++ });
              }
          });

          // Define an array of names to skip
          const skippedNames = ['simon_pinelock', 'Brangwynn', 'Sinjhin'];

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
${assignedTickets.map(item => `${item.name}: ${item.ticket}`).join('\n')}`;

          resolve(output);
      } catch (err) {
          reject(err);
      }
  });
}

// Expose the runTest function to the window object
window.runTest = runTest;
