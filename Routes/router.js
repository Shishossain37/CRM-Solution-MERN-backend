const express = require("express");
const router = new express.Router();
const inventoryControllers = require("../Controllers/inventoryControllers");
const accountControllers = require("../Controllers/accountsController");
const employeeControllers = require("../Controllers/employeeControllers");
const customerControllers = require("../Controllers/customerControllers");
const appointmentControllers = require("../Controllers/appointmentControllers");
const upload = require("../multerconfig/storageConfig")
const userControllers = require("../Controllers/userControllers");

// middleware
const requireLogin = require('../middleware/requireLogin')

// routes
router.post("/user/signin", userControllers.userSignin);
router.post("/user/resister", userControllers.userResister);

// inventory routes
router.post("/user/add", upload.single("user_profile"), requireLogin, inventoryControllers.inventoryPost);
router.get("/user/details", inventoryControllers.inventoryGet);
router.get("/user/:id", inventoryControllers.singleinventoryget);
router.put("/user/edit/:id", upload.single("user_profile"), inventoryControllers.inventoryEdit);
router.delete("/user/delete/:id", inventoryControllers.inventoryDelete);

// Account routes
router.post("/account/add", accountControllers.accountPost);
router.get("/account/details", accountControllers.accountsGet);
router.get("/account/:id", accountControllers.singleAccountget);
router.put("/account/edit/:id", accountControllers.accountEdit);
router.delete("/account/delete/:id", accountControllers.accountDelete);


// employee routes
router.post("/employee/add", employeeControllers.employeePost);
router.get("/employee/details", employeeControllers.employeesGet);
router.get("/employee/:id", employeeControllers.singleemployeeget);
router.put("/employee/edit/:id", employeeControllers.employeeEdit);
router.delete("/employee/delete/:id", employeeControllers.employeeDelete);


// customer routes
router.post("/customer/add", customerControllers.customerPost);
router.get("/customer/details", customerControllers.customersGet);
router.get("/customer/:id", customerControllers.singlecustomerget);
router.put("/customer/edit/:id", customerControllers.customerEdit);
router.delete("/customer/delete/:id", customerControllers.customerDelete);


// appointment routes
router.post("/appointment/add", appointmentControllers.appointmentPost);
router.get("/appointment/details", appointmentControllers.appointmentGet);
router.get("/appointment/:id", appointmentControllers.singleappointmentget);
router.put("/appointment/edit/:id", appointmentControllers.appointmentEdit);
router.delete("/appointment/delete/:id", appointmentControllers.appointmentDelete);


module.exports = router