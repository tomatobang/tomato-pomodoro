'use strict';
const tomatoValidationRule = {
    userid: {
        type: 'string',
        required: true, allowEmpty: false,
    },
    title: {
        type: 'string', required: true, allowEmpty: false, min: 1, max: 50,
    },
    taskid: {
        type: 'string',
        required: true, allowEmpty: false,
    },
};

module.exports = tomatoValidationRule;
