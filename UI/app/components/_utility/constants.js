
export const STRINGS = {
    PROJECT_NAME        : "GigUp",
    URL                 :(window.location.hostname).includes("localhost")? "http://172.20.20.129:1080/": window.location.origin+"/",
    API_PREFIX          : "api/",
    AUTH                : "auth/",
    CREATE_USER         : "register/",
    USER_DETAILS        : "getUserDetails/",
    UPDATE_USER_DETAILS : "updateUser/",
    CHANGE_PASSWORD     : "changePassword/",
    FORGOT_PASSWORD     : "forgotPassword/",
    RESET_PASSWORD      : "resetPassword/",
    CHECK_EMAIL         : "checkEmailExistance/",
    UPDATE_MATCHES      : "updateUserMatchedPlatforms/",
    GET_QUESTIONNAIRE   : "getSelectedQuestionnaires/",
    UPDATE_QUESTIONNAIRE: "updateUserSelectedQuestionnaires/",
    GET_MATCHES         : "getMatchedPlatforms/",
    LOGIN               : "login/",
    DASHBOARD           : "dashboard/"
}

export const REGEX = {
    EMAIL               : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    PASSWORD            : /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
    CAPITAL_LETTER      : /^.*[A-Z].*$/,
    SMALL_LETTER        : /^.*[a-z].*$/,
    NUMBER              : /^.*[0-9].*$/,
    SPECIAL_CHARACTER   : /^.*(?=.*[!@#$%^&+=]).*$/,
    LENGTH              : /^.*.{8,}.*$/,
    ZIP                 : /(^\d{5}(?:[\s]?[-\s][\s]?\d{4})?$)/,
    ALPHANUMERIC        : /[^A-Za-z0-9 ]/,
    EXPDATE             : /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/,
};

export const DB_MAP_UI = {
    usr_address_1           : {local : "address_1",               db : "addressLine1"},
    usr_address_2           : {local : "address_2",               db : "addressLine2"},
    usr_address_state       : {local : "usr_address_state",       db : "state"},
    usr_birthday            : {local : "usr_birthday",            db : "dateOfBirth"},
    usr_city                : {local : "usr_city",                db : "city"},
    usr_email               : {local : "usr_email",               db : "email"},
    usr_first_name          : {local : "usr_first_name",          db : "firstName"},
    usr_last_name           : {local : "usr_last_name",           db : "lastName"},
    usr_license_exp         : {local : "usr_license_exp",         db : "licenceExpDate"},
    usr_license_id          : {local : "usr_license_id",          db : "licenceNo"},
    usr_license_state       : {local : "usr_license_state",       db : "licenceState"},
    usr_nick_name           : {local : "usr_nick_name",           db : "nickName"},
    usr_password            : {local : "usr_password",            db : null},
    usr_password_confirm    : {local : "usr_password_confirm",    db : null},
    usr_phone               : {local : "usr_phone",               db : "phone"},
    usr_zip                 : {local : "usr_zip",                 db : "zipCode"}
}; 