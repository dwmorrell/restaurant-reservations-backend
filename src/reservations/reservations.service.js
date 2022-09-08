/**
 * Reservations service file to query the "reservations" database
 */
const knex = require("../db/connection");

/**
 * Function to list reservations ordered by reservation time
 * @param {date}
 */
function list(date) {
  return knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .whereNot({ status: "finished" })
      .orderBy("reservation_time");
}

/**
 * Function to read a reservation given a reservation id
 * @param {resId}
 */
const read = (resId) => {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: resId })
    .first();
}

/**
 * Function to create a reservation 
 * @param {reservation}
 */
const create = (reservation) => {
  return knex("reservations")
    .insert(reservation)
    .returning("*");
}

/**
 * Function to edit and update a reservation given a reservation id
 * @param {reservation_id, reservation}
 */
const edit = (reservation_id, reservation) => {

    const first_name = reservation.first_name;
    const last_name = reservation.last_name;
    const mobile_number = reservation.mobile_number;
    const reservation_date = reservation.reservation_date;
    const reservation_time = reservation.reservation_time;
    const people = reservation.people;
    const status = reservation.status;

  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .update({ first_name, last_name, mobile_number, reservation_date, reservation_time, people, status }, "*")
}

/**
 * Function to search reservations based on a given mobile_number ordered by reservation date
 * @param {mobile_number}
 */
const search = (mobile_number) => {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");

}

/**
 * Async function to update the status of a reservation given a reservation id
 * @param {reservation_id, status}
 */
async function updateStatus(reservation_id, status) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .update({ status }, "*");
}

module.exports = {
  create,
  edit,
  list,
  read,
  search,
  updateStatus,
};
