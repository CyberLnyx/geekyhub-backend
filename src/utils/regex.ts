// const studentEmailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@tech-u\.edu\.ng$/;
const studentEmailRegex = /^[a-zA-Z\-]+\.[a-zA-Z\-]+@tech-u\.edu\.ng$/;

const adminEmailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/;

const matricNumberRegex = /^125\/(22|23)\/[12]\/\d{4}$/;

export const courseCodeRegex = /^[a-zA-Z]{3}[\d+]{3}/;

export {
  studentEmailRegex,
  matricNumberRegex,
  adminEmailRegex,
  validPasswordRegex,
};
