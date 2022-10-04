const express = require('express');
const router = express.Router();
const lhp = require('../controller/lhp');
const prep = require('../controller/preparation')
const locsheet = require('../controller/locsheet')

router.route('/').get(prep.home)
router.route('/preparation').post(prep.prep)
router.route('/:part/:nomorlhp/:line').get(lhp.mainPage)
router.route('/:part/:nomorlhp/:line/dt').get(lhp.DTPage)
router.route('/:part/:nomorlhp/:line/resume').get(lhp.resumePage)
router.route('/:part/:nomorlhp/:line/locsheet/:reject/:kodeloc/:kodeundo').get(locsheet.locSheetGet)
router.route('/:part/:nomorlhp/:line/locsheet/:reject/:kodeloc/:kodeundo').post(locsheet.locSheetPost)

module.exports = router