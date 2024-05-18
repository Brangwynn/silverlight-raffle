function runTest(namesInput, skippedNamesInput) {
    return new Promise((resolve, reject) => {
        try {
            // Parse input data for names and tickets
            const entries = namesInput.split(';').map(item => {
                const [name, tickets] = item.split(',').map(str => str.trim());
                const ticketCount = parseInt(tickets, 10);
                return { name, tickets: isNaN(ticketCount) || ticketCount <= 0 ? 1 : ticketCount };
            });

            // Parse input data for skipped names
            const skippedNames = skippedNamesInput.split(',').map(name => name.trim()).filter(name => name);

            // Process the data
            let ticketNumber = 1;
            const assignedTickets = [];
            entries.forEach(({ name, tickets }) => {
                for (let i = 0; i < tickets; i++) {
                    assignedTickets.push({ name, ticket: ticketNumber++ });
                }
            });

            // Calculate total tickets and bonus prizes
            const totalTickets = assignedTickets.length;
            const bonusPrizes = Math.floor(totalTickets / 1000);

            // Filter valid entries
            const validEntries = assignedTickets.filter(ticket => !skippedNames.includes(ticket.name));
            const uniqueValidNames = [...new Set(validEntries.map(ticket => ticket.name))];
            const totalPrizes = Math.min(3, uniqueValidNames.length) + bonusPrizes;

            // Array to store previous winners
            const previousWinners = [];

            // Function to get a random winner, excluding skipped names and previous winners
            const getRandomWinner = (previousWinners) => {
                const maxIterations = 1000;
                let iterations = 0;
                let winner;
                do {
                    if (iterations++ > maxIterations) break;  // Safeguard against infinite loops
                    const randomIndex = Math.floor(Math.random() * validEntries.length);
                    const candidate = validEntries[randomIndex];
                    if (!previousWinners.includes(candidate.name)) {
                        winner = candidate;
                    }
                } while (!winner);
                return winner;
            };

            // Create a set for unique users excluding skipped names
            const uniqueUsers = new Set(
                assignedTickets
                    .map(item => item.name)
                    .filter(name => !skippedNames.includes(name))
            );

            // Determine the number of prizes to award
            const prizeCount = Math.min(3, uniqueValidNames.length);

            // Get random winners for the prizes
            let firstPrize, secondPrize, thirdPrize;
            if (prizeCount > 0) {
                firstPrize = getRandomWinner(previousWinners);
                previousWinners.push(firstPrize.name);
            }
            if (prizeCount > 1) {
                secondPrize = getRandomWinner(previousWinners);
                previousWinners.push(secondPrize.name);
            }
            if (prizeCount > 2) {
                thirdPrize = getRandomWinner(previousWinners);
                previousWinners.push(thirdPrize.name);
            }

            // Get Bonus Winners, excluding skipped names and previous winners
            const getBonusPrizeWinners = (previousWinners) => {
                const maxIterations = 1000;
                let iterations = 0;
                const bonusWinners = new Set();
                while (bonusWinners.size < bonusPrizes) {
                    if (iterations++ > maxIterations) break;  // Safeguard against infinite loops
                    const randomIndex = Math.floor(Math.random() * uniqueUsers.size);
                    const candidate = Array.from(uniqueUsers)[randomIndex];
                    if (!previousWinners.includes(candidate) || uniqueUsers.size < totalPrizes) {
                        bonusWinners.add(candidate);
                        previousWinners.push(candidate);  // Update previousWinners
                        if (uniqueUsers.size < totalPrizes && bonusWinners.size === uniqueUsers.size) {
                            // If we have as many winners as unique users, reset to allow duplicates
                            uniqueUsers.forEach(user => previousWinners.push(user));
                        }
                    }
                }
                return Array.from(bonusWinners);
            };

            // Get bonus prize winners
            const bonusPrizeWinners = getBonusPrizeWinners(previousWinners);

            // Prepare the output string
            let output = `Total Tickets purchased: ${totalTickets}\n`;
            output += `Bonus Prizes: ${bonusPrizes}\n\n`;
            output += 'Gold Prize Winners:\n';
            if (firstPrize) output += `First Prize (Ticket #${firstPrize.ticket}): ${firstPrize.name}\n`;
            if (secondPrize) output += `Second Prize (Ticket #${secondPrize.ticket}): ${secondPrize.name}\n`;
            if (thirdPrize) output += `Third Prize (Ticket #${thirdPrize.ticket}): ${thirdPrize.name}\n`;

            output += `\nBonus Prize Winners:\n${bonusPrizeWinners.map((winner, index) => `${index + 1}. ${winner}`).join('\n')}\n`;
            output += `\nUnique Users:\n${Array.from(uniqueUsers).map((user, index) => `${index + 1}. ${user}`).join('\n')}\n`;
            output += `\nSkipped Names:\n${skippedNames.join('\n')}`;
            output += `\n\nAssigned Tickets:\n${assignedTickets.map(item => `${item.name}: ${item.ticket}`).join('\n')}`;

            resolve(output);
        } catch (err) {
            reject(err);
        }
    });
}

// Expose the runTest function to the window object
window.runTest = runTest;