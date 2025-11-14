document.getElementById('jsonFile').addEventListener('change', function (event) {
    const shiftNumber = +document.getElementById('shiftNumber')?.value || 1;

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const jsonData = JSON.parse(e.target.result); 
            const onlyTextData = jsonData.messages.filter(o=>!Array.isArray(o.text));
            const checpointTextData = onlyTextData.filter(o=>o.text.indexOf('Checkpoints ')===0);

            const text = checpointTextData.map((i, n) => {
                const server = i.text.split(' on ')[1];
                const type = i.text.indexOf('"Dialy"')!=-1 ? 'щотиждневої' : 'щоденної';
                // const date = i.date.replace('T', '&nbsp;&nbsp;');
                const date = i.date.split('T').map((d,i)=>i===1?d:d.split('-').toReversed().join('.')).join(' ');
                return `
                    <tr>
                        <td>${n+shiftNumber}</td>
                        <td>Створення ${type} резервної копії віртуальних машин на сервері ${server}</td>
                        <td>${date}</td>
                        <td></td>
                    </tr>
                `;
            }).join('');

            document.getElementById('tbody').innerHTML = text

        } catch (err) {
            console.error('Помилка парсинга JSON:', err);
            allert('Помилка парсинга JSON: дивись в console');
        }
    };

    reader.readAsText(file); // читаем файл как текст
});


function setNumSifter() {
    let shiftNumber = +document.getElementById('shiftNumber')?.value || 1;
    shiftNumber = shiftNumber<1 ? 1 : shiftNumber;
    document.querySelectorAll('#tbody>tr:not(.prev)>td:first-child').forEach((td, n)=>td.textContent=shiftNumber+n);
}

document.getElementById('shiftNumber').addEventListener('change', function (event) {
    // const shiftNumber = +document.getElementById('shiftNumber')?.value || 1;
    // document.querySelectorAll('#tbody>tr>td:first-child').forEach((td, n)=>td.textContent=shiftNumber+n);
    setNumSifter();
});


document.getElementById('tbody').addEventListener('click', function (event) {
    const tr = event.target.closest('tr');
    if (tr.classList.contains('prev')) {
        return;
    }
    if (tr.previousElementSibling === null) {
        tr.remove();
    }
    setNumSifter();
});