const mongoose = require('mongoose');
const db = require('../model/mongoose');

function getFirst_lastDayOfMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = (new Date(year, month, 2)).toISOString().split('T')[0];
    const lastDay = (new Date(year, month + 1, 1)).toISOString().split('T')[0] ;
    
    return { firstDay, lastDay };
}


module.exports = {getFirst_lastDayOfMonth}