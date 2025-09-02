document.addEventListener("DOMContentLoaded", () => {
    // Default load timetable-1A.csv
    loadTimetable('timetable-1A.csv');
});

async function loadTimetable(filename) {
    const container = document.getElementById('timetable-container');
    container.innerHTML = 'Loading...';

    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`File not found: ${filename}`);
        }
        const text = await response.text();
        const rows = text.split('\n').map(row => row.split(','));

        // Clean up data: find the actual start of the table
        let startIndex = 0;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i][0] && rows[i][0].includes('DateTime')) {
                startIndex = i;
                break;
            }
        }

        const table = document.createElement('table');
        const headerRow = rows[startIndex];
        const tbody = document.createElement('tbody');

        // Create table header
        const thead = document.createElement('thead');
        const thRow = document.createElement('tr');
        headerRow.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText.trim().replace(/"/g, '');
            thRow.appendChild(th);
        });
        thead.appendChild(thRow);
        table.appendChild(thead);

        // Create table body from the rest of the rows
        for (let i = startIndex + 1; i < rows.length; i++) {
            const rowData = rows[i];
            if (rowData.some(cell => cell.trim() !== '')) { // Check if the row is not empty
                const tr = document.createElement('tr');
                rowData.forEach(cellText => {
                    const td = document.createElement('td');
                    td.textContent = cellText.trim().replace(/"/g, '');
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            }
        }
        table.appendChild(tbody);
        container.innerHTML = '';
        container.appendChild(table);

    } catch (error) {
        container.innerHTML = `<p style="color: red;">Error loading timetable: ${error.message}</p>`;
        console.error('Error:', error);
    }
}