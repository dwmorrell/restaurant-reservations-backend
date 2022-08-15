const service = require("./tables.service.js");
const reservationService = require("../reservations/reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function validTable(req, res, next) {

    if (!req.body.data) {
        return next({ status: 400, message: 'data is missing' });
    }

    const newTable = ({
        table_name,
        capacity
    } = req.body.data);

    const errorArray = [];
    
    if (!newTable.table_name || newTable.table_name.length < 2) {
        errorArray.push('table_name');
    }

    if (!newTable.capacity || (typeof newTable.capacity) !== 'number' || newTable.capacity < 1) {
        errorArray.push('capacity');
    }

    if (errorArray.length === 0) {
        res.locals.table = newTable;
        return next();
    }

    return next({ status: 400, message: `One or more inputs is invalid: ${errorArray.join(', ')} `});
};

async function validSeating(req, res, next) {

    if (!req.body.data) {
        return next({ status: 400, message: 'data is missing' });
    }

    const errorArray = [];

    const tableId = req.params.table_id;
    const table = await service.read(tableId);
    const tableCapacity = table.capacity;
    const tableResId = table.reservation_id;
    const resId = req.body.data.reservation_id;

    if (!resId) {
        return next({ status: 400, message: 'No reservation_id was recieved.' });
    }

    const reservation = await reservationService.read(resId);
    const peopleInParty = reservation.people;

    if (!reservation) {
        return next({ status: 404, message: `No reservation found with with ID: ${resId}. `});
    }

    if (reservation.status === 'seated') {
        return next({ status: 400, message: `Reservation with ID ${resId} has already been seated.`});
    }

    if (peopleInParty > tableCapacity) {
        errorArray.push('The people in the party exceed the tables capacity.');
    }

    if (tableResId) {
        errorArray.push(`The table is already occupied by reservation ID: ${tableResId}.`);
    }

    if (errorArray.length === 0) {
        return next();
    }

    return next({ status: 400, message: `One or more inputs is invalid: ${errorArray.join(', ')} `});
};

async function isOccupied(req, res, next) {

    const tableId = req.params.table_id;
    const table = await service.read(tableId);

    if (!table) {
        return next({ status: 400, message: `Table: ${tableId} does not exist.`});
    }

    const tableResId = table.reservation_id;

    if (!tableResId) {
        return next({ status: 400, message: `Table: ${tableId} is not occupied.`});
    }

    res.locals.table = table;

    return next();
};

async function create(req, res) {

    const table = res.locals.table;

    const newTable = await service.create(table);

    res.status(201).json({ data: newTable });
};

async function list(req, res) {

    let data = [];

    data = await service.list();

    res.json({ data });
};

async function seat(req, res) {

    const tableId = Number(req.params.table_id);
    const resId = req.body.data.reservation_id;
    const update = await service.seatUpdate(resId, tableId);

    res.status(200).json({ data: update[0] });
};

async function clear(req, res) {

    const tableId = Number(req.params.table_id);
    const resId = req.body.data.reservation_id;
    const clearedTable = await service.clear(resId, tableId);

    res.status(200).json({ data: clearedTable });

};

module.exports = {
    create: [validTable, asyncErrorBoundary(create)],
    clear: [asyncErrorBoundary(isOccupied), asyncErrorBoundary(clear)],
    list: asyncErrorBoundary(list),
    seat: [asyncErrorBoundary(validSeating), asyncErrorBoundary(seat)],
  };